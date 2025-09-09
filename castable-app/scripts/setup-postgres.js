const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

async function setupPostgreSQL() {
  console.log('🚀 Setting up PostgreSQL as required by PRD...\n')
  
  // Check if we can use Docker for PostgreSQL
  try {
    console.log('📦 Checking for Docker...')
    execSync('docker --version', { stdio: 'pipe' })
    console.log('✅ Docker found')
    
    // Create docker-compose.yml for PostgreSQL
    const dockerCompose = `version: '3.8'

services:
  postgres:
    image: postgres:15
    container_name: castable-postgres
    environment:
      POSTGRES_DB: castable_dev
      POSTGRES_USER: postgres
      POSTGRES_PASSWORD: password
    ports:
      - "5432:5432"
    volumes:
      - postgres_data:/var/lib/postgresql/data
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U postgres"]
      interval: 5s
      timeout: 5s
      retries: 5

volumes:
  postgres_data:`
    
    fs.writeFileSync('docker-compose.yml', dockerCompose)
    console.log('✅ Created docker-compose.yml')
    
    // Start PostgreSQL container
    console.log('🐘 Starting PostgreSQL container...')
    execSync('docker-compose up -d', { stdio: 'inherit' })
    
    // Wait for PostgreSQL to be ready
    console.log('⏳ Waiting for PostgreSQL to be ready...')
    await new Promise(resolve => setTimeout(resolve, 10000))
    
    // Update .env with local PostgreSQL
    console.log('📝 Updating environment configuration...')
    const envContent = `# Clerk Keys
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_bGVhZGluZy1tb2x5LTE1MC5jbGVyay5hY2NvdW50cy5kZXYk
CLERK_SECRET_KEY=sk_test_PtiPWwalS8JqQU89mni9HGxNiuyu4Z2LcwPaGQTkPI

# PostgreSQL Database (PRD Compliant)
DATABASE_URL="postgresql://postgres:password@localhost:5432/castable_dev"
DIRECT_URL="postgresql://postgres:password@localhost:5432/castable_dev"

# Supabase Client URLs (for future use)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here`
    
    fs.writeFileSync('.env', envContent)
    console.log('✅ Updated .env with PostgreSQL configuration')
    
    console.log('\n🎉 PostgreSQL setup complete!')
    console.log('✅ PRD compliant: Using PostgreSQL as required')
    console.log('✅ Local development: PostgreSQL running in Docker')
    console.log('\nNext steps:')
    console.log('1. Run: npm run db:generate')
    console.log('2. Run: npm run db:push')
    console.log('3. Run: npm run dev')
    
  } catch (error) {
    console.error('❌ Docker not available or failed to start PostgreSQL')
    console.log('\n🔧 Alternative setup options:')
    console.log('1. Install PostgreSQL locally')
    console.log('2. Use a cloud PostgreSQL service (Neon, Supabase, etc.)')
    console.log('3. Use the existing Supabase project (if credentials are correct)')
    
    console.log('\n📋 PRD Requirements:')
    console.log('- Database: PostgreSQL (REQUIRED)')
    console.log('- Cannot use SQLite for production')
    console.log('- Must be PostgreSQL for SaaS scalability')
    
    process.exit(1)
  }
}

setupPostgreSQL().catch(console.error)
