const { Client } = require('pg')
require('dotenv').config()

async function createTables() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL
  })
  
  try {
    console.log('Connecting to database with direct PostgreSQL client...')
    await client.connect()
    console.log('✅ Connected to database')
    
    // Create User table
    await client.query(`
      CREATE TABLE IF NOT EXISTS "User" (
        "id" TEXT NOT NULL,
        "email" TEXT NOT NULL,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,
        CONSTRAINT "User_pkey" PRIMARY KEY ("id")
      )
    `)
    console.log('✅ User table created')
    
    // Create Show table
    await client.query(`
      CREATE TABLE IF NOT EXISTS "Show" (
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
      )
    `)
    console.log('✅ Show table created')
    
    // Create Character table
    await client.query(`
      CREATE TABLE IF NOT EXISTS "Character" (
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
      )
    `)
    console.log('✅ Character table created')
    
    // Create indexes
    await client.query('CREATE UNIQUE INDEX IF NOT EXISTS "User_email_key" ON "User"("email")')
    await client.query('CREATE INDEX IF NOT EXISTS "Show_userId_idx" ON "Show"("userId")')
    await client.query('CREATE INDEX IF NOT EXISTS "Character_showId_idx" ON "Character"("showId")')
    console.log('✅ Indexes created')
    
    // Add foreign key constraints
    await client.query('ALTER TABLE "Show" ADD CONSTRAINT "Show_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE')
    await client.query('ALTER TABLE "Character" ADD CONSTRAINT "Character_showId_fkey" FOREIGN KEY ("showId") REFERENCES "Show"("id") ON DELETE RESTRICT ON UPDATE CASCADE')
    console.log('✅ Foreign key constraints added')
    
    console.log('🎉 All tables created successfully!')
    
  } catch (error) {
    console.error('❌ Error creating tables:', error.message)
  } finally {
    await client.end()
  }
}

createTables()

