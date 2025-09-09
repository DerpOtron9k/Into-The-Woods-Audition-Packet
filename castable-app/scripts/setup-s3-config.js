const fs = require('fs')
const path = require('path')

function setupS3Config() {
  console.log('🔧 S3 Configuration Setup Helper\n')
  
  const envPath = path.join(process.cwd(), '.env')
  
  // Check if .env exists
  if (!fs.existsSync(envPath)) {
    console.log('❌ .env file not found')
    return
  }
  
  let envContent = fs.readFileSync(envPath, 'utf8')
  
  // Check if S3 config already exists
  if (envContent.includes('AWS_ACCESS_KEY_ID')) {
    console.log('✅ S3 configuration already exists in .env')
    console.log('📋 Current S3 configuration:')
    
    const s3Vars = [
      'AWS_ACCESS_KEY_ID',
      'AWS_SECRET_ACCESS_KEY',
      'AWS_REGION',
      'S3_BUCKET_NAME',
      'S3_BUCKET_URL',
      'MAX_FILE_SIZE',
      'ALLOWED_FILE_TYPES'
    ]
    
    s3Vars.forEach(varName => {
      const regex = new RegExp(`^${varName}=(.+)$`, 'm')
      const match = envContent.match(regex)
      if (match) {
        const value = match[1]
        const displayValue = varName.includes('KEY') ? 
          value.substring(0, 8) + '...' : value
        console.log(`  ${varName}: ${displayValue}`)
      }
    })
    
    console.log('\n🚀 To test S3:')
    console.log('1. npm run dev')
    console.log('2. Visit http://localhost:3000/test-s3')
    console.log('3. Try uploading a test file')
    
  } else {
    console.log('📝 Adding S3 configuration template to .env...')
    
    const s3Config = `

# AWS S3 Configuration
AWS_ACCESS_KEY_ID=your_aws_access_key_id_here
AWS_SECRET_ACCESS_KEY=your_aws_secret_access_key_here
AWS_REGION=us-east-1
S3_BUCKET_NAME=castable-audition-files
S3_BUCKET_URL=https://castable-audition-files.s3.amazonaws.com

# File Upload Limits
MAX_FILE_SIZE=10485760
ALLOWED_FILE_TYPES=image/jpeg,image/png,image/webp,application/pdf,audio/mpeg,audio/wav,video/mp4`
    
    // Add S3 config to .env
    envContent += s3Config
    fs.writeFileSync(envPath, envContent)
    
    console.log('✅ S3 configuration template added to .env')
    console.log('\n🔧 Next steps:')
    console.log('1. Get AWS credentials from AWS Console')
    console.log('2. Replace placeholder values in .env:')
    console.log('   - AWS_ACCESS_KEY_ID=AKIA...')
    console.log('   - AWS_SECRET_ACCESS_KEY=...')
    console.log('   - S3_BUCKET_NAME=your-bucket-name')
    console.log('   - S3_BUCKET_URL=https://your-bucket-name.s3.amazonaws.com')
    console.log('3. Run: node scripts/test-s3-config.js')
    console.log('4. Start dev server: npm run dev')
    console.log('5. Test at: http://localhost:3000/test-s3')
  }
  
  console.log('\n📋 S3 Configuration Checklist:')
  console.log('□ AWS Account created')
  console.log('□ S3 bucket created')
  console.log('□ IAM user created with S3 access')
  console.log('□ Access keys copied to .env')
  console.log('□ Bucket name updated in .env')
  console.log('□ Configuration tested')
}

setupS3Config()
