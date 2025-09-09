const fs = require('fs')
const path = require('path')

// Read current .env file
const envPath = path.join(process.cwd(), '.env')
let envContent = fs.readFileSync(envPath, 'utf8')

// Replace database URLs with SQLite
envContent = envContent.replace(
  /DATABASE_URL="postgresql:.*?"/g,
  'DATABASE_URL="file:./dev.db"'
)

// Remove DIRECT_URL line
envContent = envContent.replace(/DIRECT_URL=".*?"\n?/g, '')

// Write back to .env
fs.writeFileSync(envPath, envContent)

console.log('✅ Fixed .env file for SQLite')
console.log('Updated DATABASE_URL to use SQLite')
console.log('Removed DIRECT_URL (not needed for SQLite)')
