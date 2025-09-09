const { PrismaClient } = require('@prisma/client')

async function testConnectionVariants() {
  console.log('🔍 Testing Different Connection Approaches...\n')
  
  // Test 1: Try with different connection parameters
  console.log('🔍 Test 1: Connection with SSL parameters')
  try {
    const prisma1 = new PrismaClient({
      datasources: {
        db: {
          url: process.env.DATABASE_URL + '?sslmode=require',
        },
      },
    })
    
    await prisma1.$connect()
    console.log('✅ Connection with SSL mode successful!')
    await prisma1.$disconnect()
    return
  } catch (error) {
    console.log('❌ SSL mode failed:', error.message)
  }
  
  // Test 2: Try with different SSL mode
  console.log('\n🔍 Test 2: Connection with SSL mode prefer')
  try {
    const prisma2 = new PrismaClient({
      datasources: {
        db: {
          url: process.env.DATABASE_URL + '?sslmode=prefer',
        },
      },
    })
    
    await prisma2.$connect()
    console.log('✅ Connection with SSL prefer successful!')
    await prisma2.$disconnect()
    return
  } catch (error) {
    console.log('❌ SSL prefer failed:', error.message)
  }
  
  // Test 3: Try with connection pooling parameters
  console.log('\n🔍 Test 3: Connection with pooling parameters')
  try {
    const prisma3 = new PrismaClient({
      datasources: {
        db: {
          url: process.env.DATABASE_URL + '?connection_limit=1&pool_timeout=20',
        },
      },
    })
    
    await prisma3.$connect()
    console.log('✅ Connection with pooling successful!')
    await prisma3.$disconnect()
    return
  } catch (error) {
    console.log('❌ Pooling parameters failed:', error.message)
  }
  
  // Test 4: Try direct connection without Prisma
  console.log('\n🔍 Test 4: Direct PostgreSQL connection test')
  try {
    const { Client } = require('pg')
    const client = new Client({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    })
    
    await client.connect()
    console.log('✅ Direct PostgreSQL connection successful!')
    const result = await client.query('SELECT 1 as test')
    console.log('✅ Direct query result:', result.rows)
    await client.end()
    return
  } catch (error) {
    console.log('❌ Direct connection failed:', error.message)
  }
  
  // Test 5: Check if it's a Prisma-specific issue
  console.log('\n🔍 Test 5: Prisma version and configuration check')
  console.log('Prisma version:', require('@prisma/client').PrismaClient.name)
  console.log('Node version:', process.version)
  console.log('Platform:', process.platform)
  
  console.log('\n📋 All connection attempts failed')
  console.log('This suggests a deeper issue with:')
  console.log('1. Network connectivity to Supabase')
  console.log('2. Firewall blocking port 5432')
  console.log('3. Supabase database service issue')
  console.log('4. Prisma configuration issue')
  
  console.log('\n🔧 Troubleshooting steps:')
  console.log('1. Check if you can ping db.wbcqkzbnpxmupabkreyk.supabase.co')
  console.log('2. Try connecting from a different network')
  console.log('3. Check Windows Firewall settings')
  console.log('4. Try using a different PostgreSQL client')
}

testConnectionVariants().catch(console.error)
