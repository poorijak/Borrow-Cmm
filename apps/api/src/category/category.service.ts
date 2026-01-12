import { Injectable } from '@nestjs/common';
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

  async createSub(data: Prisma.EquipmentSubCategoryCreateInput) {
    const cate = await this.prisma.equipmentSubCategory.create({
      data,
    });

    return cate;
  }

  async getCategories(params: { where?: Prisma.EquipmentCategoryWhereInput }) {
    try {
      const { where } = params;
      const cate = await this.prisma.equipmentCategory.findMany({
        where,
      });

      return cate.map(({ id, title, status, updatedAt, mainImage }) => ({
        id,
        title,
        status,
        updatedAt: formatDateToDDMMYY(updatedAt),
        mainImage,
      }));
    } catch (error) {
      console.error(error);

      throw error;
    }
  }
}
