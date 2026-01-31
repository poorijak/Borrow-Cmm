import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  Delete,
} from '@nestjs/common';
import { LaboratoryService } from './laboratory.service';
import { ZodValidationPipe } from 'src/common/pipe/zod-validator';
import {
  laboratorySchema,
  type UpdateStatusSchema,
  updateStatusSchema,
  type LaboratoryValue,
} from '@repo/schemas';
import { GetLaboratoryQueryDto } from './dto/labQuery.dto';

@Controller('laboratory')
export class LaboratoryController {
  constructor(private readonly laboratoryService: LaboratoryService) {}

  @Post()
  create(@Body(new ZodValidationPipe(laboratorySchema)) body: LaboratoryValue) {
    return this.laboratoryService.create({
      name: body.name,
      labCode: body.labCode,
      status: 'active',
      totalBorrowed: 0,
      image: body.imageKey,
    });
  }

  @Patch(':id')
  update(
    @Body(new ZodValidationPipe(laboratorySchema)) body: LaboratoryValue,
    @Param('id') id: string,
  ) {
    return this.laboratoryService.udpate(id, {
      name: body.name,
      image: body.imageKey,
      labCode: body.labCode,
      status: body.status,
    });
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateStatusSchema)) body: UpdateStatusSchema,
  ) {
    return this.laboratoryService.updateStatus(id, body);
  }

  @Get()
  findAll(@Query() query: GetLaboratoryQueryDto) {
    return this.laboratoryService.getPaginatedLab(query);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.laboratoryService.delete(id);
  }
}
