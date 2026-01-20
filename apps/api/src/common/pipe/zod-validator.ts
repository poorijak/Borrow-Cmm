import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { ZodSchema } from 'zod';

@Injectable()
export class ZodValidationPipe<T> implements PipeTransform {
  constructor(private schema: ZodSchema<T>) {}

  transform(value: unknown): T {
    if (!value) {
      throw new BadRequestException('No data provider');
    }

    const result = this.schema.safeParse(value);

    if (!result.success) {
      const fieldErrors = result.error.flatten().fieldErrors;
      throw new BadRequestException({
        statusCode: 400,
        message: 'Validate failed',
        errors: fieldErrors,
      });
    }
    return result.data;
  }
}
