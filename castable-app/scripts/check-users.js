const { PrismaClient } = require('@prisma/client');

const prisma = new PrismaClient();

async function checkUsers() {
  try {
    console.log('Checking existing users...\n');

    const users = await prisma.user.findMany({
      select: {
        id: true,
        email: true,
        createdAt: true
      }
    });

    if (users.length === 0) {
      console.log('❌ No users found in database');
    } else {
      console.log(`✅ Found ${users.length} user(s):`);
      users.forEach(user => {
        console.log(`   - ID: ${user.id}`);
        console.log(`   - Email: ${user.email}`);
        console.log(`   - Created: ${user.createdAt.toLocaleDateString()}`);
        console.log('');
      });
    }

    return users;

  } catch (error) {
    console.error('❌ Error checking users:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

checkUsers();
