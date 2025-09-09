const { PrismaClient } = require('@prisma/client')

async function testConnectionStringVariants() {
  console.log('🔍 Testing Different Connection String Formats...\n')
  
  const baseUrl = 'postgresql://postgres:LxaFSj77ExeS68sf@db.wbcqkzbnpxmupabkreyk.supabase.co'
  
  const variants = [
    {
      name: 'Standard (5432)',
      url: `${baseUrl}:5432/postgres`
    },
    {
      name: 'Pooler (6543)',
      url: `${baseUrl}:6543/postgres`
    },
    {
      name: 'With SSL require',
      url: `${baseUrl}:5432/postgres?sslmode=require`
    },
    {
      name: 'Pooler with SSL',
      url: `${baseUrl}:6543/postgres?sslmode=require`
    },
    {
      name: 'With connection pooling',
      url: `${baseUrl}:5432/postgres?connection_limit=1&pool_timeout=20`
    },
    {
      name: 'Pooler with pooling',
      url: `${baseUrl}:6543/postgres?connection_limit=1&pool_timeout=20`
    }
  ]
  
  for (const variant of variants) {
    console.log(`\n🔍 Testing: ${variant.name}`)
    console.log(`URL: ${variant.url.replace(/\/\/.*@/, '//***:***@')}`)
    
    try {
      const prisma = new PrismaClient({
        datasources: {
          db: {
            url: variant.url,
          },
        },
      })
      
      await prisma.$connect()
      console.log('✅ Connection successful!')
      
      // Test a simple query
      const result = await prisma.$queryRaw`SELECT 1 as test, current_database() as db_name, version() as pg_version`
      console.log('✅ Query successful:', result)
      
      console.log(`\n🎉 ${variant.name} is working!`)
      console.log('✅ Database connected')
      console.log('✅ Queries working')
      
      // Update .env with working URL
      console.log('\n📝 Updating .env with working connection string...')
      const fs = require('fs')
      let envContent = fs.readFileSync('.env', 'utf8')
      envContent = envContent.replace(
        /DATABASE_URL="[^"]+"/,
        `DATABASE_URL="${variant.url}"`
      )
      envContent = envContent.replace(
        /DIRECT_URL="[^"]+"/,
        `DIRECT_URL="${variant.url}"`
      )
      fs.writeFileSync('.env', envContent)
      console.log('✅ Updated .env with working connection string')
      
      await prisma.$disconnect()
      return // Exit on first successful connection
      
    } catch (error) {
      console.log(`❌ ${variant.name} failed:`, error.message)
    }
  }
  
  console.log('\n📋 All connection variants failed')
  console.log('This suggests:')
  console.log('1. Project restart is still in progress (wait 2-3 minutes)')
  console.log('2. Database password needs regeneration')
  console.log('3. Project has different connection requirements')
  console.log('4. Network connectivity issues persist')
  
  console.log('\n🔧 Next steps:')
  console.log('1. Wait 2-3 minutes for project to fully restart')
  console.log('2. Check Supabase dashboard for any error messages')
  console.log('3. Try regenerating the database password')
  console.log('4. Check if project has specific connection requirements')
}

testConnectionStringVariants().catch(console.error)
