import {
  Controller,
  Get,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UserService } from './user.service';
import {
  GetStaffQueryDto,
  GetStudentQueryDto,
  UpdateUserRoleDto,
} from './dto/UsersDto';
import { AuthGuard } from '@nestjs/passport';
import { RoleGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorators/role.decorator';
import { Role } from 'src/admin/role.enum';
import { ZodValidationPipe } from 'src/common/pipe/zod-validator';
import { updateUserRole } from '@repo/schemas';

@Controller('user')
@UseGuards(AuthGuard('jwt'), RoleGuard)
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('/student')
  @Roles(Role.ADMIN, Role.MODERATOR)
  findStudents(@Query() query: GetStudentQueryDto) {
    return this.userService.getPaginatedStudent(query);
  }
  @Get('/staff')
  @Roles(Role.ADMIN, Role.MODERATOR)
  findStaffs(@Query() query: GetStaffQueryDto) {
    return this.userService.getPaginatedStaff(query);
  }

  @Patch(':id')
  @Roles(Role.ADMIN)
  updateUserRole(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateUserRole)) body: UpdateUserRoleDto,
  ) {
    return this.userService.updateRole(id, { role: body.role });
  }
}
