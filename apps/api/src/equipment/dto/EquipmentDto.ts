import { Transform, Type } from 'class-transformer';
import { IsArray, IsIn, IsInt, IsOptional, IsString } from 'class-validator';
import type { QuatitySortType, ActiveStatus } from '@repo/types';

export class GetEquipmentsQueryDto {
  @IsOptional()
  @IsIn(['active', 'inactive'])
  status?: ActiveStatus;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  limit: number = 10;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  page: number = 1;

  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value.includes(',') ? value.split(',') : [value];
    }
    return Array.isArray(value) ? value : [value];
  })
  @IsArray()
  subCategoryId?: string[];

  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value.includes(',') ? value.split(',') : [value];
    }
    return Array.isArray(value) ? value : [value];
  })
  @IsArray()
  categoryId?: string[];

  @IsOptional()
  @IsIn(['asc', 'desc'])
  totalStock?: QuatitySortType;

  @IsOptional()
  @IsString()
  search?: string;
}
