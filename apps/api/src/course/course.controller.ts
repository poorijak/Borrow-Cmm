import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { CourseService } from './course.service';
import {
  courseFormSchema,
  type UpdateStatusSchema,
  updateStatusSchema,
  type CourseValue,
} from '@repo/schemas';
import { ActiveStatus } from '@prisma/client';
import { ZodValidationPipe } from 'src/common/pipe/zod-validator';
import { GetCourseQueryDTO } from './dto/course.dto';
import { AuthGuard } from '@nestjs/passport';
import { RoleGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorators/role.decorator';
import { Role } from 'src/admin/role.enum';

@Controller('course')
@UseGuards(AuthGuard('jwt'), RoleGuard)
@Roles(Role.ADMIN, Role.INSTRUCTOR)
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Post()
  @Roles(Role.ADMIN)
  create(@Body(new ZodValidationPipe(courseFormSchema)) body: CourseValue) {
    return this.courseService.create({
      label: body.label,
      code: body.code,
      status: ActiveStatus.active,
    });
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  update(
    @Body(new ZodValidationPipe(courseFormSchema)) body: CourseValue,
    @Param('id') id: string,
  ) {
    return this.courseService.udpate(id, body);
  }

  @Get()
  findAll(@Query() query: GetCourseQueryDTO) {
    return this.courseService.getPaginatedCourse(query);
  }

  @Patch(':id/status')
  @Roles(Role.ADMIN)
  updateStatus(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateStatusSchema)) body: UpdateStatusSchema,
  ) {
    return this.courseService.updateStatus(id, body);
  }

  @Delete(':id')
  @Roles(Role.ADMIN)
  delete(@Param('id') id: string) {
    return this.courseService.deleteCourse(id);
  }
}
