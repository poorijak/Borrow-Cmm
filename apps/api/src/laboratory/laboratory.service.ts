import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { GetLaboratoryQueryDto } from './dto/labQuery.dto';
import { formatDateToDDMMYY } from 'src/common/libs/formater/format.date';
import { R2Service } from 'src/common/cloudflare/r2.service';

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
}
