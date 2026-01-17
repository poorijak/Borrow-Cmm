import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';

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
}
