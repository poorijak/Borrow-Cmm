import { PrismaClient } from '@prisma/client';
import { seedRoles } from './role.seed';

export async function runSeeds(prisma: PrismaClient) {
  await seedRoles(prisma);
}
