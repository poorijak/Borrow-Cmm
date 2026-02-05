import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Query,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { LaboratoryService } from './laboratory.service';
import { ZodValidationPipe } from 'src/common/pipe/zod-validator';
import {
  laboratorySchema,
  type UpdateStatusSchema,
  updateStatusSchema,
  type LaboratoryValue,
} from '@repo/schemas';
import {
  GetLabAvailableQueryDto,
  GetLaboratoryQueryDto,
} from './dto/labQuery.dto';
import { AuthGuard } from '@nestjs/passport';
import { RoleGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorators/role.decorator';
import { Role } from 'src/admin/role.enum';

@Controller('laboratory')
@UseGuards(AuthGuard('jwt'), RoleGuard)
@Roles(Role.ADMIN, Role.MODERATOR)
export class LaboratoryController {
  constructor(private readonly laboratoryService: LaboratoryService) {}

  @Post()
  @Roles(Role.ADMIN)
  create(@Body(new ZodValidationPipe(laboratorySchema)) body: LaboratoryValue) {
    return this.laboratoryService.create({
      name: body.name,
      labCode: body.labCode,
      status: 'active',
      totalBorrowed: 0,
      image: body.imageKey,
    });
  }

  @Get()
  getLabs() {
    return this.laboratoryService.getLaboratory();
  }

  @Get('available')
  getLabAvailable(@Query() query: GetLabAvailableQueryDto) {
    return this.laboratoryService.getLaboratoryWithAvailable(query);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
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
  @Roles(Role.ADMIN)
  updateStatus(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateStatusSchema)) body: UpdateStatusSchema,
  ) {
    return this.laboratoryService.updateStatus(id, body);
  }

  @Get('/admin')
  findAll(@Query() query: GetLaboratoryQueryDto) {
    return this.laboratoryService.getPaginatedLab(query);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  delete(@Param('id') id: string) {
    return this.laboratoryService.delete(id);
  }
}
