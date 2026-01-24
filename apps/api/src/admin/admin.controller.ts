import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { AdminService } from './admin.service';
import { CreateAdminDto } from './dto/create-admin.dto';
import { UpdateAdminDto } from './dto/update-admin.dto';
import { AuthGuard } from '@nestjs/passport';
import { RoleGuard } from '../common/guards/role.guard';
import { Roles } from 'src/common/decorators/role.decorator';
import { Role } from './role.enum';

@Controller('admin')
@UseGuards(AuthGuard('jwt'), RoleGuard)
@Roles(Role.ADMIN)
export class AdminController {
  constructor(private readonly adminService: AdminService) {}

  @Get()
  testAdmin() {
    return { message: 'hello' };
  }

  @Post()
  create(@Body() createAdminDto: CreateAdminDto) {
    return this.adminService.create(createAdminDto);
  }

  @Get('/findAll')
  findAll() {
    return this.adminService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.adminService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAdminDto: UpdateAdminDto) {
    return this.adminService.update(+id, updateAdminDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.adminService.remove(+id);
  }
}
