const fs = require('fs')
const path = require('path')

function updateSupabaseWithKey() {
  console.log('🔧 Updating Supabase credentials with new anon key...\n')
  
  const newAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndiY3FremJucHhtdXBhYmtyZXlrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTcxMzQ3OTAsImV4cCI6MjA3MjcxMDc5MH0.Rtp6-EHIRs6SEdfVw9J5V2eegbRca8tXyj98NlhmZ6I'
  
  // Read current .env file
  const envPath = path.join(process.cwd(), '.env')
  let envContent = fs.readFileSync(envPath, 'utf8')
  
  // Update the anon key
  envContent = envContent.replace(
    /NEXT_PUBLIC_SUPABASE_ANON_KEY=.*/,
    `NEXT_PUBLIC_SUPABASE_ANON_KEY=${newAnonKey}`
  )
  
  // Write back to .env
  fs.writeFileSync(envPath, envContent)
  
  console.log('✅ Updated NEXT_PUBLIC_SUPABASE_ANON_KEY')
  console.log('✅ New key:', newAnonKey.substring(0, 20) + '...')
  
  console.log('\n🔍 Testing updated credentials...')
  console.log('Project URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
  console.log('New API Key:', newAnonKey.substring(0, 20) + '...')
  
  console.log('\n📋 Next steps:')
  console.log('1. Test API connection')
  console.log('2. Test database connection')
  console.log('3. Push schema if connection works')
  
  console.log('\n🚀 Run these commands to test:')
  console.log('npm run db:test')
  console.log('npm run db:push')
  console.log('curl http://localhost:3001/api/health')
}

updateSupabaseWithKey()
