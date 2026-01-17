import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
} from '@nestjs/common';
import { EquipmentService } from './equipment.service';
import { ZodValidationPipe } from 'src/common/pipe/zod-validator';
import { equipmentSchema, type EquipmentValue } from '@repo/schemas';

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
}
