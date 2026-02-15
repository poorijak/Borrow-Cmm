import { Controller, Post, Body } from '@nestjs/common';
import { CheckoutService } from './checkout.service';
import { ZodValidationPipe } from 'src/common/pipe/zod-validator';
import { borrowSchema, type BorrowValues } from '@repo/schemas';

@Controller('checkout')
export class CheckoutController {
  constructor(private readonly checkoutService: CheckoutService) {}

  @Post()
  create(@Body(new ZodValidationPipe(borrowSchema)) data: BorrowValues) {
    console.log('DATA TYPE:', typeof data.equipment?.borrowRange.from);
    console.log(data.equipment?.borrowRange.from);
    return this.checkoutService.checkout(data);
  }
}
