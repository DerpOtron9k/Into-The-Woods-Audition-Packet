const fs = require('fs')

function checkSupabaseConnectionString() {
  console.log('🔍 Checking Supabase Connection String Format...\n')
  
  console.log('📋 Current connection string:')
  console.log(process.env.DATABASE_URL)
  
  console.log('\n🔧 Common Supabase Connection String Formats:')
  console.log('1. Standard: postgresql://postgres:[password]@db.[project].supabase.co:5432/postgres')
  console.log('2. With SSL: postgresql://postgres:[password]@db.[project].supabase.co:5432/postgres?sslmode=require')
  console.log('3. Pooler: postgresql://postgres:[password]@db.[project].supabase.co:6543/postgres')
  console.log('4. Direct: postgresql://postgres:[password]@db.[project].supabase.co:5432/postgres')
  
  console.log('\n🎯 Your current format:')
  const currentUrl = process.env.DATABASE_URL
  if (currentUrl.includes(':5432/')) {
    console.log('✅ Using port 5432 (direct connection)')
  } else if (currentUrl.includes(':6543/')) {
    console.log('✅ Using port 6543 (pooler connection)')
  } else {
    console.log('❓ Unknown port format')
  }
  
  console.log('\n🔍 Possible Issues:')
  console.log('1. Wrong port (should be 5432 for direct, 6543 for pooler)')
  console.log('2. IPv6 connectivity issues')
  console.log('3. Firewall blocking port 5432')
  console.log('4. Supabase project database not fully initialized')
  
  console.log('\n📝 Next Steps:')
  console.log('1. Check Supabase dashboard > Settings > Database')
  console.log('2. Look for "Connection string" section')
  console.log('3. Try both "Direct connection" and "Connection pooling"')
  console.log('4. Copy the exact string from Supabase')
  console.log('5. Update .env with the exact string')
  
  console.log('\n🔑 Expected format from Supabase dashboard:')
  console.log('Direct: postgresql://postgres:[password]@db.[project].supabase.co:5432/postgres')
  console.log('Pooler: postgresql://postgres:[password]@db.[project].supabase.co:6543/postgres')
}

checkSupabaseConnectionString()
