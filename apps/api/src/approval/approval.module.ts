import { Module } from '@nestjs/common';
import { ApprovalService } from './approval.service';
import { ApprovalController } from './approval.controller';
import { UserService } from 'src/user/user.service';
import { CourseService } from 'src/course/course.service';

@Module({
  controllers: [ApprovalController],
  providers: [ApprovalService, UserService, CourseService],
})
export class ApprovalModule {}
