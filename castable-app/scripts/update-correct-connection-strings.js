const fs = require('fs')

function updateConnectionStrings() {
  console.log('🔧 Updating Connection Strings with Correct Format...\n')
  
  const password = 'LxaFSj77ExeS68sf'
  
  const connectionStrings = {
    direct: `postgresql://postgres:${password}@db.wbcqkzbnpxmupabkreyk.supabase.co:5432/postgres`,
    transactionPooler: `postgresql://postgres.wbcqkzbnpxmupabkreyk:${password}@aws-1-us-east-1.pooler.supabase.com:6543/postgres`,
    sessionPooler: `postgresql://postgres.wbcqkzbnpxmupabkreyk:${password}@aws-1-us-east-1.pooler.supabase.com:5432/postgres`
  }
  
  console.log('📋 Correct Connection Strings:')
  console.log('Direct:', connectionStrings.direct.replace(/\/\/.*@/, '//***:***@'))
  console.log('Transaction Pooler:', connectionStrings.transactionPooler.replace(/\/\/.*@/, '//***:***@'))
  console.log('Session Pooler:', connectionStrings.sessionPooler.replace(/\/\/.*@/, '//***:***@'))
  
  // Read current .env
  let envContent = fs.readFileSync('.env', 'utf8')
  
  // Update DATABASE_URL with direct connection
  envContent = envContent.replace(
    /DATABASE_URL="[^"]+"/,
    `DATABASE_URL="${connectionStrings.direct}"`
  )
  
  // Update DIRECT_URL with direct connection
  envContent = envContent.replace(
    /DIRECT_URL="[^"]+"/,
    `DIRECT_URL="${connectionStrings.direct}"`
  )
  
  // Write updated .env
  fs.writeFileSync('.env', envContent)
  
  console.log('\n✅ Updated .env with correct connection strings')
  console.log('📝 Using direct connection for both DATABASE_URL and DIRECT_URL')
  
  return connectionStrings
}

const connectionStrings = updateConnectionStrings()

// Export for testing
module.exports = connectionStrings
