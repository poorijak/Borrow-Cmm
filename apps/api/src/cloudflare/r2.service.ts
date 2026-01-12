import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import sharp from 'sharp';

@Injectable()
export class R2Service {
  private s3: S3Client;
  private bucket = process.env.R2_BUCKET;

  constructor() {
    const accountId = process.env.R2_ACCOUNT_ID;
    this.s3 = new S3Client({
      region: 'auto',
      endpoint: `https://${accountId}.r2.cloudflarestorage.com`,
      credentials: {
        accessKeyId: process.env.R2_ACCESS_KEY_ID!,
        secretAccessKey: process.env.R2_SECRET_ACCESS_KEY!,
      },
    });
  }

  async uploadProcessedImage(file: Express.Multer.File) {
    const key = `image/${randomUUID()}.webp`;

    const optimizedBuffer = await sharp(file.buffer)
      .resize(1280, 720, {
        fit: 'inside',
        withoutEnlargement: true,
      })
      .webp({ quality: 80 })
      .toBuffer();

    const cmd = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      ContentType: 'image/webp',
      Body: optimizedBuffer,
      CacheControl: 'public  , max-age=3156000 , immutable',
    });

    await this.s3.send(cmd);

    return {
      key,
      publicUrl: `${process.env.R2_PUBLIC_BASE_URL}/${key}`,
    };
  }
}
