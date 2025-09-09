const { PrismaClient } = require('@prisma/client')
require('dotenv').config()

async function createTables() {
  try {
    console.log('Creating database tables with fresh connection...')
    
    // Create a completely fresh Prisma client
    const prisma = new PrismaClient({
      datasources: {
        db: {
          url: process.env.DATABASE_URL
        }
      }
    })
    
    // Test connection first
    await prisma.$connect()
    console.log('✅ Connected to database')
    
    // Create tables one by one with fresh connections
    const tables = [
      {
        name: 'User',
        sql: `CREATE TABLE IF NOT EXISTS "User" (
          "id" TEXT NOT NULL,
          "email" TEXT NOT NULL,
          "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
          "updatedAt" TIMESTAMP(3) NOT NULL,
          CONSTRAINT "User_pkey" PRIMARY KEY ("id")
        )`
      },
      {
        name: 'Show',
        sql: `CREATE TABLE IF NOT EXISTS "Show" (
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
      },
      {
        name: 'Character',
        sql: `CREATE TABLE IF NOT EXISTS "Character" (
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
      },
      {
        name: 'AuditionMaterial',
        sql: `CREATE TABLE IF NOT EXISTS "AuditionMaterial" (
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
      },
      {
        name: 'Applicant',
        sql: `CREATE TABLE IF NOT EXISTS "Applicant" (
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
      }
    ]
    
    for (const table of tables) {
      try {
        await prisma.$executeRawUnsafe(table.sql)
        console.log(`✅ ${table.name} table created`)
      } catch (error) {
        console.log(`⚠️  ${table.name} table might already exist:`, error.message)
      }
    }
    
    // Create indexes
    const indexes = [
      'CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email")',
      'CREATE INDEX IF NOT EXISTS "Show_userId_idx" ON "Show"("userId")',
      'CREATE INDEX IF NOT EXISTS "Character_showId_idx" ON "Character"("showId")',
      'CREATE INDEX IF NOT EXISTS "AuditionMaterial_showId_idx" ON "AuditionMaterial"("showId")',
      'CREATE INDEX IF NOT EXISTS "Applicant_showId_idx" ON "Applicant"("showId")'
    ]
    
    for (const indexSql of indexes) {
      try {
        await prisma.$executeRawUnsafe(indexSql)
        console.log('✅ Index created')
      } catch (error) {
        console.log('⚠️  Index might already exist:', error.message)
      }
    }
    
    console.log('🎉 Database setup complete!')
    
  } catch (error) {
    console.error('❌ Error:', error)
  }
}

createTables()

