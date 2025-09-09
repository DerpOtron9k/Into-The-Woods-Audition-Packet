const { PrismaClient } = require('@prisma/client')

async function testSupabaseConnection() {
  console.log('🔍 Testing Supabase PostgreSQL connection...\n')
  
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
  })
  
  try {
    console.log('📡 Attempting to connect to Supabase...')
    console.log('URL:', process.env.DATABASE_URL?.replace(/\/\/.*@/, '//***:***@'))
    
    await prisma.$connect()
    console.log('✅ Connected to Supabase PostgreSQL!')
    
    // Test basic query
    const result = await prisma.$queryRaw`SELECT 1 as test`
    console.log('✅ Query test successful:', result)
    
    // Test if we can create tables
    console.log('📊 Testing table creation...')
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "User" (
        "id" TEXT NOT NULL,
        "email" TEXT NOT NULL,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        CONSTRAINT "User_pkey" PRIMARY KEY ("id")
      )
    `
    console.log('✅ Table creation successful!')
    
    console.log('\n🎉 Supabase PostgreSQL is working!')
    console.log('✅ PRD compliant: Using PostgreSQL as required')
    console.log('✅ Cloud database: Supabase PostgreSQL')
    
  } catch (error) {
    console.error('❌ Supabase connection failed:')
    console.error('Error:', error.message)
    
    if (error.code === 'P1001') {
      console.log('\n🔧 Troubleshooting P1001 (Can\'t reach database server):')
      console.log('1. Check if Supabase project is active')
      console.log('2. Verify database credentials')
      console.log('3. Check network connectivity')
      console.log('4. Ensure project hasn\'t been paused')
    }
    
    console.log('\n📋 Alternative solutions:')
    console.log('1. Install local PostgreSQL')
    console.log('2. Use different cloud PostgreSQL provider')
    console.log('3. Create new Supabase project')
    
  } finally {
    await prisma.$disconnect()
  }
}

testSupabaseConnection()
