import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Equipment } from '@repo/types';
import { PrismaService } from 'prisma/prisma.service';
import { R2Service } from 'src/cloudflare/r2.service';
import { formatDateToDDMMYY } from 'src/common/libs/formater/format.date';
import { GetEquipmentsQueryDto } from './dto/EquipmentDto';

@Injectable()
export class EquipmentService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly r2: R2Service,
  ) {}

  async create(data: Prisma.EquipmentCreateInput) {
    return await this.prisma.equipment.create({
      data,
      include: {
        category: {
          include: {
            mainCategory: true,
          },
        },
      },
    });
  }

  async updateData(id: string, data: Prisma.EquipmentUpdateInput) {
    return this.prisma.equipment.update({
      where: { id },
      data,
    });
  }

  async getEquipments(params: {
    skip?: number;
    limit?: number;
    where?: Prisma.EquipmentWhereInput;
    orderBy?: Prisma.EquipmentOrderByWithRelationInput;
  }): Promise<Equipment[]> {
    const { skip, limit, where, orderBy } = params;

    const equipments = await this.prisma.equipment.findMany({
      skip,
      take: limit,
      where,
      orderBy,
      include: {
        category: {
          select: {
            title: true,
            id: true,
            mainCategory: {
              select: { id: true, title: true },
            },
          },
        },
      },
    });

    return equipments.map(
      ({
        id,
        mainImage,
        title,
        description,
        totalStock,
        borrowedQty,
        reservedQty,
        status,
        updatedAt,
        category,
      }) => {
        const mainCategoryTitle = category.mainCategory.title;
        const mainCategoryId = category.mainCategory.id;

        return {
          id,
          mainImage,
          title,
          description,
          totalStock,
          borrowedQty,
          reservedQty,
          status,
          updatedAt: formatDateToDDMMYY(updatedAt),
          subCategory: {
            id: category.id,
            title: category.title,
          },
          mainCategory: {
            id: mainCategoryId,
            title: mainCategoryTitle,
          },
        };
      },
    );
  }

  async getEquipmenById(id: string) {
    return await this.prisma.equipment.findUnique({ where: { id } });
  }

  async getEquipmentByCategoryId(
    where: Prisma.EquipmentCategoryWhereUniqueInput,
  ) {
    const data = await this.prisma.equipmentCategory.findUnique({
      where,
      select: {
        id: true,
        title: true,
        mainImage: true,
        equipmentSubCategories: {
          select: {
            id: true,
            title: true,
            status: true,
            equipment: {
              select: {
                id: true,
                title: true,
                mainImage: true,
                description: true,
                totalStock: true,
                borrowedQty: true,
                reservedQty: true,
                status: true,
                subCategoryId: true,
              },
            },
          },
        },
      },
    });

    if (!data) return { category: null };

    return {
      category: {
        ...data,
        subCategory: data.equipmentSubCategories.map((s) => ({
          ...s,
          equipments: s.equipment,
        })),
      },
    };
  }

  async getPaginatedEquipment(query: GetEquipmentsQueryDto) {
    const {
      status,
      categoryId,
      subCategoryId,
      page,
      limit = 10,
      totalStock = 'desc', // กำหนด Default ตรงนี้ได้เลย
      search,
    } = query;

    const where: Prisma.EquipmentWhereInput = {};
    const orderBy: Prisma.EquipmentOrderByWithRelationInput = {};

    if (status) where.status = status;

    if (search && search.length > 0) {
      where.OR = [{ title: { contains: search, mode: 'insensitive' } }];
    }
    if (categoryId && categoryId.length > 0) {
      where.category = {
        mainCategoryId: { in: categoryId },
      };
    }

    if (subCategoryId && subCategoryId.length > 0) {
      where.subCategoryId = { in: subCategoryId };
    }

    if (totalStock) {
      orderBy.totalStock = totalStock;
    }

    const skip = (page - 1) * limit;

    const [equipments, totalCount] = await Promise.all([
      this.getEquipments({ skip, limit, where, orderBy }),
      this.equipmentCount(),
    ]);

    return {
      data: equipments,
      meta: {
        totalCount,
        page,
        totalPage: Math.ceil(totalCount / limit),
      },
    };
  }

  async equipmentCount() {
    return await this.prisma.equipment.count();
  }

  async updateEquipmnetStatus(id: string, data: Prisma.EquipmentUpdateInput) {
    const equipment = await this.prisma.equipment.findUnique({ where: { id } });

    if (!equipment) {
      throw new NotFoundException('ไม่พบหมวดหมู่นี้');
    }

    if (equipment.status === data.status) {
      throw new BadRequestException('กรุณาเลือกหมวดหมู่อื่น');
    }
    return await this.prisma.equipment.update({ where: { id }, data });
  }

  async deleteEquipment(id: string) {
    const existingEquipment = await this.getEquipmenById(id);

    if (!existingEquipment) {
      throw new NotFoundException('ไม่พบอุปกรณ์นี้');
    }

    if (existingEquipment.mainImage) {
      await this.r2.deleteImage(existingEquipment.mainImage);
    }

    return await this.prisma.equipment.delete({ where: { id } });
  }
}
