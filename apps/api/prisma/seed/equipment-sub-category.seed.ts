import { PrismaClient } from '@prisma/client';
import { subCategories } from './data/category.data';

export const seedEquipmentSubCategory = async (prisma: PrismaClient) => {
  const seeds = subCategories.map((subCate) =>
    prisma.equipmentSubCategory.upsert({
      where: { code: subCate.code },
      update: {
        title: subCate.title,
        status: subCate.status,
      },
      create: {
        code: subCate.code,
        title: subCate.title,
        status: subCate.status,
        mainCategory: {
          connect: {
            code: subCate.parentCode,
          },
        },
      },
    }),
  );

  await Promise.all(seeds);
};
