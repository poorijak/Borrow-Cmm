import { Module } from '@nestjs/common';
import { ApprovalService } from './approval.service';
import { ApprovalController } from './approval.controller';
import { UserService } from 'src/user/user.service';

@Module({
  controllers: [ApprovalController],
  providers: [ApprovalService, UserService],
})
export class ApprovalModule {}
