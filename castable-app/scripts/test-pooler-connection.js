const { PrismaClient } = require('@prisma/client')

async function testPoolerConnection() {
  console.log('🔍 Testing Supabase Connection Pooler...\n')
  
  // Test with connection pooler (port 6543)
  const poolerUrl = process.env.DATABASE_URL.replace(':5432/', ':6543/')
  
  console.log('📋 Testing connection pooler:')
  console.log('Original URL:', process.env.DATABASE_URL?.replace(/\/\/.*@/, '//***:***@'))
  console.log('Pooler URL:', poolerUrl.replace(/\/\/.*@/, '//***:***@'))
  
  try {
    const prisma = new PrismaClient({
      datasources: {
        db: {
          url: poolerUrl,
        },
      },
    })
    
    console.log('\n📡 Attempting pooler connection...')
    await prisma.$connect()
    console.log('✅ Pooler connection successful!')
    
    // Test basic query
    console.log('📊 Testing query...')
    const result = await prisma.$queryRaw`SELECT 1 as test, current_database() as db_name`
    console.log('✅ Query successful:', result)
    
    console.log('\n🎉 Supabase pooler is working!')
    console.log('✅ Using port 6543 (connection pooler)')
    console.log('✅ Database connected')
    console.log('✅ Queries working')
    
    // Update .env with pooler URL
    console.log('\n📝 Updating .env with pooler URL...')
    const fs = require('fs')
    let envContent = fs.readFileSync('.env', 'utf8')
    envContent = envContent.replace(
      /DATABASE_URL="postgresql:\/\/postgres:[^@]+@db\.wbcqkzbnpxmupabkreyk\.supabase\.co:5432\/postgres"/,
      `DATABASE_URL="${poolerUrl}"`
    )
    envContent = envContent.replace(
      /DIRECT_URL="postgresql:\/\/postgres:[^@]+@db\.wbcqkzbnpxmupabkreyk\.supabase\.co:5432\/postgres"/,
      `DIRECT_URL="${poolerUrl}"`
    )
    fs.writeFileSync('.env', envContent)
    console.log('✅ Updated .env with pooler URL')
    
    await prisma.$disconnect()
    
  } catch (error) {
    console.log('❌ Pooler connection failed:', error.message)
    
    console.log('\n🔧 Trying alternative approaches...')
    
    // Try with SSL parameters
    try {
      const sslUrl = poolerUrl + '?sslmode=require'
      console.log('📡 Trying with SSL require...')
      
      const prisma2 = new PrismaClient({
        datasources: {
          db: {
            url: sslUrl,
          },
        },
      })
      
      await prisma2.$connect()
      console.log('✅ SSL pooler connection successful!')
      
      const result = await prisma2.$queryRaw`SELECT 1 as test`
      console.log('✅ Query successful:', result)
      
      console.log('\n🎉 Supabase SSL pooler is working!')
      
      await prisma2.$disconnect()
      
    } catch (sslError) {
      console.log('❌ SSL pooler also failed:', sslError.message)
      
      console.log('\n📋 All connection attempts failed')
      console.log('This suggests:')
      console.log('1. Network connectivity issues')
      console.log('2. Firewall blocking both ports 5432 and 6543')
      console.log('3. Supabase project database not fully initialized')
      console.log('4. IPv6 connectivity issues')
      
      console.log('\n🔧 Next steps:')
      console.log('1. Check Windows Firewall settings')
      console.log('2. Try from a different network')
      console.log('3. Contact Supabase support')
      console.log('4. Create a new Supabase project')
    }
  }
}

testPoolerConnection().catch(console.error)
