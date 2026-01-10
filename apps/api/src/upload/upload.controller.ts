import { Controller, Post, Body } from '@nestjs/common';
import { R2Service } from 'src/cloudflare/r2.service';

@Controller('upload')
export class UploadController {
  constructor(private readonly r2: R2Service) {}

  @Post('presign')
  create(@Body() body: { contentType: string; filename?: string }) {
    const ext = body.filename?.split('.').pop();
    return this.r2.createPresignedPut({ contentType: body.contentType, ext });
  }
}
