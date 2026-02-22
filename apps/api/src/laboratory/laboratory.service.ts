import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma, TimeSlot } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import {
  GetLabAvailableQueryDto,
  GetLaboratoryQueryDto,
} from './dto/labQuery.dto';
import { formatDateToDDMMYY } from 'src/common/libs/formater/format.date';
import { R2Service } from 'src/common/cloudflare/r2.service';
import { Cron, CronExpression } from '@nestjs/schedule';

@Injectable()
export class LaboratoryService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly r2: R2Service,
  ) {}

  async create(data: Prisma.LaboratoryCreateInput) {
    return await this.prisma.laboratory.create({ data });
  }

  async udpate(id: string, data: Prisma.LaboratoryUpdateInput) {
    const existingLab = await this.findOne(id);

    if (!existingLab) {
      throw new NotFoundException('ไม่พบห้องนี้');
    }

    if (typeof data.labCode === 'string') {
      const duplicatedLab = await this.prisma.laboratory.findFirst({
        where: { labCode: data.labCode, NOT: { id } },
      });

      if (duplicatedLab) {
        throw new BadRequestException('ห้องนี้มีอยู่แล้ว กรุณากรอกห้องอืน');
      }
    }

    return await this.prisma.laboratory.update({
      where: { id: existingLab.id },
      data,
    });
  }

  async availableLabs(bookingDate?: Date, slot?: TimeSlot) {
    if (!bookingDate || !slot) return;

    const conflic = await this.prisma.labBooking.findMany({
      where: {
        slot,
        bookingDate,
        status: {
          in: ['used', 'pending_teacher', 'pending_staff', 'approved'],
        },
      },
      select: {
        laboratoryId: true,
      },
    });

    return conflic;
  }

  async checkBusyLab(labId: string, bookingDate: Date, slot: TimeSlot) {
    const conflic = await this.prisma.labBooking.findUnique({
      where: { id: labId, bookingDate, slot },
    });

    return conflic;
  }

  async getLaboratory() {
    const labs = await this.prisma.laboratory.findMany({
      select: {
        id: true,
        name: true,
        image: true,
        status: true,
        labCode: true,
      },
    });

    return labs;
  }

  async getLaboratoryWithAvailable(query: GetLabAvailableQueryDto) {
    const { bookingDate, slot } = query;

    const booking = await this.availableLabs(bookingDate, slot);

    const busyLabIds = new Set(booking?.map((b) => b.laboratoryId));

    const labs = await this.prisma.laboratory.findMany({
      select: {
        id: true,
        name: true,
        image: true,
        status: true,
        labCode: true,
      },
    });

    return labs.map((lab) => ({
      ...lab,
      isAvailable: !busyLabIds.has(lab.id),
    }));
  }

  async updateStatus(id: string, data: Prisma.LaboratoryUpdateInput) {
    const existingLaboratory = await this.findOne(id);

    if (!existingLaboratory) {
      throw new NotFoundException('ไม่พบห้องนี้');
    }

    if (existingLaboratory.status === data.status) {
      throw new BadRequestException('กรุณาเลือกสถานะใหม่');
    }

    return await this.prisma.laboratory.update({ where: { id }, data });
  }

  async laboratoryCount(where: Prisma.LaboratoryWhereInput) {
    return await this.prisma.laboratory.count({ where });
  }

  async getPaginatedLab(query: GetLaboratoryQueryDto) {
    const { search, status, page = 1, limit = 10 } = query;

    const where: Prisma.LaboratoryWhereInput = {};

    if (status) {
      where.status = status;
    }

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { labCode: { contains: search, mode: 'insensitive' } },
      ];
    }

    const skip = (page - 1) * limit;

    const [labs, totalCount] = await Promise.all([
      this.findAll({ skip, limit, where }),
      this.laboratoryCount(where),
    ]);

    return {
      data: labs,
      meta: {
        totalCount,
        page,
        totalPage: Math.ceil(totalCount / limit),
      },
    };
  }

  async findAll(params: {
    skip?: number;
    limit?: number;
    where?: Prisma.LaboratoryWhereInput;
  }) {
    const { skip, limit, where } = params;

    const labs = await this.prisma.laboratory.findMany({
      skip,
      take: limit,
      where,
      select: {
        id: true,
        name: true,
        totalBorrowed: true,
        labCode: true,
        image: true,
        updatedAt: true,
        status: true,
      },
      orderBy: { labCode: 'asc' },
    });

    return labs.map((lab) => {
      return {
        ...lab,
        updatedAt: formatDateToDDMMYY(lab.updatedAt),
      };
    });
  }
  async findOne(id: string) {
    return await this.prisma.laboratory.findUnique({ where: { id } });
  }

  async delete(id: string) {
    const existingLaboratory = await this.findOne(id);

    if (!existingLaboratory) {
      throw new NotFoundException('ไม่พบห้องนี้');
    }

    if (existingLaboratory.image) {
      await this.r2.deleteImage(existingLaboratory.image);
    }
    return await this.prisma.laboratory.delete({ where: { id } });
  }
  @Cron(CronExpression.EVERY_HOUR)
  async handleCleanupLab() {
    return await this.prisma.labBooking.deleteMany({
      where: {
        expiresAt: {
          lt: new Date(),
        },
        // แนะนำเพิ่มเติม:
        status: 'pending_teacher', // หรือสถานะอื่นๆ ที่ถือว่า "ยังไม่สำเร็จแล้วปล่อยให้หลุด"
      },
    });
  }
}
