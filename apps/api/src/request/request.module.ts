import { Module } from '@nestjs/common';
import { RequestService } from './request.service';
import { RequestController } from './request.controller';
import { CourseService } from 'src/course/course.service';
import { UserService } from 'src/user/user.service';

@Module({
  controllers: [RequestController],
  providers: [RequestService, CourseService, UserService],
})
export class RequestModule {}
