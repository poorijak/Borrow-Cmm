import { PrismaClient } from '@prisma/client';
import { seedEquipmentCategory } from './equipment-category.seed';
import { seedEquipmentSubCategory } from './equipment-sub-category.seed';
import { seedEquipment } from './equipment';
import { seedCourse } from './course.seed';
import { seedLaboratory } from './laboratory.seed';

export async function runSeeds(prisma: PrismaClient) {
  console.log('🌱 Start seeding...');

  await seedEquipmentCategory(prisma);
  await seedEquipmentSubCategory(prisma);
  await seedEquipment(prisma);
  await seedCourse(prisma);
  await seedLaboratory(prisma);

  console.log('✅ Seeding completed');
}
