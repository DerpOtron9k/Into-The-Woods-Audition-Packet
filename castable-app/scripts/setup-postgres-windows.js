const { execSync } = require('child_process')
const fs = require('fs')
const path = require('path')

async function setupPostgreSQLWindows() {
  console.log('🚀 Setting up PostgreSQL for Windows (PRD Compliant)...\n')
  
  // Check if PostgreSQL is already installed
  try {
    console.log('🔍 Checking for existing PostgreSQL installation...')
    execSync('psql --version', { stdio: 'pipe' })
    console.log('✅ PostgreSQL found!')
    
    // Test connection
    try {
      execSync('psql -h localhost -U postgres -d postgres -c "SELECT 1;"', { stdio: 'pipe' })
      console.log('✅ PostgreSQL connection successful!')
      
      // Create database
      console.log('📊 Creating castable_dev database...')
      execSync('psql -h localhost -U postgres -c "CREATE DATABASE castable_dev;"', { stdio: 'pipe' })
      console.log('✅ Database created successfully!')
      
      // Update .env with local PostgreSQL
      updateEnvForLocalPostgres()
      
    } catch (error) {
      console.log('⚠️ PostgreSQL found but connection failed')
      console.log('Please ensure PostgreSQL is running and accessible')
      console.log('Default connection: localhost:5432, user: postgres')
    }
    
  } catch (error) {
    console.log('❌ PostgreSQL not found')
    console.log('\n📥 PostgreSQL Installation Required:')
    console.log('1. Download PostgreSQL from: https://www.postgresql.org/download/windows/')
    console.log('2. Install with default settings')
    console.log('3. Set password for postgres user during installation')
    console.log('4. Run this script again')
    
    console.log('\n🔧 Alternative: Use Portable PostgreSQL')
    console.log('1. Download portable PostgreSQL from: https://www.enterprisedb.com/download-postgresql-binaries')
    console.log('2. Extract to C:\\pgsql')
    console.log('3. Add C:\\pgsql\\bin to PATH')
    console.log('4. Run this script again')
    
    console.log('\n🐳 Alternative: Use Docker (if available)')
    console.log('1. Install Docker Desktop')
    console.log('2. Run: docker run --name castable-postgres -e POSTGRES_PASSWORD=password -e POSTGRES_DB=castable_dev -p 5432:5432 -d postgres:15')
    
    process.exit(1)
  }
}

function updateEnvForLocalPostgres() {
  console.log('📝 Updating .env for local PostgreSQL...')
  
  const envContent = `# Clerk Keys
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_bGVhZGluZy1tb2x5LTE1MC5jbGVyay5hY2NvdW50cy5kZXYk
CLERK_SECRET_KEY=sk_test_PtiPWwalS8JqQU89mni9HGxNiuyu4Z2LcwPaGQTkPI

# PostgreSQL Database (PRD Compliant - Local)
DATABASE_URL="postgresql://postgres:password@localhost:5432/castable_dev"
DIRECT_URL="postgresql://postgres:password@localhost:5432/castable_dev"

# Supabase Client URLs (for future use)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here`
  
  fs.writeFileSync('.env', envContent)
  console.log('✅ Updated .env with local PostgreSQL configuration')
  
  console.log('\n🎉 PostgreSQL setup complete!')
  console.log('✅ PRD compliant: Using PostgreSQL as required')
  console.log('✅ Local development: PostgreSQL running locally')
  console.log('\nNext steps:')
  console.log('1. Run: npm run db:generate')
  console.log('2. Run: npm run db:push')
  console.log('3. Run: npm run dev')
  console.log('4. Test: curl http://localhost:3001/api/health')
}

setupPostgreSQLWindows().catch(console.error)
