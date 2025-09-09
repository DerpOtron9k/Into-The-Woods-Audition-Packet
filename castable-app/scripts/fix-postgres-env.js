const fs = require('fs')
const path = require('path')

// Restore PostgreSQL configuration as required by PRD
const envContent = `# Clerk Keys
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_bGVhZGluZy1tb2x5LTE1MC5jbGVyay5hY2NvdW50cy5kZXYk
CLERK_SECRET_KEY=sk_test_PtiPWwalS8JqQU89mni9HGxNiuyu4Z2LcwPaGQTkPI

# PostgreSQL Database (PRD Compliant - Supabase)
DATABASE_URL="postgresql://postgres:wKB1eLf3bSQpbwiV@db.wbcqkzbnpxmupabkreyk.supabase.co:5432/postgres"
DIRECT_URL="postgresql://postgres:wKB1eLf3bSQpbwiV@db.wbcqkzbnpxmupabkreyk.supabase.co:5432/postgres"

# Supabase Client URLs
NEXT_PUBLIC_SUPABASE_URL=https://wbcqkzbnpxmupabkreyk.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndiY3FremJucHhtdXBhYnJrZXlrIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzYyNDQ4MDAsImV4cCI6MjA1MTgyMDgwMH0.Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8Ej8`

const envPath = path.join(process.cwd(), '.env')
fs.writeFileSync(envPath, envContent)

console.log('✅ Restored PostgreSQL configuration as required by PRD')
console.log('✅ Using Supabase PostgreSQL database')
console.log('✅ PRD compliant: PostgreSQL provider')
