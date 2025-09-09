const { PrismaClient } = require('@prisma/client')
const fs = require('fs')
const path = require('path')
require('dotenv').config()

const prisma = new PrismaClient()

async function setupDatabase() {
  try {
    console.log('Setting up database tables...')
    
    // Create tables one by one
    const tables = [
      `CREATE TABLE IF NOT EXISTS "User" (
        "id" TEXT NOT NULL,
        "email" TEXT NOT NULL,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        CONSTRAINT "User_pkey" PRIMARY KEY ("id")
      )`,
      
      `CREATE TABLE IF NOT EXISTS "Show" (
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
      )`,
      
      `CREATE TABLE IF NOT EXISTS "Character" (
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
      )`,
      
      `CREATE TABLE IF NOT EXISTS "AuditionMaterial" (
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
      )`,
      
      `CREATE TABLE IF NOT EXISTS "Applicant" (
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
    ]
    
    // Execute each table creation
    for (const sql of tables) {
      await prisma.$executeRawUnsafe(sql)
      console.log('✅ Table created')
    }
    
    // Create indexes
    const indexes = [
      'CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email")',
      'CREATE INDEX IF NOT EXISTS "Show_userId_idx" ON "Show"("userId")',
      'CREATE INDEX IF NOT EXISTS "Character_showId_idx" ON "Character"("showId")',
      'CREATE INDEX IF NOT EXISTS "AuditionMaterial_showId_idx" ON "AuditionMaterial"("showId")',
      'CREATE INDEX IF NOT EXISTS "Applicant_showId_idx" ON "Applicant"("showId")'
    ]
    
    for (const sql of indexes) {
      await prisma.$executeRawUnsafe(sql)
      console.log('✅ Index created')
    }
    
    console.log('✅ Database tables created successfully!')
    
    // Test the tables
    const userCount = await prisma.user.count()
    const showCount = await prisma.show.count()
    
    console.log(`📊 Tables created: User (${userCount} records), Show (${showCount} records)`)
    
  } catch (error) {
    console.error('❌ Error setting up database:', error)
  } finally {
    await prisma.$disconnect()
  }
}

setupDatabase()
