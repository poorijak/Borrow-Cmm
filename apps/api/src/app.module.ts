import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaModule } from 'prisma/prisma.module';
import { JwtModule } from '@nestjs/jwt';
import { UserModule } from './user/user.module';
import { AdminModule } from './admin/admin.module';
import { UploadModule } from './upload/upload.module';
import { CategoryModule } from './category/category.module';
import { EquipmentModule } from './equipment/equipment.module';
import { CourseModule } from './course/course.module';
import { LaboratoryModule } from './laboratory/laboratory.module';
import { MyBagModule } from './my-bag/my-bag.module';
import { CheckoutModule } from './checkout/checkout.module';
import { ScheduleModule } from '@nestjs/schedule';
import { ApprovalModule } from './approval/approval.module';
import { RequestModule } from './request/request.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    ScheduleModule.forRoot(),
    AuthModule,
    PrismaModule,
    JwtModule.registerAsync({
      global: true,
      imports: [ConfigModule], // import configModule
      inject: [ConfigService], // ทำการ inject ConfigService เข้ามาใช้ใน factory ของ jwt
      useFactory: (ConfigService: ConfigService) => ({
        secret: ConfigService.get('JWT_SECRET'), // get secret
      }),
    }),
    UserModule,
    AdminModule,
    UploadModule,
    CategoryModule,
    EquipmentModule,
    CourseModule,
    LaboratoryModule,
    MyBagModule,
    CheckoutModule,
    ApprovalModule,
    RequestModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
