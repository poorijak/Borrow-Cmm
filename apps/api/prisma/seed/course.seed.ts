import { PrismaClient } from '@prisma/client';
import { course } from './data/course.data';

export const seedCourse = async (prisma: PrismaClient) => {
  const seeds = course.map(async (course) =>
    prisma.course.upsert({
      where: { code: course.code },
      update: {
        label: course.label,
        code: course.code,
        status: course.status,
      },
      create: {
        label: course.label,
        code: course.code,
        status: course.status,
      },
    }),
  );

  await Promise.all(seeds);
};
