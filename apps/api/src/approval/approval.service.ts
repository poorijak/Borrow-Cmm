import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { RequestStatus } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import {
  formatDateThaiFull,
  formatDateToDDMMYY,
} from 'src/common/libs/formater/format.date';
import { UserService } from 'src/user/user.service';
import { UpdateApprovalDto } from './dto/update-approval.dto';

type payloadType = {
  requestId: string;
  teacherId: string;
  equipmentDetailId?: string;
  labDetailId?: string;
};

@Injectable()
export class ApprovalService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly jwt: JwtService,
    private readonly userService: UserService,
  ) {}
  async findRequest(token: string) {
    const payload: payloadType = await this.jwt.verifyAsync(token, {
      secret: process.env.JWT_APPROVAL_SECRET,
    });

    const { requestId, teacherId, equipmentDetailId, labDetailId } = payload;

    const teacher = await this.userService.findTeacher(teacherId);

    if (!teacher) {
      throw new NotFoundException('ไม่พบอาจารย์');
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
      },
    });

    const equipmentDetail = equipmentDetailId
      ? await this.prisma.equipmentDetail.findUnique({
          where: { id: equipmentDetailId, teacherId },
          select: {
            id: true,
            subjectId: true,
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
          where: { id: labDetailId, teacherId },
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

    return {
      request,
      equipmentDetail: {
        ...equipmentDetail,
        borrowDate: formatDateThaiFull(equipmentDetail?.borrowDate),
        returnDate: formatDateThaiFull(equipmentDetail?.returnDate),
      },
      labDetail: {
        ...labDetail,
        labBookings: labDetail?.labBookings.map((labBooking) => ({
          ...labBooking,
          bookingDate: formatDateThaiFull(labBooking.bookingDate),
        })),
      },
    };
  }

  async updateSubRequestStatus(
    token: string,
    { type, status, remark }: UpdateApprovalDto,
  ) {
    const payload: payloadType = await this.jwt.verifyAsync(token, {
      secret: process.env.JWT_APPROVAL_SECRET,
    });

    const { requestId, teacherId } = payload;

    return await this.prisma.$transaction(async (tx) => {
      if ((type as string) === 'equipment') {
        await tx.equipmentDetail.update({
          where: {
            requestId,
            teacherId,
          },
          data: {
            status,
            rejectedAt: (status as string) === 'rejected' ? new Date() : null,
            rejectedById: (status as string) === 'rejected' ? teacherId : null,
            remark: (status as string) === 'rejected' ? remark : null,
          },
        });
      } else {
        await tx.labBookingDetail.update({
          where: {
            requestId,
            teacherId,
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
