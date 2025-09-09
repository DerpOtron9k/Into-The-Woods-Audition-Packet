// Fix database connection by using a completely fresh approach
const { PrismaClient } = require('@prisma/client')

async function fixDatabaseConnection() {
  console.log('🔧 Attempting to fix database connection...')
  
  // Create a completely new Prisma client with fresh connection
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
    log: ['query', 'info', 'warn', 'error'],
  })
  
  try {
    // Force disconnect any existing connections
    await prisma.$disconnect()
    
    // Wait a moment
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Try to connect fresh
    await prisma.$connect()
    console.log('✅ Fresh connection established')
    
    // Test with a simple query
    const result = await prisma.$queryRaw`SELECT 1 as test`
    console.log('✅ Simple query successful:', result)
    
    // Try to create a test record
    const testRecord = await prisma.show.create({
      data: {
        title: 'Test Connection',
        description: 'Testing database connection',
        director: 'Test Director',
        contactEmail: 'test@example.com',
        status: 'active',
        userId: 'test-user-123'
      }
    })
    
    console.log('✅ Test record created:', testRecord.id)
    
    // Clean up test record
    await prisma.show.delete({
      where: { id: testRecord.id }
    })
    
    console.log('✅ Test record cleaned up')
    console.log('🎉 Database connection is working!')
    
  } catch (error) {
    console.error('❌ Database connection failed:', error)
    
    // Try alternative approach - use raw SQL
    try {
      console.log('🔄 Trying alternative approach with raw SQL...')
      
      const rawResult = await prisma.$executeRaw`SELECT 1 as test`
      console.log('✅ Raw SQL successful:', rawResult)
      
    } catch (rawError) {
      console.error('❌ Raw SQL also failed:', rawError)
    }
  } finally {
    await prisma.$disconnect()
  }
}

fixDatabaseConnection()
