import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { getSignedUrl } from '@aws-sdk/s3-request-presigner';
import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';

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

  async createPresignedPut(input: { contentType: string; ext?: string }) {
    const ext = (input.ext || 'jpg').toLowerCase();
    const key = `image/${randomUUID()}.${ext}`;

    const cmd = new PutObjectCommand({
      Bucket: this.bucket,
      Key: key,
      ContentType: input.contentType,
      CacheControl: 'public  , max-age=3156000 , immutable',
    });

    const uploadUrl = await getSignedUrl(this.s3, cmd, { expiresIn: 60 });

    const baseUrl = process.env.R2_PUBLIC_BASE_URL;
    return {
      key,
      uploadUrl,
      publicUrl: baseUrl ? `${baseUrl}/${key}` : undefined,
      expiresIn: 60,
    };
  }
}
