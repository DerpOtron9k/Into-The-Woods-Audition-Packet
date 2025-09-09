const { PrismaClient } = require('@prisma/client')

async function setupDatabase() {
  const prisma = new PrismaClient()
  
  try {
    console.log('🔄 Setting up database...')
    
    // Test connection
    await prisma.$connect()
    console.log('✅ Database connected successfully!')
    
    // Push schema to database
    console.log('🔄 Pushing schema to database...')
    await prisma.$executeRaw`CREATE SCHEMA IF NOT EXISTS "public"`
    
    // Create tables
    console.log('🔄 Creating tables...')
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "public"."User" (
        "id" TEXT NOT NULL,
        "email" TEXT NOT NULL,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        CONSTRAINT "User_pkey" PRIMARY KEY ("id")
      )
    `
    
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "public"."Show" (
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
    
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "public"."Character" (
        "id" TEXT NOT NULL,
        "name" TEXT NOT NULL,
        "description" TEXT,
        "showId" TEXT NOT NULL,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        CONSTRAINT "Character_pkey" PRIMARY KEY ("id")
      )
    `
    
    await prisma.$executeRaw`
      CREATE TABLE IF NOT EXISTS "public"."Applicant" (
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
    
    // Create indexes
    console.log('🔄 Creating indexes...')
    await prisma.$executeRaw`CREATE UNIQUE INDEX IF NOT EXISTS "User_id_key" ON "public"."User"("id")`
    await prisma.$executeRaw`CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "public"."User"("email")`
    
    // Create foreign keys
    console.log('🔄 Creating foreign keys...')
    await prisma.$executeRaw`ALTER TABLE "public"."Show" ADD CONSTRAINT IF NOT EXISTS "Show_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE`
    await prisma.$executeRaw`ALTER TABLE "public"."Character" ADD CONSTRAINT IF NOT EXISTS "Character_showId_fkey" FOREIGN KEY ("showId") REFERENCES "public"."Show"("id") ON DELETE RESTRICT ON UPDATE CASCADE`
    await prisma.$executeRaw`ALTER TABLE "public"."Applicant" ADD CONSTRAINT IF NOT EXISTS "Applicant_showId_fkey" FOREIGN KEY ("showId") REFERENCES "public"."Show"("id") ON DELETE RESTRICT ON UPDATE CASCADE`
    
    console.log('✅ Database setup completed successfully!')
    
  } catch (error) {
    console.error('❌ Database setup failed:')
    console.error(error.message)
    process.exit(1)
  } finally {
    await prisma.$disconnect()
  }
}

setupDatabase()
