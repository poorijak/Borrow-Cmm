import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { GetCourseQueryDTO } from './dto/course.dto';
import { formatDateToDDMMYY } from 'src/common/libs/formater/format.date';

@Injectable()
export class CourseService {
  constructor(private readonly prisma: PrismaService) {}
  async create(data: Prisma.CourseCreateInput) {
    return await this.prisma.course.create({ data });
  }

  async udpate(id: string, data: Prisma.CourseUpdateInput) {
    const existingCourse = await this.findById(id);

    if (!existingCourse) {
      throw new NotFoundException('ไม่พบรายวิชานี้');
    }

    if (typeof data.code === 'string') {
      const duplicatedCourse = await this.prisma.course.findFirst({
        where: {
          code: data.code,
          NOT: { id },
        },
      });

      if (duplicatedCourse) {
        throw new BadRequestException('รายวิชามีอยู่แล้ว โปรดเลือกรายวิชาใหม่');
      }
    }

    return await this.prisma.course.update({
      where: { id: existingCourse.id },
      data: { label: data.label, code: data.code },
    });
  }

  async findAll(params: {
    skip?: number;
    limit?: number;
    where?: Prisma.CourseWhereInput;
  }) {
    const { skip, limit, where } = params;

    const courses = await this.prisma.course.findMany({
      skip,
      take: limit,
      where,
      select: {
        id: true,
        label: true,
        code: true,
        updatedAt: true,
        status: true,
      },
      orderBy: {
        code: 'asc',
      },
    });

    return courses.map((c) => {
      return {
        ...c,
        updatedAt: formatDateToDDMMYY(c.updatedAt),
      };
    });
  }

  async findList() {
    const courses = await this.prisma.course.findMany({
      where: {
        status: 'active',
      },
      orderBy: {
        code: 'asc',
      },
    });

    return courses.map((course) => ({
      ...course,
      displayName: `${course.code} || ${course.label}`,
    }));
  }

  async findById(id: string) {
    return await this.prisma.course.findUnique({ where: { id } });
  }

  async courseCount() {
    return await this.prisma.course.count();
  }

  async getPaginatedCourse(query: GetCourseQueryDTO) {
    const { search, status, page, limit } = query;

    const where: Prisma.CourseWhereInput = {};

    if (status) {
      where.status = status;
    }

    if (search && search.length > 0) {
      where.OR = [
        { label: { contains: search, mode: 'insensitive' } },
        { code: { contains: search, mode: 'insensitive' } },
      ];
    }

    const skip = (page - 1) * limit;

    const [courses, totalCount] = await Promise.all([
      this.findAll({ skip, limit, where }),
      this.courseCount(),
    ]);

    return {
      data: courses,
      meta: {
        totalCount,
        page,
        totalPage: Math.ceil(totalCount / limit),
      },
    };
  }

  async updateStatus(id: string, data: Prisma.CourseUpdateInput) {
    const course = await this.prisma.course.findUnique({ where: { id } });

    if (!course) {
      throw new NotFoundException('ไม่พบรายวิชานี้');
    }

    if (typeof data.status === 'string' && course.status === data.status) {
      throw new BadRequestException('กรุณาเลือกสถานะอื่น');
    }
    return await this.prisma.course.update({ where: { id }, data });
  }

  async deleteCourse(id: string) {
    return await this.prisma.course.delete({ where: { id } });
  }
}
