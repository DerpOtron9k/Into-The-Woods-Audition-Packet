const { PrismaClient } = require('@prisma/client')

async function testAllConnectionFormats() {
  console.log('🔍 Testing All Supabase Connection Formats...\n')
  
  const password = 'LxaFSj77ExeS68sf'
  
  const connectionStrings = [
    {
      name: 'Direct Connection',
      url: `postgresql://postgres:${password}@db.wbcqkzbnpxmupabkreyk.supabase.co:5432/postgres`
    },
    {
      name: 'Transaction Pooler',
      url: `postgresql://postgres.wbcqkzbnpxmupabkreyk:${password}@aws-1-us-east-1.pooler.supabase.com:6543/postgres`
    },
    {
      name: 'Session Pooler',
      url: `postgresql://postgres.wbcqkzbnpxmupabkreyk:${password}@aws-1-us-east-1.pooler.supabase.com:5432/postgres`
    }
  ]
  
  for (const connection of connectionStrings) {
    console.log(`\n🔍 Testing: ${connection.name}`)
    console.log(`URL: ${connection.url.replace(/\/\/.*@/, '//***:***@')}`)
    
    try {
      const prisma = new PrismaClient({
        datasources: {
          db: {
            url: connection.url,
          },
        },
      })
      
      console.log('📡 Attempting connection...')
      await prisma.$connect()
      console.log('✅ Connection successful!')
      
      // Test a simple query
      const result = await prisma.$queryRaw`SELECT 1 as test, current_database() as db_name, version() as pg_version`
      console.log('✅ Query successful:', result)
      
      console.log(`\n🎉 ${connection.name} is working!`)
      console.log('✅ Database connected')
      console.log('✅ Queries working')
      
      // Update .env with working URL
      console.log('\n📝 Updating .env with working connection string...')
      const fs = require('fs')
      let envContent = fs.readFileSync('.env', 'utf8')
      envContent = envContent.replace(
        /DATABASE_URL="[^"]+"/,
        `DATABASE_URL="${connection.url}"`
      )
      envContent = envContent.replace(
        /DIRECT_URL="[^"]+"/,
        `DIRECT_URL="${connection.url}"`
      )
      fs.writeFileSync('.env', envContent)
      console.log('✅ Updated .env with working connection string')
      
      await prisma.$disconnect()
      return // Exit on first successful connection
      
    } catch (error) {
      console.log(`❌ ${connection.name} failed:`, error.message)
    }
  }
  
  console.log('\n📋 All connection formats failed')
  console.log('This suggests:')
  console.log('1. Project restart is still in progress')
  console.log('2. Database password needs regeneration')
  console.log('3. Network connectivity issues')
  console.log('4. Supabase service issues')
  
  console.log('\n🔧 Next steps:')
  console.log('1. Wait 2-3 minutes for project to fully restart')
  console.log('2. Try regenerating the database password in Supabase dashboard')
  console.log('3. Check if there are any error messages in the dashboard')
  console.log('4. Try from a different network')
}

testAllConnectionFormats().catch(console.error)
