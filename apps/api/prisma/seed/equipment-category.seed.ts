import { PrismaClient } from '@prisma/client';
import { mainCategory } from './data/category.data';

export async function seedEquipmentCategory(prisma: PrismaClient) {
  const findSubCategoriesByMainId = mainCategory.map((category) =>
    prisma.equipmentCategory.upsert({
      where: { code: category.code },
      update: {
        title: category.title,
        mainImage: category.mainImage,
        status: category.status,
      },
      create: {
        code: category.code,
        title: category.title,
        mainImage: category.mainImage,
        status: category.status,
      },
    }),
  );
  await Promise.all(findSubCategoriesByMainId);
}
