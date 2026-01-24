import { Global, Module } from '@nestjs/common';
import { PrismaService } from './prisma.service';
import { ConfigService } from '@nestjs/config';

@Global() // ทำให้ใช้ได้ทุก module โดยไม่ต้อง import ซ้ำ (optional แต่สะดวก)
@Module({
  providers: [PrismaService],
  exports: [PrismaService],
})
export class PrismaModule {}
