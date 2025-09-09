const fs = require('fs')
const path = require('path')

async function setupLocal() {
  console.log('🚀 Setting up local development environment...\n')
  
  // Create local .env.local file
  console.log('📝 Creating local environment configuration...')
  const envLocalContent = `# Local Development Environment
# This file overrides .env for local development

# Clerk Keys (same as production)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_bGVhZGluZy1tb2x5LTE1MC5jbGVyay5hY2NvdW50cy5kZXYk
CLERK_SECRET_KEY=sk_test_PtiPWwalS8JqQU89mni9HGxNiuyu4Z2LcwPaGQTkPI

# Local Database (SQLite for development)
DATABASE_URL="file:./dev.db"
DIRECT_URL="file:./dev.db"

# Supabase Client URLs (for future use)
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
`
  
  const envLocalPath = path.join(process.cwd(), '.env.local')
  fs.writeFileSync(envLocalPath, envLocalContent)
  console.log('✅ Created .env.local file')
  
  // Update Prisma schema for SQLite
  console.log('🔧 Updating Prisma schema for SQLite...')
  const schemaPath = path.join(process.cwd(), 'prisma', 'schema.prisma')
  let schemaContent = fs.readFileSync(schemaPath, 'utf8')
  
  // Replace PostgreSQL with SQLite
  schemaContent = schemaContent.replace(
    'provider = "postgresql"',
    'provider = "sqlite"'
  )
  
  fs.writeFileSync(schemaPath, schemaContent)
  console.log('✅ Updated Prisma schema for SQLite')
  
  console.log('\n🎉 Local development environment setup complete!')
  console.log('\nNext steps:')
  console.log('1. Run: npm run db:generate')
  console.log('2. Run: npm run db:push')
  console.log('3. Run: npm run dev')
  console.log('4. Visit http://localhost:3000/test-db to test')
  
  console.log('\n📋 What was configured:')
  console.log('- SQLite database for local development')
  console.log('- Clerk authentication (unchanged)')
  console.log('- Local environment variables')
  console.log('- Prisma schema updated for SQLite')
}

setupLocal().catch(console.error)
