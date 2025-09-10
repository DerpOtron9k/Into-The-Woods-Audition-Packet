// Test Clerk configuration
require('dotenv').config()
console.log('Testing Clerk Configuration...\n')

// Check environment variables
const clerkPublishableKey = process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY
const clerkSecretKey = process.env.CLERK_SECRET_KEY

console.log('Clerk Publishable Key:', clerkPublishableKey ? 'Present' : 'Missing')
console.log('Clerk Secret Key:', clerkSecretKey ? 'Present' : 'Missing')

if (clerkPublishableKey) {
  console.log('Key starts with:', clerkPublishableKey.substring(0, 20) + '...')
  console.log('Key length:', clerkPublishableKey.length)
}

// Test if the key format is correct
if (clerkPublishableKey && clerkPublishableKey.startsWith('pk_test_')) {
  console.log('✅ Key format looks correct')
} else {
  console.log('❌ Key format might be incorrect')
}

console.log('\nIf you see this, the environment variables are loading correctly.')
console.log('The issue might be with the Clerk project configuration or domain whitelisting.')
