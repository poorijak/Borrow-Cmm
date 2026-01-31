import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { ActiveStatus } from '@repo/types';
import { PrismaService } from 'prisma/prisma.service';
import { R2Service } from 'src/common/cloudflare/r2.service';
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

    const code = this.generateCategoryCode();

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
        code,
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
      throw new BadRequestException('ไม่พบหมวดหมู่นี้');
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
        include: {
          equipmentSubCategories: {
            include: {
              _count: {
                select: { equipment: true },
              },
            },
          },
        },
      });

      return cate.map(
        ({
          id,
          title,
          status,
          updatedAt,
          mainImage,
          equipmentSubCategories,
        }) => {
          const totalEquipment = equipmentSubCategories.reduce(
            (acc, sub) => acc + sub._count.equipment,
            0,
          );

          return {
            id,
            title,
            status,
            updatedAt: formatDateToDDMMYY(updatedAt),
            mainImage,
            equipmentCount: totalEquipment,
          };
        },
      );
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
      include: {
        _count: {
          select: {
            equipment: true,
          },
        },
      },
    });

    return subCate.map(({ id, title, updatedAt, _count }) => ({
      id,
      title,
      updatedAt: formatDateToDDMMYY(updatedAt),
      equipmentCout: _count.equipment,
    }));
  }

  async getSubCategoriesAll() {
    return await this.prisma.equipmentSubCategory.findMany();
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

  async getSubCategoryById(id: string) {
    return this.prisma.equipmentSubCategory.findUnique({ where: { id } });
  }

  async getPaginatedSubCategories(
    mainCategoryId: string,
    params: { page: number; limit: number },
  ) {
    const skip = (params.page - 1) * params.limit;

    const [data, totalCount] = await Promise.all([
      this.getSubCategories(mainCategoryId, { skip, limit: params.limit }),
      this.countSubCategories({ mainCategoryId }),
    ]);

    return {
      data,
      meta: {
        totalCount,
        page: params.page,
        totalPages: Math.ceil(totalCount / params.limit),
      },
    };
  }
  async getPaginatedCategories(
    status: ActiveStatus,
    params: { page: number; limit: number },
  ) {
    const skip = (params.page - 1) * params.limit;

    const where = status ? { status } : undefined;

    const [data, total] = await Promise.all([
      this.getCategories({ skip, limit: params.limit, where }),
      this.countCategories({ where }),
    ]);

    return {
      data: data,
      meta: {
        page: params.page,
        total,
        totalPages: Math.ceil(total / params.limit),
      },
    };
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

  async deleteSubCategory(id: string) {
    const existingSubCate = await this.getSubCategoryById(id);

    if (!existingSubCate) {
      throw new NotFoundException('ไม่พบหมวดหมู่นี้');
    }

    return await this.prisma.equipmentSubCategory.delete({
      where: { id },
    });
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

  generateCategoryCode() {
    return 'CUSTOM_' + Date.now().toString(36).toUpperCase();
  }
}
