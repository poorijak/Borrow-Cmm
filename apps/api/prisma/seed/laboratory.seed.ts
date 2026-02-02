import { PrismaClient } from '@prisma/client';
import { laboratory } from './data/laboratory.data';

export const seedLaboratory = async (prisma: PrismaClient) => {
  const seeds = laboratory.map(async (lab) =>
    prisma.laboratory.upsert({
      where: { labCode: lab.labCode },
      update: {
        name: lab.name,
        labCode: lab.labCode,
        image: lab.image,
        status: lab.status,
      },
      create: {
        name: lab.name,
        labCode: lab.labCode,
        image: lab.image,
        status: lab.status,
        totalBorrowed: 0,
      },
    }),
  );

  await Promise.all(seeds);
};
