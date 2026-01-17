import {
  Controller,
  Post,
  Body,
  BadRequestException,
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
  updateStatusCategorySchema,
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
  @Get()
  async findAll(
    @Query('status') status: ActiveStatus,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
  ) {
    const limit = 10;
    const skip = (page - 1) * limit;

    const where = status ? { status } : undefined;

    const [data, total] = await Promise.all([
      this.categoryService.getCategories({ skip, limit, where }),
      this.categoryService.countCategories({ where }),
    ]);

    return {
      data: data,
      meta: {
        page,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  @Get(':id')
  async find(@Param('id') id: string) {
    const cate = this.categoryService.getCategoryById(id);
    return cate;
  }

  @Get(':id/subCategories')
  async findSubAll(
    @Param('id') id: string,
    @Query('page', new DefaultValuePipe(1), ParseIntPipe) page: number,
  ) {
    const limit = 5;

    const skip = (page - 1) * limit;

    const [data, totalCount] = await Promise.all([
      this.categoryService.getSubCategories(id, { skip, limit }),
      this.categoryService.countSubCategories({ mainCategoryId: id }),
    ]);

    return {
      data,
      meta: {
        totalCount,
        page,
        totalPages: Math.ceil(totalCount / limit),
      },
    };
  }

  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateStatusCategorySchema))
    data: UpdateStatusSchema,
  ) {
    return this.categoryService.updateMainCateStatus(id, data);
  }
}
