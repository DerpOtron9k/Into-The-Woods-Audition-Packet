require('dotenv').config()
const { S3Client, ListBucketsCommand } = require('@aws-sdk/client-s3')

async function testS3Connection() {
  console.log('🔍 Testing S3 Connection...\n')
  
  try {
    // Create S3 client
    const s3Client = new S3Client({
      region: process.env.AWS_REGION || 'us-east-1',
      credentials: {
        accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
        secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
      },
    })
    
    console.log('📡 Testing AWS credentials...')
    
    // Test basic S3 access
    const command = new ListBucketsCommand({})
    const response = await s3Client.send(command)
    
    console.log('✅ AWS credentials are valid!')
    console.log(`✅ Connected to AWS region: ${process.env.AWS_REGION}`)
    console.log(`✅ Found ${response.Buckets.length} bucket(s)`)
    
    // Check if our target bucket exists
    const bucketName = process.env.S3_BUCKET_NAME
    const targetBucket = response.Buckets.find(bucket => bucket.Name === bucketName)
    
    if (targetBucket) {
      console.log(`✅ Target bucket "${bucketName}" found!`)
      console.log(`✅ Bucket created: ${targetBucket.CreationDate}`)
    } else {
      console.log(`❌ Target bucket "${bucketName}" not found`)
      console.log('📋 Available buckets:')
      response.Buckets.forEach(bucket => {
        console.log(`  - ${bucket.Name}`)
      })
    }
    
    console.log('\n🎉 S3 connection test successful!')
    console.log('✅ Ready for file uploads')
    
  } catch (error) {
    console.log('❌ S3 connection failed:')
    console.log(`Error: ${error.message}`)
    
    if (error.name === 'InvalidAccessKeyId') {
      console.log('\n🔧 Troubleshooting:')
      console.log('1. Check AWS_ACCESS_KEY_ID in .env')
      console.log('2. Make sure the key is correct')
      console.log('3. Verify the key has S3 permissions')
    } else if (error.name === 'SignatureDoesNotMatch') {
      console.log('\n🔧 Troubleshooting:')
      console.log('1. Check AWS_SECRET_ACCESS_KEY in .env')
      console.log('2. Make sure the secret key is correct')
      console.log('3. No extra spaces or characters')
    } else {
      console.log('\n🔧 Troubleshooting:')
      console.log('1. Check AWS credentials in .env')
      console.log('2. Verify AWS region is correct')
      console.log('3. Check internet connection')
    }
  }
}

testS3Connection()
