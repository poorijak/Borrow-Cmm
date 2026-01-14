import { BadRequestException, Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { formatDateToDDMMYY } from 'src/common/libs/formater/format.date';

@Injectable()
export class CategoryService {
  constructor(private readonly prisma: PrismaService) {}
  async createMain(data: Prisma.EquipmentCategoryCreateInput) {
    const cate = await this.prisma.equipmentCategory.create({
      data,
    });
    return cate;
  }

  async updateMain(id: string, data: Prisma.EquipmentCategoryUpdateInput) {
    const cate = await this.getCategory(id);

    if (!cate) {
      throw new BadRequestException('Category not found');
    }

    return await this.prisma.equipmentCategory.update({
      where: { id: cate.id },
      data,
    });
  }

  async createSub(data: Prisma.EquipmentSubCategoryCreateInput) {
    const cate = await this.prisma.equipmentSubCategory.create({
      data,
    });

    return cate;
  }

  async getCategories(params: {
    where?: Prisma.EquipmentCategoryWhereInput;
    skip?: number;
    limit?: number;
  }) {
    try {
      const { where, skip = 0, limit = 1 } = params;
      const cate = await this.prisma.equipmentCategory.findMany({
        skip,
        take: limit,
        where,
      });

      return cate.map(({ id, title, status, updatedAt, mainImage }) => ({
        id,
        title,
        status,
        updatedAt: formatDateToDDMMYY(updatedAt),
        mainImage,
        equipmentCount: 1,
      }));
    } catch (error) {
      console.error(error);

      throw error;
    }
  }

  async getCategory(id: string) {
    const cate = await this.prisma.equipmentCategory.findUnique({
      where: { id },
    });

    return cate;
  }

  async countCategories(params: {
    where?: Prisma.EquipmentCategoryWhereInput;
  }) {
    const { where } = params;
    return await this.prisma.equipmentCategory.count({ where });
  }
}
