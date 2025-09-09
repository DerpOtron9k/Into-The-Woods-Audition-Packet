const { PrismaClient } = require('@prisma/client')
const fs = require('fs')
const path = require('path')

async function setupComplete() {
  console.log('🚀 Starting complete database setup...\n')
  
  // Check environment variables
  console.log('📋 Checking environment configuration...')
  const envPath = path.join(process.cwd(), '.env')
  
  if (!fs.existsSync(envPath)) {
    console.error('❌ .env file not found!')
    console.log('Please create a .env file with your database configuration.')
    process.exit(1)
  }
  
  const envContent = fs.readFileSync(envPath, 'utf8')
  const hasDatabaseUrl = envContent.includes('DATABASE_URL=')
  
  if (!hasDatabaseUrl) {
    console.error('❌ DATABASE_URL not found in .env file!')
    console.log('Please add DATABASE_URL to your .env file.')
    process.exit(1)
  }
  
  console.log('✅ Environment configuration found\n')
  
  // Test database connection
  console.log('🔌 Testing database connection...')
  const prisma = new PrismaClient()
  
  try {
    await prisma.$connect()
    console.log('✅ Database connected successfully!')
    
    // Test basic query
    const result = await prisma.$queryRaw`SELECT 1 as test`
    console.log('✅ Database query test passed!')
    
    // Create tables if they don't exist
    console.log('\n📊 Setting up database schema...')
    
    // Create User table
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "User" (
        "id" TEXT NOT NULL,
        "email" TEXT NOT NULL,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        CONSTRAINT "User_pkey" PRIMARY KEY ("id")
      )
    `
    console.log('✅ User table created/verified')
    
    // Create Show table
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "Show" (
        "id" TEXT NOT NULL,
        "title" TEXT NOT NULL,
        "description" TEXT,
        "auditionDate" TIMESTAMP(3),
        "showDate" TIMESTAMP(3),
        "userId" TEXT NOT NULL,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        CONSTRAINT "Show_pkey" PRIMARY KEY ("id")
      )
    `
    console.log('✅ Show table created/verified')
    
    // Create Character table
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "Character" (
        "id" TEXT NOT NULL,
        "name" TEXT NOT NULL,
        "description" TEXT,
        "showId" TEXT NOT NULL,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        CONSTRAINT "Character_pkey" PRIMARY KEY ("id")
      )
    `
    console.log('✅ Character table created/verified')
    
    // Create Applicant table
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "Applicant" (
        "id" TEXT NOT NULL,
        "name" TEXT NOT NULL,
        "email" TEXT NOT NULL,
        "phone" TEXT,
        "headshotUrl" TEXT,
        "resumeUrl" TEXT,
        "auditionFileUrl" TEXT,
        "showId" TEXT NOT NULL,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        CONSTRAINT "Applicant_pkey" PRIMARY KEY ("id")
      )
    `
    console.log('✅ Applicant table created/verified')
    
    // Create indexes
    console.log('\n🔍 Creating indexes...')
    await prisma.$executeRaw`CREATE UNIQUE INDEX IF NOT EXISTS "User_id_key" ON "User"("id")`
    await prisma.$executeRaw`CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email")`
    console.log('✅ Indexes created/verified')
    
    // Create foreign keys
    console.log('\n🔗 Creating foreign key constraints...')
    await prisma.$executeRaw`ALTER TABLE "Show" ADD CONSTRAINT IF NOT EXISTS "Show_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE`
    await prisma.$executeRaw`ALTER TABLE "Character" ADD CONSTRAINT IF NOT EXISTS "Character_showId_fkey" FOREIGN KEY ("showId") REFERENCES "Show"("id") ON DELETE RESTRICT ON UPDATE CASCADE`
    await prisma.$executeRaw`ALTER TABLE "Applicant" ADD CONSTRAINT IF NOT EXISTS "Applicant_showId_fkey" FOREIGN KEY ("showId") REFERENCES "Show"("id") ON DELETE RESTRICT ON UPDATE CASCADE`
    console.log('✅ Foreign key constraints created/verified')
    
    console.log('\n🎉 Database setup completed successfully!')
    console.log('\nNext steps:')
    console.log('1. Start the development server: npm run dev')
    console.log('2. Visit http://localhost:3000/test-db to test the connection')
    console.log('3. Visit http://localhost:3000 to see the application')
    
  } catch (error) {
    console.error('\n❌ Database setup failed:')
    console.error(error.message)
    
    console.log('\n🔧 Troubleshooting:')
    console.log('1. Check that your database server is running')
    console.log('2. Verify DATABASE_URL in .env is correct')
    console.log('3. For Supabase: ensure your project is active')
    console.log('4. For local PostgreSQL: ensure it\'s installed and running')
    
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

setupComplete()
