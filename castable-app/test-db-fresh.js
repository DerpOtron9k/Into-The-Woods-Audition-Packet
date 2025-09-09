// Fresh database connection test
const { PrismaClient } = require('@prisma/client')

async function testFreshConnection() {
  // Create a completely fresh Prisma client
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  })
  
  try {
    console.log('🔄 Testing fresh database connection...')
    
    // Test basic connection
    await prisma.$connect()
    console.log('✅ Database connected successfully!')
    
    // Test simple query
    const result = await prisma.$queryRaw`SELECT 1 as test`
    console.log('✅ Query test successful:', result)
    
    // Test show creation without publicUrl for now
    console.log('\n🧪 Testing show creation...')
    const testShow = await prisma.show.create({
      data: {
        title: 'Test Show - Fresh Connection',
        description: 'Testing fresh database connection',
        director: 'Test Director',
        contactEmail: 'test@example.com',
        status: 'active',
        userId: 'test-user-123'
      }
    })
    
    console.log('✅ Show created successfully!')
    console.log(`   - Show ID: ${testShow.id}`)
    console.log(`   - Title: ${testShow.title}`)
    
    // Clean up
    await prisma.show.delete({
      where: { id: testShow.id }
    })
    console.log('✅ Test data cleaned up')
    
    console.log('\n🎉 Fresh connection test passed! Database is working.')
    
  } catch (error) {
    console.error('❌ Fresh connection test failed:', error)
  } finally {
    await prisma.$disconnect()
  }
}

testFreshConnection()
