import { Module } from '@nestjs/common';
import { UploadController } from './upload.controller';
import { R2Module } from 'src/cloudflare/r2.module';

@Module({
  imports: [R2Module],
  controllers: [UploadController],
})
export class UploadModule {}
