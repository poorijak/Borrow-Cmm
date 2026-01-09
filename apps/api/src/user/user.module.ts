import { Module } from '@nestjs/common';
import { UserService } from './user.service';
import { UserController } from './user.controller';
import { PrismaModule } from 'prisma/prisma.module';
import { AccountService } from './account.service';

@Module({
  imports: [PrismaModule],
  controllers: [UserController],
  providers: [UserService, AccountService],
  exports: [UserService, AccountService],
})
export class UserModule {}
