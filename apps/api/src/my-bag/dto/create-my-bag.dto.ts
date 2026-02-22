import { TimeSlot } from '@prisma/client';
import { Type } from 'class-transformer';
import { IsDate, IsIn, IsOptional, IsString } from 'class-validator';

export class AddToBagDto {
  @IsString()
  userId: string;

  @IsOptional()
  @IsString()
  equipmentId?: string;

  @IsOptional()
  @IsString()
  labId?: string;

  @IsOptional()
  @Type(() => Date)
  @IsDate()
  date?: Date;

  @IsOptional()
  @IsIn(['morning', 'afternoon'])
  slot?: TimeSlot;
}
