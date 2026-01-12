import {
  Controller,
  Post,
  Body,
  BadRequestException,
  Get,
  Query,
} from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryRequest, categorySchema } from '@repo/schemas';
import { ActiveStatus } from '@prisma/client';

@Controller('categories')
export class CategoryController {
  constructor(private readonly categoryService: CategoryService) {}

  @Post()
  create(@Body() body: unknown) {
    const parsed = categorySchema.safeParse(body);

    if (!parsed.success) {
      throw new BadRequestException(parsed.error.flatten());
    }
    const data: CategoryRequest = parsed.data;

    return this.categoryService.createMain({
      title: data.title,
      mainImage: data.imageKey,
      status: 'active',
    });
  }

  @Get()
  findAll(@Query('status') status: ActiveStatus) {
    const cate = this.categoryService.getCategories({
      where: {
        status,
      },
    });

    return cate;
  }
}
