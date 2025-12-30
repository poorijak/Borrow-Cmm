import { PrismaClient } from '@prisma/client';

export async function seedRoles(prisma: PrismaClient) {
  const roles = [
    { title: 'Administrater', slug: 'admin' },
    { title: 'Moderater', slug: 'moderator' },
    { title: 'Student', slug: 'student' },
    { title: 'Instructor', slug: 'instructor' },
  ];

  for (const role of roles) {
    await prisma.role.upsert({
      where: { slug: role.slug },
      update: { title: role.title },
      create: role,
    });
  }

  console.log('✅ Roles seeded');
}
