import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { ZodSchema } from 'zod';

@Injectable()
export class ZodValidationPipe<T> implements PipeTransform {
  constructor(private schema: ZodSchema<T>) {}

  transform(value: unknown): T {
    const result = this.schema.safeParse(value);

    if (!result.success) {
      const error = result.error.flatten().fieldErrors;
      throw new BadRequestException({
        message: 'Validate failed',
        error,
      });
    }
    return result.data;
  }
}
