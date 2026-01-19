import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { Equipment } from '@repo/types';
import { PrismaService } from 'prisma/prisma.service';
import { formatDateToDDMMYY } from 'src/common/libs/formater/format.date';

@Injectable()
export class EquipmentService {
  constructor(private readonly prisma: PrismaService) {}

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

  async getEquipments(params: {
    skip?: number;
    limit?: number;
    where?: Prisma.EquipmentWhereInput;
  }): Promise<Equipment[]> {
    const { skip = 1, limit = 10, where } = params;

    const equipments = await this.prisma.equipment.findMany({
      skip,
      take: limit,
      where,
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

  async equipmentCount() {
    return await this.prisma.equipment.count();
  }
}
