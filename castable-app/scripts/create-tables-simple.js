const { PrismaClient } = require('@prisma/client')
require('dotenv').config()

async function createTables() {
  const prisma = new PrismaClient()
  
  try {
    console.log('Creating database tables...')
    
    // Create User table
    await prisma.$executeRaw`CREATE TABLE IF NOT EXISTS "User" (
      "id" TEXT NOT NULL,
      "email" TEXT NOT NULL,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL,
      CONSTRAINT "User_pkey" PRIMARY KEY ("id")
    )`
    console.log('✅ User table created')
    
    // Create Show table
    await prisma.$executeRaw`CREATE TABLE IF NOT EXISTS "Show" (
      "id" TEXT NOT NULL,
      "title" TEXT NOT NULL,
      "description" TEXT,
      "director" TEXT NOT NULL,
      "organization" TEXT,
      "auditionDate" TIMESTAMP(3),
      "deadline" TIMESTAMP(3),
      "location" TEXT,
      "contactEmail" TEXT NOT NULL,
      "contactPhone" TEXT,
      "status" TEXT NOT NULL DEFAULT 'draft',
      "userId" TEXT NOT NULL,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL,
      CONSTRAINT "Show_pkey" PRIMARY KEY ("id")
    )`
    console.log('✅ Show table created')
    
    // Create Character table
    await prisma.$executeRaw`CREATE TABLE IF NOT EXISTS "Character" (
      "id" TEXT NOT NULL,
      "name" TEXT NOT NULL,
      "description" TEXT,
      "gender" TEXT NOT NULL DEFAULT 'Any',
      "ageRange" TEXT,
      "vocalRange" TEXT,
      "notes" TEXT,
      "showId" TEXT NOT NULL,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL,
      CONSTRAINT "Character_pkey" PRIMARY KEY ("id")
    )`
    console.log('✅ Character table created')
    
    // Create AuditionMaterial table
    await prisma.$executeRaw`CREATE TABLE IF NOT EXISTS "AuditionMaterial" (
      "id" TEXT NOT NULL,
      "type" TEXT NOT NULL,
      "fileName" TEXT NOT NULL,
      "fileUrl" TEXT NOT NULL,
      "fileSize" INTEGER,
      "mimeType" TEXT,
      "showId" TEXT NOT NULL,
      "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
      "updatedAt" TIMESTAMP(3) NOT NULL,
      CONSTRAINT "AuditionMaterial_pkey" PRIMARY KEY ("id")
    )`
    console.log('✅ AuditionMaterial table created')
    
    // Create Applicant table
    await prisma.$executeRaw`CREATE TABLE IF NOT EXISTS "Applicant" (
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
    )`
    console.log('✅ Applicant table created')
    
    // Create indexes
    await prisma.$executeRaw`CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email")`
    await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS "Show_userId_idx" ON "Show"("userId")`
    await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS "Character_showId_idx" ON "Character"("showId")`
    await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS "AuditionMaterial_showId_idx" ON "AuditionMaterial"("showId")`
    await prisma.$executeRaw`CREATE INDEX IF NOT EXISTS "Applicant_showId_idx" ON "Applicant"("showId")`
    console.log('✅ Indexes created')
    
    console.log('🎉 All tables created successfully!')
    
  } catch (error) {
    console.error('❌ Error creating tables:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createTables()

