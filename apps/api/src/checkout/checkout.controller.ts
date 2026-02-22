import { Controller, Post, Body, Get, Param, UseGuards } from '@nestjs/common';
import { CheckoutService } from './checkout.service';
import { ZodValidationPipe } from 'src/common/pipe/zod-validator';
import { borrowSchema, type BorrowValues } from '@repo/schemas';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';
import { GetUser } from 'src/common/guards/getUser';
import type { AuthUser } from '@repo/types';

@Controller('checkout')
export class CheckoutController {
  constructor(private readonly checkoutService: CheckoutService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  create(
    @Body(new ZodValidationPipe(borrowSchema)) data: BorrowValues,
    @GetUser() currentUser: AuthUser,
  ) {
    return this.checkoutService.checkout(data, currentUser);
  }

  @Get(':userId')
  findRequestByUserId(@Param('userId') userId: string) {
    return this.checkoutService.findRequest(userId);
  }
}
