import { TimeSlot } from '@prisma/client';
import { type ActiveStatus } from '@repo/types';
import { Type } from 'class-transformer';
import { IsDate, IsIn, IsInt, IsOptional, IsString } from 'class-validator';

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

export class GetLabAvailableQueryDto {
  @IsIn(['morning', 'afternoon'])
  slot: TimeSlot;

  @Type(() => Date)
  @IsDate()
  bookingDate: Date;
}
