console.log('🔍 Supabase Dashboard Connection String Check\n')

console.log('📋 Current .env configuration:')
console.log('DATABASE_URL:', process.env.DATABASE_URL?.replace(/\/\/.*@/, '//***:***@'))
console.log('DIRECT_URL:', process.env.DIRECT_URL?.replace(/\/\/.*@/, '//***:***@'))

console.log('\n🎯 Next Steps:')
console.log('1. Go to Supabase Dashboard → Settings → Database')
console.log('2. Look for "Connection string" section')
console.log('3. Copy the EXACT string from the dashboard')
console.log('4. It should look like one of these:')
console.log('   - postgresql://postgres:[password]@db.[project].supabase.co:5432/postgres')
console.log('   - postgresql://postgres:[password]@db.[project].supabase.co:6543/postgres')

console.log('\n🔧 Common Issues After Restart:')
console.log('1. Password might have changed')
console.log('2. Connection string format might be different')
console.log('3. Project might need a few minutes to fully restart')
console.log('4. Database might be on a different port')

console.log('\n📝 What to Check in Dashboard:')
console.log('1. Is the project status "Active" (not "Paused")?')
console.log('2. Is there a "Resume" or "Restore" button?')
console.log('3. What does the connection string show?')
console.log('4. Are there any error messages?')

console.log('\n🚀 Quick Test:')
console.log('Try copying the connection string directly from the dashboard')
console.log('and paste it into the .env file to replace DATABASE_URL')

console.log('\n⏰ If Still Failing:')
console.log('Wait 2-3 minutes for the project to fully restart')
console.log('Sometimes it takes a moment for all services to come online')
