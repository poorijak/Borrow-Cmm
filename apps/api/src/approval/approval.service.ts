import {
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RequestStatus } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { formatDateThaiFull } from 'src/common/libs/formater/format.date';
import { UserService } from 'src/user/user.service';
import { UpdateApprovalDto } from './dto/update-approval.dto';
import { AuthUser } from '@repo/types';
import { CourseService } from 'src/course/course.service';

type payloadType = {
  requestId: string;
  equipmentDetailId?: string;
  labDetailId?: string;
};

@Injectable()
export class ApprovalService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly userService: UserService,
    private readonly courseService: CourseService,
  ) {}
  async findRequest(token: string, currentUser: AuthUser) {
    let payload: payloadType;
    try {
      payload = await this.jwt.verifyAsync<payloadType>(token, {
        secret: process.env.JWT_APPROVAL_SECRET,
      });
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Invalid token';
      throw new UnauthorizedException(errorMessage);
    }
    const { requestId, equipmentDetailId, labDetailId } = payload;

    if (!currentUser) {
      throw new UnauthorizedException('ไม่พบข้อมูลผู้ใช้จาก Session');
    }

    const request = await this.prisma.borrowRequest.findUnique({
      where: {
        id: requestId,
      },
      select: {
        id: true,
        userId: true,
        fullName: true,
        studentId: true,
        phone: true,
        email: true,
        educationLevel: true,
        idCardImage: true,
        status: true,
        equipmentDetail: true,
        labBookingDetails: true,
      },
    });

    if (!request) throw new NotFoundException('ไม่พบคำขอนี้');

    const isEquipmentOwner =
      request.equipmentDetail?.teacherId === currentUser.userId;

    const isLabOwner =
      request.labBookingDetails?.teacherId === currentUser.userId;

    const isModerater = await this.userService.checkIfModerater(
      currentUser.userId,
    );

    const canAccessEquipment = equipmentDetailId && isEquipmentOwner;
    const canAccessLab = labDetailId && isLabOwner;

    if (!canAccessEquipment && !canAccessLab && !isModerater) {
      throw new ForbiddenException('คุณไม่มีสิทธิ์เข้าถึงข้อมูลของคำขอนี้');
    }

    const equipmentDetail = equipmentDetailId
      ? await this.prisma.equipmentDetail.findUnique({
          where: { id: equipmentDetailId },
          select: {
            id: true,
            subjectId: true,
            purpose: true,
            teacherId: true,
            additionalItems: true,
            borrowDate: true,
            returnDate: true,
            status: true,
            equipmentRequestItems: {
              select: {
                quantity: true,
                equipment: true,
              },
            },
          },
        })
      : null;

    const labDetail = labDetailId
      ? await this.prisma.labBookingDetail.findUnique({
          where: { id: labDetailId },
          select: {
            id: true,
            subjectId: true,
            teacherId: true,
            usageDetails: true,
            memberNames: true,
            status: true,
            labBookings: {
              select: {
                id: true,
                bookingDate: true,
                slot: true,
                status: true,
                laboratoryId: true,
                laboratory: true,
              },
            },
          },
        })
      : null;

    const getSubjectLabel = async (id: string) => {
      const course = await this.courseService.findById(id);
      return course
        ? { code: course.code, label: course.label }
        : 'ไม่พบข้อมูลรายวิชา';
    };

    return {
      request,
      equipmentDetail: equipmentDetail
        ? {
            ...equipmentDetail,
            subjectDetail: await getSubjectLabel(equipmentDetail.subjectId),
            borrowDate: formatDateThaiFull(equipmentDetail?.borrowDate),
            returnDate: formatDateThaiFull(equipmentDetail?.returnDate),
          }
        : null,
      labDetail: labDetail
        ? {
            ...labDetail,
            subjectDetail: await getSubjectLabel(labDetail.subjectId),
            labBookings: labDetail?.labBookings.map((labBooking) => ({
              ...labBooking,
              bookingDate: formatDateThaiFull(labBooking.bookingDate),
            })),
          }
        : null,
    };
  }

  async updateSubRequestStatus(
    token: string,
    currentUser: AuthUser,
    { type, status, remark }: UpdateApprovalDto,
  ) {
    const payload: payloadType = await this.jwt.verifyAsync(token, {
      secret: process.env.JWT_APPROVAL_SECRET,
    });

    const { requestId } = payload;

    return await this.prisma.$transaction(async (tx) => {
      if ((type as string) === 'equipment') {
        const request = await this.prisma.equipmentDetail.findUnique({
          where: { requestId },
        });

        if (!request) throw new NotFoundException('ไม่พบคำขอนี้');

        const isOwner = request.teacherId === currentUser.userId;
        const isModerater = await this.userService.checkIfModerater(
          currentUser.userId,
        );

        if (!isOwner && !isModerater) {
          throw new ForbiddenException('คุณไม่มีสิทธิ์จัดการคำขอนี้');
        }

        await tx.equipmentDetail.update({
          where: {
            requestId,
          },
          data: {
            status,
            rejectedAt: (status as string) === 'rejected' ? new Date() : null,
            rejectedById:
              (status as string) === 'rejected' ? currentUser.userId : null,
            remark: (status as string) === 'rejected' ? remark : null,
          },
        });
      } else {
        const request = await this.prisma.equipmentDetail.findUnique({
          where: { requestId },
        });

        if (!request) throw new NotFoundException('ไม่พบคำขอนี้');

        const isOwner = request.teacherId === currentUser.userId;
        const isModerater = await this.userService.checkIfModerater(
          currentUser.userId,
        );

        if (!isOwner && !isModerater) {
          throw new ForbiddenException('คุณไม่มีสิทธิ์จัดการคำขอนี้');
        }

        await tx.labBookingDetail.update({
          where: {
            requestId,
          },
          data: {
            status:
              (status as string) === 'approved' ? 'pending_staff' : 'rejected',
            remark: (status as string) === 'rejected' ? remark : null,
            labBookings: {
              updateMany: {
                where: {},
                data: {
                  status:
                    (status as string) === 'approved'
                      ? 'pending_staff'
                      : 'rejected',
                },
              },
            },
          },
        });
      }

      const request = await tx.borrowRequest.findUnique({
        where: {
          id: requestId,
        },
        include: {
          equipmentDetail: true,
          labBookingDetails: true,
        },
      });

      if (!request) {
        throw new NotFoundException('ไม่พบคำขอนี้');
      }

      let newParentStatus: RequestStatus;

      const eqStatus = request.equipmentDetail?.status ?? 'approved';
      const labStatus = request.labBookingDetails?.status ?? 'approved';

      if (eqStatus === 'rejected' && labStatus === 'rejected') {
        newParentStatus = RequestStatus.rejected;
      } else if (eqStatus === 'approved' && labStatus === 'approved') {
        newParentStatus = RequestStatus.approved;
      } else {
        newParentStatus = RequestStatus.partially_approved;
      }

      return await tx.borrowRequest.update({
        where: {
          id: request.id,
        },
        data: {
          status: newParentStatus,
        },
      });
    });
  }
}
