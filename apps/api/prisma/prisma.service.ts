import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaPg } from '@prisma/adapter-pg';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    const connectionString = process.env.DATABASE_URL!;

    console.log('[PrismaService] DATABASE_URL =', process.env.DATABASE_URL);
    console.log('[PrismaService] chosen connectionString =', connectionString);

    const pool = new Pool({ connectionString }); // สร้าง connection pool

    const adapter = new PrismaPg(pool); // แปลง pool เป็น Adapter

    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
  }
}
