import {
  Controller,
  Post,
  Body,
  Get,
  Query,
  DefaultValuePipe,
  ParseIntPipe,
  Patch,
  Param,
  Delete,
  UsePipes,
  UseGuards,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import {
  categorySchema,
  type CategoryValue,
  subCategoryFormSchema,
  type subCategoryValue,
  updateStatusSchema,
  type UpdateStatusSchema,
} from '@repo/schemas';
import { ActiveStatus } from '@prisma/client';
import { ZodValidationPipe } from 'src/common/pipe/zod-validator';
import { AuthGuard } from '@nestjs/passport';
import { RoleGuard } from 'src/common/guards/role.guard';
import { Roles } from 'src/common/decorators/role.decorator';
import { Role } from 'src/admin/role.enum';

@UseGuards(AuthGuard('jwt'), RoleGuard)
@Roles(Role.ADMIN, Role.MODERATOR)
@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(categorySchema))
  create(@Body(new ZodValidationPipe(categorySchema)) data: CategoryValue) {
    const code = this.categoryService.generateCategoryCode();

    return this.categoryService.createMain({
      title: data.title,
      code,
      mainImage: data.imageKey,
      status: 'active',
    });
  }

  @Get('subCategories')
  async findSubCategoryAll() {
    return await this.categoryService.getSubCategoriesAll();
  }

  @Get()
  async findCategoryAll(
    @Query('status') status: ActiveStatus,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(10), ParseIntPipe) limit: number,
  ) {
    return this.categoryService.getPaginatedCategories(status, { page, limit });
  }

  @Get(':id')
  async find(@Param('id') id: string) {
    const cate = this.categoryService.getCategoryById(id);
    return cate;
  }

  @Get(':id/subCategories')
  async findSubCategoriesByMainId(
    @Param('id') id: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
    @Query('limit', new DefaultValuePipe(5), ParseIntPipe) limit: number,
  ) {
    return this.categoryService.getPaginatedSubCategories(id, { page, limit });
  }

  @Roles(Role.ADMIN)
  @Post(':mainCateId/subCategory')
  createSub(
    @Param('mainCateId') mainCateId: string,
    @Body(new ZodValidationPipe(subCategoryFormSchema)) data: subCategoryValue,
  ) {
    return this.categoryService.upsertSubCate(data, mainCateId);
  }

  @Roles(Role.ADMIN)
  @Patch(':mainCateId/subCategory/:id')
  updateSubCate(
    @Param('id') id: string,
    @Param('mainCateId') mainCateId: string,
    @Body(new ZodValidationPipe(subCategoryFormSchema)) data: subCategoryValue,
  ) {
    return this.categoryService.upsertSubCate(data, mainCateId, id);
  }

  @Roles(Role.ADMIN)
  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(categorySchema)) data: CategoryValue,
  ) {
    return this.categoryService.updateMain(id, {
      title: data.title,
      mainImage: data.imageKey,
    });
  }

  @Roles(Role.ADMIN)
  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.categoryService.deleteCategory(id);
  }

  @Roles(Role.ADMIN)
  @Delete('subCategory/:id')
  async deleteSub(@Param('id') id: string) {
    return this.categoryService.deleteSubCategory(id);
  }

  @Roles(Role.ADMIN)
  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateStatusSchema))
    data: UpdateStatusSchema,
  ) {
    return this.categoryService.updateMainCateStatus(id, data);
  }
}
