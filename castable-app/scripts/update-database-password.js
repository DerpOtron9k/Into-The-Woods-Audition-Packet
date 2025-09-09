const fs = require('fs')
const path = require('path')

function updateDatabasePassword() {
  console.log('🔧 Updating Supabase database password...\n')
  
  const newPassword = 'LxaFSj77ExeS68sf'
  
  // Read current .env file
  const envPath = path.join(process.cwd(), '.env')
  let envContent = fs.readFileSync(envPath, 'utf8')
  
  // Update the database password in both DATABASE_URL and DIRECT_URL
  envContent = envContent.replace(
    /postgresql:\/\/postgres:[^@]+@db\.wbcqkzbnpxmupabkreyk\.supabase\.co:5432\/postgres/g,
    `postgresql://postgres:${newPassword}@db.wbcqkzbnpxmupabkreyk.supabase.co:5432/postgres`
  )
  
  // Write back to .env
  fs.writeFileSync(envPath, envContent)
  
  console.log('✅ Updated database password')
  console.log('✅ New password:', newPassword)
  
  console.log('\n🔍 Updated connection strings:')
  console.log('DATABASE_URL="postgresql://postgres:***@db.wbcqkzbnpxmupabkreyk.supabase.co:5432/postgres"')
  console.log('DIRECT_URL="postgresql://postgres:***@db.wbcqkzbnpxmupabkreyk.supabase.co:5432/postgres"')
  
  console.log('\n🚀 Testing updated connection...')
  console.log('Run: npm run db:test')
}

updateDatabasePassword()
