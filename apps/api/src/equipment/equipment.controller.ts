import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  Patch,
  Delete,
} from '@nestjs/common';
import { EquipmentService } from './equipment.service';
import { ZodValidationPipe } from 'src/common/pipe/zod-validator';
import {
  equipmentSchema,
  type UpdateStatusSchema,
  updateStatusSchema,
  type EquipmentValue,
} from '@repo/schemas';
import { EquipmentResponse } from '@repo/types';
import { GetEquipmentsQueryDto } from './dto/EquipmentDto';

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
    @Query() query: GetEquipmentsQueryDto,
  ): Promise<EquipmentResponse> {
    return this.equipmentService.getPaginatedEquipment(query);
  }

  @Get(':categoryId')
  async findByCategoryId(@Param('categoryId') id: string) {
    return this.equipmentService.getEquipmentByCategoryId({
      id,
    });
  }

  @Patch(':id/status')
  async updateStatus(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateStatusSchema)) data: UpdateStatusSchema,
  ) {
    return this.equipmentService.updateEquipmnetStatus(id, data);
  }

  @Delete(':id')
  async deleteEquipment(@Param('id') id: string) {
    return this.equipmentService.deleteEquipment(id);
  }
}
