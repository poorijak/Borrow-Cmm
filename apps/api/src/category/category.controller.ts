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

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  @UsePipes(new ZodValidationPipe(categorySchema))
  create(@Body(new ZodValidationPipe(categorySchema)) data: CategoryValue) {
    return this.categoryService.createMain({
      title: data.title,
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

  @Post(':mainCateId/subCategory')
  createSub(
    @Param('mainCateId') mainCateId: string,
    @Body(new ZodValidationPipe(subCategoryFormSchema)) data: subCategoryValue,
  ) {
    return this.categoryService.upsertSubCate(data, mainCateId);
  }

  @Patch(':mainCateId/subCategory/:id')
  updateSubCate(
    @Param('id') id: string,
    @Param('mainCateId') mainCateId: string,
    @Body(new ZodValidationPipe(subCategoryFormSchema)) data: subCategoryValue,
  ) {
    return this.categoryService.upsertSubCate(data, mainCateId, id);
  }

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

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.categoryService.deleteCategory(id);
  }

  @Delete('subCategory/:id')
  async deleteSub(@Param('id') id: string) {
    return this.categoryService.deleteSubCategory(id);
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateStatusSchema))
    data: UpdateStatusSchema,
  ) {
    return this.categoryService.updateMainCateStatus(id, data);
  }
}
