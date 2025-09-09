require('dotenv').config()

console.log('🔍 Debugging Environment Variables...\n')

console.log('📋 AWS Configuration:')
console.log('AWS_ACCESS_KEY_ID:', process.env.AWS_ACCESS_KEY_ID ? 'Set' : 'Not set')
console.log('AWS_SECRET_ACCESS_KEY:', process.env.AWS_SECRET_ACCESS_KEY ? 'Set' : 'Not set')
console.log('AWS_REGION:', process.env.AWS_REGION || 'Not set')
console.log('S3_BUCKET_NAME:', process.env.S3_BUCKET_NAME || 'Not set')
console.log('S3_BUCKET_URL:', process.env.S3_BUCKET_URL || 'Not set')

console.log('\n📋 First few characters (for verification):')
console.log('Access Key starts with:', process.env.AWS_ACCESS_KEY_ID?.substring(0, 8) || 'Not found')
console.log('Secret Key starts with:', process.env.AWS_SECRET_ACCESS_KEY?.substring(0, 8) || 'Not found')

console.log('\n📋 File upload limits:')
console.log('MAX_FILE_SIZE:', process.env.MAX_FILE_SIZE || 'Not set')
console.log('ALLOWED_FILE_TYPES:', process.env.ALLOWED_FILE_TYPES || 'Not set')

if (process.env.AWS_ACCESS_KEY_ID && process.env.AWS_SECRET_ACCESS_KEY) {
  console.log('\n✅ All required credentials are present')
  console.log('🚀 Ready to test S3 connection')
} else {
  console.log('\n❌ Missing required credentials')
  console.log('🔧 Check your .env file')
}
