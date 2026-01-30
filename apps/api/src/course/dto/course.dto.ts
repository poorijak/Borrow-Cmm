import { Transform, Type } from 'class-transformer';
import { IsArray, IsIn, IsInt, IsOptional, IsString } from 'class-validator';
import type { ActiveStatus } from '@repo/types';

export class GetCourseQueryDTO {
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
  courseId?: string[];

  @IsOptional()
  @IsString()
  search?: string;
}
