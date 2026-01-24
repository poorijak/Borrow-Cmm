import { PrismaClient } from '@prisma/client';
import { runSeeds } from './seed/index';
import { PrismaPg } from '@prisma/adapter-pg';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!, // ต้องมีค่า
});

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
