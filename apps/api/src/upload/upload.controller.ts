import {
  Controller,
  Post,
  Body,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { R2Service } from 'src/common/cloudflare/r2.service';

@Controller('upload')
export class UploadController {
  constructor(private readonly r2: R2Service) {}

  @Post('image')
  @UseInterceptors(FileInterceptor('file'))
  uploadImage(@UploadedFile() file: Express.Multer.File) {
    return this.r2.uploadProcessedImage(file);
  }
}
