import { Module } from '@nestjs/common';
import { CategoryService } from './category.service';
import { CategoryController } from './category.controller';
import { R2Service } from 'src/cloudflare/r2.service';

@Module({
  controllers: [CategoryController],
  providers: [CategoryService, R2Service],
})
export class CategoryModule {}
