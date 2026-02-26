import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from 'prisma/prisma.service';
import { formatDateToDDMMYY } from 'src/common/libs/formater/format.date';
import { GetRequestsQueryDto } from './dto/requestDto';
import { EquipmentStatus, LabStatus, Prisma } from '@prisma/client';
import { CourseService } from 'src/course/course.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class RequestService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly courseService: CourseService,
    private readonly userService: UserService,
  ) {}

  async getRequests(params: {
    skip?: number;
    take?: number;
    where?: Prisma.BorrowRequestWhereInput;
    orderBy?: Prisma.BorrowRequestOrderByWithRelationInput;
  }) {
    const { skip, take, where, orderBy } = params;

    return await this.prisma.borrowRequest.findMany({
      skip,
      take,
      where,
      orderBy: orderBy || { createdAt: 'desc' },
      include: {
        equipmentDetail: true,
        labBookingDetails: true,
      },
    });
  }

  async getRequestById(requestId: string) {
    const request = await this.prisma.borrowRequest.findUnique({
      where: { id: requestId },
      include: {
        equipmentDetail: {
          include: {
            equipmentRequestItems: {
              include: { equipment: true },
            },
          },
        },
        labBookingDetails: {
          include: {
            labBookings: {
              include: { laboratory: true },
            },
          },
        },
      },
    });

    if (!request) {
      throw new NotFoundException('ไม่พบคำขอนี้');
    }

    const isEquipment = request.equipmentDetail;
    const isLab = request.labBookingDetails;

    const getCourse = async (subjectId?: string) => {
      if (!subjectId) {
        return;
      }
      return await this.courseService.findById(subjectId);
    };

    const getInstrutor = async (instrutorId?: string) => {
      if (!instrutorId) return;

      return await this.userService.findTeacher(instrutorId);
    };

    return {
      ...request,
      equipmentDetail: isEquipment
        ? {
            ...request.equipmentDetail,
            course: await getCourse(request.equipmentDetail?.subjectId),
            teacher: await getInstrutor(request.equipmentDetail?.teacherId),
          }
        : null,
      labBookingDetails: isLab
        ? {
            ...request.labBookingDetails,
            course: await getCourse(request.labBookingDetails?.subjectId),
            teacher: await getInstrutor(request.labBookingDetails?.teacherId),
          }
        : null,
    };
  }

  async requestCount(where?: Prisma.BorrowRequestWhereInput) {
    return await this.prisma.borrowRequest.count({ where });
  }

  async getMyPaginatedRequests(userId: string, query: GetRequestsQueryDto) {
    return this.getPaginatedRequests({ ...query, userId } as any);
  }

  async getPaginatedRequests(query: GetRequestsQueryDto & { userId?: string }) {
    const {
      page = 1,
      limit = 10,
      search,
      status,
      type,
      subjectId,
      teacherId,
      orderByDate = 'desc',
      userId,
    } = query;
    const skip = (page - 1) * limit;

    const andConditions: Prisma.BorrowRequestWhereInput[] = [];

    // 1. Search condition
    if (search) {
      andConditions.push({
        OR: [
          { fullName: { contains: search, mode: 'insensitive' } },
          { studentId: { contains: search, mode: 'insensitive' } },
        ],
      });
    }

    // 2. Type condition
    if (type === 'equipment') {
      andConditions.push({ equipmentDetail: { isNot: null } });
    } else if (type === 'lab') {
      andConditions.push({ labBookingDetails: { isNot: null } });
    }

    // 3. Status condition
    if (status) {
      const statusConditions: Prisma.BorrowRequestWhereInput[] = [];

      // Special Case: pending -> equipmentDetail only
      if (status === 'pending') {
        statusConditions.push({
          equipmentDetail: { status: 'pending' as EquipmentStatus },
        });
      } else {
        // Dynamic Case
        const isEqStatus = Object.values(EquipmentStatus).includes(
          status as any,
        );
        const isLabStatus = Object.values(LabStatus).includes(status as any);

        if (isEqStatus) {
          statusConditions.push({
            equipmentDetail: { status: status as EquipmentStatus },
          });
        }
        if (isLabStatus) {
          statusConditions.push({
            labBookingDetails: { status: status as LabStatus },
            equipmentDetail: null, // Ensure it's treated as a lab request (align with mapper priority)
          });
        }
      }

      if (statusConditions.length > 0) {
        andConditions.push({ OR: statusConditions });
      } else {
        // If status invalid for both, return nothing
        andConditions.push({ id: 'none' });
      }
    }

    // 4. SubjectId condition
    if (subjectId && subjectId.length > 0) {
      andConditions.push({
        OR: [
          { equipmentDetail: { subjectId: { in: subjectId } } },
          { labBookingDetails: { subjectId: { in: subjectId } } },
        ],
      });
    }

    // 5. TeacherId condition
    if (teacherId && teacherId.length > 0) {
      andConditions.push({
        OR: [
          { equipmentDetail: { teacherId: { in: teacherId } } },
          { labBookingDetails: { teacherId: { in: teacherId } } },
        ],
      });
    }

    // 6. UserId condition
    if (userId) {
      andConditions.push({ userId });
    }

    const where: Prisma.BorrowRequestWhereInput = {
      AND: andConditions,
    };

    const [requests, totalCount] = await Promise.all([
      this.getRequests({
        skip,
        take: limit,
        where,
        orderBy: { createdAt: orderByDate },
      }),
      this.requestCount(where),
    ]);

    const data = await Promise.all(
      requests.map(async (req) => {
        const isEquipment = !!req.equipmentDetail;
        const detail = isEquipment
          ? req.equipmentDetail
          : req.labBookingDetails;

        let courseCode = 'ไม่ระบุ';
        if (detail?.subjectId) {
          const course = await this.courseService.findById(detail.subjectId);
          courseCode = course?.code || 'ไม่พบวิชา';
        }

        let teacherName = 'ไม่ระบุ';
        if (detail?.teacherId) {
          const teacher = await this.userService.findTeacher(detail.teacherId);
          teacherName = teacher?.name || 'ไม่พบอาจารย์';
        }

        return {
          id: req.id,
          status: detail?.status,
          requestType: isEquipment ? 'ยืม / คืน อุปกรณ์' : 'จองห้องปฏิบัติการ',
          borrower: req.fullName,
          createdAt: formatDateToDDMMYY(req.createdAt),
          subject: {
            subjectId: detail?.subjectId,
            sujectCode: courseCode,
          },
          teacher: {
            teacherId: detail?.teacherId,
            teacherName: teacherName,
          },
          purpose: isEquipment
            ? req.equipmentDetail?.purpose
            : req.labBookingDetails?.usageDetails,
        };
      }),
    );

    return {
      data,
      meta: {
        totalCount,
        page,
        totalPage: Math.ceil(totalCount / limit),
      },
    };
  }
}
