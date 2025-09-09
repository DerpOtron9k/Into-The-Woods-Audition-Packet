const fs = require('fs')
const path = require('path')

function testS3Configuration() {
  console.log('🔍 Testing S3 Configuration...\n')
  
  // Check if .env file exists
  const envPath = path.join(process.cwd(), '.env')
  if (!fs.existsSync(envPath)) {
    console.log('❌ .env file not found')
    return
  }
  
  // Read .env file
  const envContent = fs.readFileSync(envPath, 'utf8')
  
  // Check for required S3 environment variables
  const requiredVars = [
    'AWS_ACCESS_KEY_ID',
    'AWS_SECRET_ACCESS_KEY', 
    'AWS_REGION',
    'S3_BUCKET_NAME',
    'S3_BUCKET_URL'
  ]
  
  console.log('📋 Checking required environment variables:')
  let allConfigured = true
  
  requiredVars.forEach(varName => {
    const regex = new RegExp(`^${varName}=(.+)$`, 'm')
    const match = envContent.match(regex)
    
    if (match && match[1] && match[1] !== `your_${varName.toLowerCase()}`) {
      console.log(`✅ ${varName}: Configured`)
    } else {
      console.log(`❌ ${varName}: Not configured or using placeholder`)
      allConfigured = false
    }
  })
  
  console.log('\n📋 File upload limits:')
  const maxFileSize = envContent.match(/^MAX_FILE_SIZE=(.+)$/m)
  const allowedTypes = envContent.match(/^ALLOWED_FILE_TYPES=(.+)$/m)
  
  if (maxFileSize) {
    const sizeInMB = parseInt(maxFileSize[1]) / 1024 / 1024
    console.log(`✅ Max file size: ${sizeInMB}MB`)
  } else {
    console.log('❌ MAX_FILE_SIZE not configured')
  }
  
  if (allowedTypes) {
    console.log(`✅ Allowed file types: ${allowedTypes[1]}`)
  } else {
    console.log('❌ ALLOWED_FILE_TYPES not configured')
  }
  
  console.log('\n📋 S3 Configuration Status:')
  if (allConfigured) {
    console.log('✅ All required variables are configured')
    console.log('✅ Ready for S3 file uploads')
    console.log('\n🚀 Next steps:')
    console.log('1. Start the development server: npm run dev')
    console.log('2. Visit http://localhost:3000/test-s3')
    console.log('3. Test file uploads with different file types')
  } else {
    console.log('❌ S3 configuration incomplete')
    console.log('\n🔧 To complete setup:')
    console.log('1. Get AWS credentials from AWS Console')
    console.log('2. Create an S3 bucket')
    console.log('3. Update .env file with real values')
    console.log('4. Replace placeholder values with actual credentials')
  }
  
  console.log('\n📝 Example .env configuration:')
  console.log('AWS_ACCESS_KEY_ID=AKIA...')
  console.log('AWS_SECRET_ACCESS_KEY=...')
  console.log('AWS_REGION=us-east-1')
  console.log('S3_BUCKET_NAME=your-bucket-name')
  console.log('S3_BUCKET_URL=https://your-bucket-name.s3.amazonaws.com')
}

testS3Configuration()
