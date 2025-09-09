const { PrismaClient } = require('@prisma/client')
const fs = require('fs')
const path = require('path')

async function setupSupabaseConnection() {
  console.log('🚀 Setting up Supabase PostgreSQL Connection...\n')
  
  console.log('📋 Current Configuration:')
  console.log('Project URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
  console.log('Database URL:', process.env.DATABASE_URL?.replace(/\/\/.*@/, '//***:***@'))
  console.log('API Key:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 20) + '...')
  
  console.log('\n🔍 Testing Supabase Project Status...')
  
  // Test 1: Check if project is accessible
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/`, {
      headers: {
        'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`
      }
    })
    
    if (response.ok) {
      console.log('✅ Supabase project is accessible')
    } else {
      console.log('❌ Supabase project error:', response.status, response.statusText)
      const error = await response.text()
      console.log('Error details:', error)
    }
  } catch (error) {
    console.log('❌ Network error:', error.message)
  }
  
  // Test 2: Check database connection
  console.log('\n🔍 Testing Database Connection...')
  const prisma = new PrismaClient()
  
  try {
    await prisma.$connect()
    console.log('✅ Database connection successful!')
    
    // Test basic query
    const result = await prisma.$queryRaw`SELECT 1 as test`
    console.log('✅ Query test successful:', result)
    
    console.log('\n🎉 Supabase is working!')
    console.log('✅ Project accessible')
    console.log('✅ Database connected')
    console.log('✅ Ready for development')
    
  } catch (error) {
    console.log('❌ Database connection failed:', error.message)
    
    if (error.code === 'P1001') {
      console.log('\n🔧 Troubleshooting P1001 (Can\'t reach database server):')
      console.log('1. Check if Supabase project is paused')
      console.log('2. Verify database credentials are correct')
      console.log('3. Ensure project is active in Supabase dashboard')
      console.log('4. Check if database password was reset')
    }
    
    console.log('\n📋 Next Steps:')
    console.log('1. Visit: https://supabase.com/dashboard')
    console.log('2. Check project status')
    console.log('3. Get correct credentials')
    console.log('4. Update .env file')
    
  } finally {
    await prisma.$disconnect()
  }
  
  console.log('\n📝 Supabase Setup Instructions:')
  console.log('1. Go to https://supabase.com/dashboard')
  console.log('2. Find your project: wbcqkzbnpxmupabkreyk')
  console.log('3. Check if project is paused or active')
  console.log('4. If paused, click "Resume" or "Restore"')
  console.log('5. Go to Settings > Database')
  console.log('6. Copy the connection string')
  console.log('7. Go to Settings > API')
  console.log('8. Copy the anon public key')
  console.log('9. Update .env file with correct values')
  
  console.log('\n🔑 Required Environment Variables:')
  console.log('DATABASE_URL="postgresql://postgres:[PASSWORD]@db.[PROJECT].supabase.co:5432/postgres"')
  console.log('NEXT_PUBLIC_SUPABASE_URL="https://[PROJECT].supabase.co"')
  console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY="[ANON_KEY]"')
}

setupSupabaseConnection().catch(console.error)
