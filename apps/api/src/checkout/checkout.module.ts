import { Module } from '@nestjs/common';
import { CheckoutService } from './checkout.service';
import { CheckoutController } from './checkout.controller';
import { MailService } from 'src/mail/mail.service';

@Module({
  controllers: [CheckoutController],
  providers: [CheckoutService, MailService],
})
export class CheckoutModule {}
