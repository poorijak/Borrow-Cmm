import { Module } from '@nestjs/common';
import { MyBagService } from './my-bag.service';
import { MyBagController } from './my-bag.controller';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [UserModule],
  controllers: [MyBagController],
  providers: [MyBagService],
})
export class MyBagModule {}
