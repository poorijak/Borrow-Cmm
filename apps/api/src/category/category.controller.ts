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
  CategoryRequest,
  categorySchema,
  type CategoryValue,
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

  @Patch(':id')
  update(@Param('id') id: string, @Body() body: unknown) {
    const parsed = categorySchema.safeParse(body);

    if (!parsed.success) {
      throw new BadRequestException(parsed.error.flatten());
    }

    const data: CategoryRequest = parsed.data;

    return this.categoryService.updateMain(id, {
      title: data.title,
      mainImage: data.imageKey,
    });
  }

  @Delete(':id')
  delete(@Param('id') id: string) {
    return this.categoryService.deleteCategory(id);
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

  @Patch(':id/status')
  updateStatus(
    @Param('id') id: string,
    @Body(new ZodValidationPipe(updateStatusCategorySchema))
    data: UpdateStatusSchema,
  ) {
    return this.categoryService.updateMainCateStatus(id, data);
  }
}
