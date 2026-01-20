import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  DefaultValuePipe,
  ParseIntPipe,
  Query,
  Patch,
} from '@nestjs/common';
import { EquipmentService } from './equipment.service';
import { ZodValidationPipe } from 'src/common/pipe/zod-validator';
import {
  equipmentSchema,
  type UpdateStatusSchema,
  updateStatusSchema,
  type EquipmentValue,
} from '@repo/schemas';
import { EquipmentResponse, type ActiveStatus } from '@repo/types';
import { Prisma } from '@prisma/client';

@Controller('equipment')
export class EquipmentController {
  constructor(private readonly equipmentService: EquipmentService) {}

  @Post()
  create(@Body(new ZodValidationPipe(equipmentSchema)) body: EquipmentValue) {
    return this.equipmentService.create({
      title: body.title,
      description: body.description,
      mainImage: body.imageKey,
      totalStock: body.totalStock,
      borrowedQty: 0,
      reservedQty: 0,
      status: 'active',
      category: {
        connect: {
          id: body.subCategoryId,
        },
      },
    });
  }

  @Patch(':id')
  udpateEquipment(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(equipmentSchema)) body: EquipmentValue,
  ) {
    return this.equipmentService.updateData(id, {
      title: body.title,
      description: body.description,
      totalStock: body.totalStock,
      mainImage: body.imageKey,
      status: body.status,
      category: {
        connect: {
          id: body.subCategoryId,
        },
      },
    });
  }
  @Get()
  async findAll(
    @Query('status') status: ActiveStatus,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('categoryId') categoryId: string,
  ): Promise<EquipmentResponse> {
    const where: Prisma.EquipmentWhereInput = {};

    if (status) where.status = status;

    if (categoryId)
      where.category = {
        mainCategoryId: categoryId,
      };

    const skip = (page - 1) * limit;

    const [equipments, totalCount] = await Promise.all([
      this.equipmentService.getEquipments({ skip, limit, where }),
      this.equipmentService.equipmentCount(),
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

  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateStatusSchema)) data: UpdateStatusSchema,
  ) {
    return this.equipmentService.updateEquipmnetStatus(id, data);
  }
}
