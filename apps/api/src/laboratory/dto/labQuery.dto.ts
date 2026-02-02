import { type ActiveStatus } from '@repo/types';
import { Type } from 'class-transformer';
import { IsIn, IsInt, IsOptional, IsString } from 'class-validator';

export class GetLaboratoryQueryDto {
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
  @IsString()
  search?: string;
}
