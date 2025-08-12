import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  // Create test user with simple password (in real app, use bcrypt)
  const user = await prisma.user.upsert({
    where: { email: 'test@example.com' },
    update: {},
    create: {
      email: 'test@example.com',
      password: '$2b$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // "password"
      name: 'Test User',
    },
  });

  console.log('✅ Test user created:', user);

  // Delete existing folders for this user to avoid duplicates
  await prisma.folder.deleteMany({
    where: { userId: user.id },
  });

  // Create test folders
  const folder1 = await prisma.folder.create({
    data: {
      name: 'Work',
      color: '#3b82f6',
      userId: user.id,
    },
  });

  const folder2 = await prisma.folder.create({
    data: {
      name: 'Personal',
      color: '#10b981',
      userId: user.id,
    },
  });

  console.log('✅ Test folders created:', { folder1, folder2 });
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
