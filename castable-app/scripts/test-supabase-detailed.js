const { PrismaClient } = require('@prisma/client')

async function testSupabaseDetailed() {
  console.log('🔍 Detailed Supabase Connection Test...\n')
  
  console.log('📋 Environment Variables:')
  console.log('DATABASE_URL:', process.env.DATABASE_URL?.replace(/\/\/.*@/, '//***:***@'))
  console.log('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
  console.log('NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY?.substring(0, 20) + '...')
  
  // Test 1: Check if we can reach the Supabase API
  console.log('\n🔍 Test 1: Supabase API Access')
  try {
    const response = await fetch(`${process.env.NEXT_PUBLIC_SUPABASE_URL}/rest/v1/`, {
      headers: {
        'apikey': process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY}`
      }
    })
    
    if (response.ok) {
      console.log('✅ Supabase API is accessible')
    } else {
      console.log('❌ Supabase API error:', response.status, response.statusText)
    }
  } catch (error) {
    console.log('❌ API test failed:', error.message)
  }
  
  // Test 2: Try to connect to database with detailed error handling
  console.log('\n🔍 Test 2: Database Connection')
  const prisma = new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL,
      },
    },
    log: ['query', 'info', 'warn', 'error'],
  })
  
  try {
    console.log('📡 Attempting database connection...')
    await prisma.$connect()
    console.log('✅ Database connection successful!')
    
    // Test basic query
    console.log('📊 Testing basic query...')
    const result = await prisma.$queryRaw`SELECT 1 as test, current_database() as db_name, current_user as user_name`
    console.log('✅ Query successful:', result)
    
    console.log('\n🎉 Supabase is fully working!')
    console.log('✅ API accessible')
    console.log('✅ Database connected')
    console.log('✅ Queries working')
    
  } catch (error) {
    console.log('❌ Database connection failed:')
    console.log('Error code:', error.code)
    console.log('Error message:', error.message)
    
    if (error.code === 'P1001') {
      console.log('\n🔧 P1001 Troubleshooting:')
      console.log('1. Check if project is paused in Supabase dashboard')
      console.log('2. Verify database password is correct')
      console.log('3. Check if project has been deleted or suspended')
      console.log('4. Try regenerating the database password')
    }
    
    if (error.code === 'P1002') {
      console.log('\n🔧 P1002 Troubleshooting:')
      console.log('1. Check if database exists')
      console.log('2. Verify connection string format')
    }
    
    console.log('\n📋 Possible Issues:')
    console.log('- Project is paused (most common)')
    console.log('- Database password is incorrect')
    console.log('- Project has been deleted')
    console.log('- Network connectivity issues')
    console.log('- Supabase service outage')
    
  } finally {
    await prisma.$disconnect()
  }
  
  console.log('\n📞 Next Steps:')
  console.log('1. Check Supabase dashboard for project status')
  console.log('2. If paused, click "Resume" or "Restore"')
  console.log('3. If active, try regenerating database password')
  console.log('4. Check Supabase status page for outages')
}

testSupabaseDetailed().catch(console.error)
