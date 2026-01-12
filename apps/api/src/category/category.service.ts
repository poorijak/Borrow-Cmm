import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';

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
}
