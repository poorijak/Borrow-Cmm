import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { ZodTypeAny } from 'zod';

@Injectable()
export class ZodValidationPipe<T extends ZodTypeAny> implements PipeTransform {
  constructor(private schema: T) {}

  transform(value: any): unknown {
    if (value === undefined || value === null) {
      throw new BadRequestException('No data provided');
    }

    const result = this.schema.safeParse(value);

    if (!result.success) {
      const fieldErrors: Record<string, string[] | undefined> =
        result.error.flatten().fieldErrors;

      throw new BadRequestException({
        statusCode: 400,
        message: 'Validation failed',
        errors: fieldErrors,
      });
    }

    return result.data;
  }
}
