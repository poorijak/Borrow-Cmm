import * as dotenv from 'dotenv';
import * as path from 'path';

// ค้นหาไฟล์ .env ที่อยู่ใน apps/api/.env
dotenv.config({ path: path.join(__dirname, '../.env') });

import { PrismaClient } from '@prisma/client';
import { runSeeds } from './seed/index';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

const connectionString = process.env.DATABASE_URL;

if (!connectionString) {
  console.error('❌ Error: DATABASE_URL is still not defined!');
  process.exit(1);
}

console.log('✅ Connecting to:', connectionString); // เพื่อเช็คว่าอ่านค่าถูกไหม

const pool = new Pool({ connectionString });
const adapter = new PrismaPg(pool);
const prisma = new PrismaClient({ adapter });

async function main() {
  await runSeeds(prisma);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
