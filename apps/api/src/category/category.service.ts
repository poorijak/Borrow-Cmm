import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { R2Service } from 'src/cloudflare/r2.service';
import { formatDateToDDMMYY } from 'src/common/libs/formater/format.date';

@Injectable()
export class CategoryService {
  constructor(
    private readonly prisma: PrismaService,
    private r2: R2Service,
  ) {}
  async createMain(data: Prisma.EquipmentCategoryCreateInput) {
    const cate = await this.prisma.equipmentCategory.create({
      data,
    });
    return cate;
  }

  async upsertSubCate(
    data: { title: string },
    mainCateId: string,
    id?: string,
  ) {
    const existingCate = await this.prisma.equipmentCategory.findUnique({
      where: { id: mainCateId },
    });

    if (!existingCate) {
      throw new NotFoundException('ไม่พบหมวดหมู่นี้');
    }

    const subCate = await this.prisma.equipmentSubCategory.upsert({
      where: {
        id: id || '',
      },
      update: {
        title: data.title,
      },
      create: {
        title: data.title,
        mainCategory: {
          connect: {
            id: existingCate.id,
          },
        },
        status: 'active',
      },
    });

    return subCate;
  }

  async updateMain(id: string, data: Prisma.EquipmentCategoryUpdateInput) {
    const cate = await this.getCategoryById(id);

    if (!cate) {
      throw new BadRequestException('Category not found');
    }

    return await this.prisma.equipmentCategory.update({
      where: { id: cate.id },
      data,
    });
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

  async getSubCategories(
    mainCategoryId: string,
    params: {
      skip?: number;
      limit?: number;
    },
  ) {
    const { skip = 0, limit = 1 } = params;
    const existingCate = await this.getCategoryById(mainCategoryId);

    if (!existingCate) {
      throw new NotFoundException('ไม่พบหมวดหมู่นี้');
    }

    const subCate = await this.prisma.equipmentSubCategory.findMany({
      where: {
        mainCategoryId,
      },
      skip,
      take: limit,
    });

    return subCate.map(({ id, title, updatedAt }) => ({
      id,
      title,
      updatedAt: formatDateToDDMMYY(updatedAt),
      equipmentCout: 1,
    }));
  }

  async getCategoryById(id: string) {
    const cate = await this.prisma.equipmentCategory.findUnique({
      where: { id },
    });

    if (!cate) {
      throw new NotFoundException('Category not found');
    }

    return cate;
  }

  async countCategories(params: {
    where?: Prisma.EquipmentCategoryWhereInput;
  }) {
    const { where } = params;
    return await this.prisma.equipmentCategory.count({ where });
  }

  async countSubCategories(where: Prisma.EquipmentSubCategoryWhereInput) {
    return await this.prisma.equipmentSubCategory.count({ where });
  }

  async deleteCategory(id: string) {
    const cate = await this.getCategoryById(id);

    if (!cate) {
      throw new NotFoundException('Cateogory not found');
    }

    if (cate.mainImage) {
      try {
        await this.r2.deleteImage(cate.mainImage);
      } catch (err) {
        console.warn('R2 delete failed:', err);
      }
    }

    await this.prisma.equipmentCategory.delete({ where: { id } });

    return { sucess: true };
  }

  async updateMainCateStatus(
    id: string,
    data: Prisma.EquipmentCategoryUpdateInput,
  ) {
    const cate = await this.getCategoryById(id);

    if (!cate) {
      throw new NotFoundException('Category not found');
    }

    if (cate.status === data.status) {
      throw new BadRequestException('กรุณาเลือกหมวดหมู่อื่น');
    }
    return await this.prisma.equipmentCategory.update({
      where: { id },
      data,
    });
  }
}
