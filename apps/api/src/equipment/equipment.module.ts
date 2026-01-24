import { Module } from '@nestjs/common';
import { EquipmentService } from './equipment.service';
import { EquipmentController } from './equipment.controller';
import { R2Module } from 'src/cloudflare/r2.module';

@Module({
  imports: [R2Module],
  controllers: [EquipmentController],
  providers: [EquipmentService],
})
export class EquipmentModule {}
