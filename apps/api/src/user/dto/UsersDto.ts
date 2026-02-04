import { PickType } from '@nestjs/mapped-types';
import { Prisma, UserRole } from '@prisma/client';
import { type Role } from '@repo/types';
import { Transform, Type } from 'class-transformer';
import {
  IsArray,
  IsEnum,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
} from 'class-validator';

type SortOrder = 'asc' | 'desc';

class baseQuery {
  @IsOptional()
  @IsString()
  search?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  limit: number = 10;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  page?: number = 1;

  @IsOptional()
  @IsIn(['asc', 'desc'])
  createdAt: SortOrder;
}

export class GetStudentQueryDto extends baseQuery {
  @IsOptional()
  @IsIn(['asc', 'desc'])
  overDue?: SortOrder;

  @IsOptional()
  @IsIn(['asc', 'desc'])
  borrowed?: SortOrder;
}

export class UpdateUserRoleDto {
  @IsEnum(UserRole)
  role: UserRole;
}

export class GetStaffQueryDto extends PickType(baseQuery, [
  'search',
  'createdAt',
  'page',
  'limit',
] as const) {
  @IsOptional()
  @Transform(({ value }: { value: string | string[] | undefined }) => {
    let roles = Array.isArray(value)
      ? value
      : typeof value === 'string'
        ? value.split(',')
        : [];

    return roles.map((role) => role.trim());
  })
  @IsArray()
  role?: Role[];

  @IsOptional()
  @IsIn(['asc', 'desc'])
  updatedAt?: Prisma.SortOrder;
}
