import { Module } from '@nestjs/common';
import { MyBagService } from './my-bag.service';
import { MyBagController } from './my-bag.controller';
import { UserModule } from 'src/user/user.module';
import { LaboratoryModule } from 'src/laboratory/laboratory.module';

@Module({
  imports: [UserModule, LaboratoryModule],
  controllers: [MyBagController],
  providers: [MyBagService],
})
export class MyBagModule {}
