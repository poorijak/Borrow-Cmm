import { ActiveStatus, PrismaClient } from '@prisma/client';
import { equipments } from './data/equipment.data';

export const seedEquipment = async (prisma: PrismaClient) => {
  const seeds = equipments.map(async (equipment) => {
    const subCategory = await prisma.equipmentSubCategory.findUnique({
      where: { code: equipment.subCategoryCode },
    });

    if (!subCategory) {
      console.error(
        `SubCategory with code ${equipment.subCategoryCode} not found for ${equipment.title}`,
      );
      return;
    }

    return prisma.equipment.upsert({
      where: {
        title: equipment.title,
      },
      update: {
        mainImage: equipment.mainImage,
        description: equipment.description,
        totalStock: equipment.totalStock,
        status: equipment.status,
        subCategoryId: subCategory.id,
      },
      create: {
        title: equipment.title,
        mainImage: equipment.mainImage,
        description: equipment.description,
        totalStock: equipment.totalStock,
        borrowedQty: 0,
        reservedQty: 0,
        totalBorrowed: 0,
        status: equipment.status || ActiveStatus.active,
        subCategoryId: subCategory.id,
      },
    });
  });

  await Promise.all(seeds);
};
