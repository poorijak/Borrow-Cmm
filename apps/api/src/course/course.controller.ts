import {
  Controller,
  Get,
  Post,
  Body,
  Query,
  Patch,
  Param,
  Delete,
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

@Controller('course')
export class CourseController {
  constructor(private readonly courseService: CourseService) {}

  @Post()
  upsert(@Body(new ZodValidationPipe(courseFormSchema)) body: CourseValue) {
    return this.courseService.upsert({
      where: { id: body.courseId || '' },
      update: {
        label: body.label,
        code: body.code,
        status: ActiveStatus.active,
      },
      create: {
        label: body.label,
        code: body.code,
        status: ActiveStatus.active,
      },
    });
  }

  @Get()
  findAll(@Query() query: GetCourseQueryDTO) {
    return this.courseService.getPaginatedCourse(query);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateStatusSchema)) body: UpdateStatusSchema,
  ) {
    return this.courseService.updateStatus(id, body);
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.courseService.deleteCourse(id);
  }
}
