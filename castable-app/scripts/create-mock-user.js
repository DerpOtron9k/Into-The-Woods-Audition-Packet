const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function createMockUser() {
  try {
    console.log('Creating mock user...\n');

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { id: 'user_mock_director_123' }
    });

    if (existingUser) {
      console.log('✅ Mock user already exists:', existingUser.email);
      return existingUser;
    }

    // Create mock user
    const user = await prisma.user.create({
      data: {
        id: 'user_mock_director_123',
        email: 'director@springfieldtheater.org',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    });

    console.log('✅ Created mock user:', user.email);
    return user;

  } catch (error) {
    console.error('❌ Error creating mock user:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

createMockUser();
