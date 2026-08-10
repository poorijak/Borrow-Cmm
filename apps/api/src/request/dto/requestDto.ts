import { EquipmentStatus } from '@prisma/client';
import { LabStatus, type QuerySortType } from '@repo/types';
import { Transform, Type } from 'class-transformer';
import { IsArray, IsIn, IsInt, IsOptional, IsString } from 'class-validator';

const AllRequestStatuses = [
  ...Object.values(EquipmentStatus),
  ...Object.values(LabStatus),
];

export class GetRequestsQueryDto {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @IsIn(['equipment', 'lab'])
  type?: 'equipment' | 'lab';

  @IsOptional()
  @IsIn(AllRequestStatuses)
  status?: EquipmentStatus | LabStatus;

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
  subjectId?: string[];

  @IsOptional()
  @Transform(({ value }) => {
    if (typeof value === 'string') {
      return value.includes(',') ? value.split(',') : [value];
    }
    return Array.isArray(value) ? value : [value];
  })
  @IsArray()
  teacherId?: string[];

  @IsOptional()
  @IsIn(['asc', 'desc'])
  // เรียงลำดับตามวันที่สร้างคำขอ
  orderByDate?: QuerySortType;
}
