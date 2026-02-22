import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from 'prisma/prisma.service';
import { formatDateToDDMMYY } from 'src/common/libs/formater/format.date';
import { GetStaffQueryDto, GetStudentQueryDto } from './dto/UsersDto';

@Injectable()
export class UserService {
  constructor(private readonly prisma: PrismaService) {}

  async create(data: Prisma.UserCreateInput) {
    const user = await this.prisma.user.create({
      data,
    });
    return user;
  }

  async findOne(data: Prisma.UserWhereUniqueInput) {
    const user = await this.prisma.user.findUnique({ where: data });

    return user;
  }

  async update(id: string, data: Prisma.UserUpdateInput) {
    const user = await this.prisma.user.update({ where: { id }, data });
    return user;
  }

  async findAll<T extends Prisma.UserSelect>(
    where: Prisma.UserWhereInput,
    select: T,
    skip?: number,
    limit?: number,
    orderBy?: Prisma.UserFindManyArgs['orderBy'],
  ) {
    return (await this.prisma.user.findMany({
      skip,
      take: limit,
      orderBy,
      where,
      select,
    })) as Array<Prisma.UserGetPayload<{ select: T }>>;
  }

  async findActiveStudents(params: {
    skip?: number;
    limit?: number;
    where: Prisma.UserWhereInput;
    orderBy:
      | Prisma.UserOrderByWithRelationInput
      | Prisma.UserOrderByWithRelationInput[];
  }) {
    const { skip, limit, where, orderBy } = params;

    const students = await this.findAll(
      { ...where, role: 'student' },
      {
        id: true,
        name: true,
        email: true,
        borrowedQTY: true,
        overDueQTY: true,
        role: true,
        profileImage: true,
        createdAt: true,
      },
      skip,
      limit,
      orderBy,
    );

    return students.map((student) => ({
      ...student,
      createdAt: formatDateToDDMMYY(student.createdAt),
    }));
  }

  async findActiveStaff(params: {
    skip?: number;
    limit?: number;
    where: Prisma.UserWhereInput;
    orderBy:
      | Prisma.UserOrderByWithRelationInput
      | Prisma.UserOrderByWithRelationInput[];
  }) {
    const { skip, limit, where, orderBy } = params;

    const staffs = await this.findAll(
      where,
      {
        id: true,
        name: true,
        email: true,
        role: true,
        profileImage: true,
        updatedAt: true,
        createdAt: true,
      },
      skip,
      limit,
      orderBy,
    );

    return staffs.map((staff) => ({
      ...staff,
      updatedAt: formatDateToDDMMYY(staff.updatedAt),
      createdAt: formatDateToDDMMYY(staff.createdAt),
    }));
  }

  async findTeacher(teacherId: string) {
    return this.prisma.user.findUnique({
      where: { id: teacherId },
    });
  }

  async findInstrutorMany() {
    return await this.prisma.user.findMany({
      where: { role: 'instructor' },
    });
  }

  async getPaginatedStaff(query: GetStaffQueryDto) {
    const { page = 1, limit, role, search, createdAt, updatedAt } = query;

    const where: Prisma.UserWhereInput = { role: { not: 'student' } };
    const orderBy: Prisma.UserOrderByWithRelationInput[] = [];

    // ใส่ลำดับความสำคัญ: สมมติว่าถ้าส่ง updatedAt มาให้ยึดอันนั้นก่อน
    if (updatedAt) {
      orderBy.push({ updatedAt });
    } else if (createdAt) {
      orderBy.push({ createdAt });
    } else {
      orderBy.push({ createdAt: 'desc' }); // Default fallback
    }

    if (role && role.length > 0) {
      where.role = { in: role };
    }

    if (search && search.length > 0) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    const skip = (page - 1) * limit;

    const [staffs, totalCount] = await Promise.all([
      this.findActiveStaff({ skip, limit, where, orderBy }),
      this.getUserCount(where),
    ]);

    return {
      data: staffs,
      meta: {
        totalCount,
        page,
        totalPage: Math.ceil(totalCount / limit),
      },
    };
  }
  async getPaginatedStudent(query: GetStudentQueryDto) {
    const {
      page = 1,
      limit,
      borrowed = 'desc',
      search,
      createdAt = 'desc',
      overDue = 'desc',
    } = query;

    const where: Prisma.UserWhereInput = {};
    const orderBy: Prisma.UserOrderByWithRelationInput[] = [];

    if (borrowed) {
      orderBy.push({ borrowedQTY: borrowed });
    }

    if (overDue) {
      orderBy.push({ overDueQTY: overDue });
    }

    if (createdAt) {
      orderBy.push({ createdAt: createdAt });
    }

    if (search && search.length > 0) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
      ];
    }

    const skip = (page - 1) * limit;

    const [students, totalCount] = await Promise.all([
      this.findActiveStudents({ skip, limit, where, orderBy }),
      this.getUserCount({ ...where, role: 'student' }),
    ]);

    return {
      data: students,
      meta: {
        totalCount,
        page,
        totalPage: Math.ceil(totalCount / limit),
      },
    };
  }

  async getUserCount(where: Prisma.UserWhereInput) {
    return await this.prisma.user.count({ where });
  }

  async updateRole(id: string, data: Prisma.UserUpdateInput) {
    const existingUser = await this.findOne({ id });

    if (!existingUser) {
      throw new NotFoundException('ไม่ผู้ใช้');
    }

    if (existingUser.role === data.role) {
      throw new BadRequestException('กรุณาเลือกบทบาทอื่น');
    }

    return await this.prisma.user.update({ where: { id }, data });
  }

  async checkIfModerater(userId: string): Promise<boolean> {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    });

    if (!user) return false;

    return user.role === 'administrater' || user.role === 'moderater';
  }
}
