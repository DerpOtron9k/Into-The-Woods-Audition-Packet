const { S3Client, ListBucketsCommand, HeadBucketCommand } = require('@aws-sdk/client-s3');
require('dotenv').config();

const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
});

async function testS3Bucket() {
  try {
    console.log('Testing S3 connection...');
    console.log('Region:', process.env.AWS_REGION || 'us-east-1');
    console.log('Bucket:', process.env.S3_BUCKET_NAME || 'castable-audition-files');
    
    // Test 1: List all buckets
    console.log('\n1. Listing all buckets...');
    const listCommand = new ListBucketsCommand({});
    const listResult = await s3Client.send(listCommand);
    console.log('Available buckets:', listResult.Buckets.map(b => b.Name));
    
    // Test 2: Check if our specific bucket exists
    console.log('\n2. Checking if bucket exists...');
    const bucketName = process.env.S3_BUCKET_NAME || 'castable-audition-files';
    const headCommand = new HeadBucketCommand({ Bucket: bucketName });
    await s3Client.send(headCommand);
    console.log(`✅ Bucket "${bucketName}" exists and is accessible`);
    
  } catch (error) {
    console.error('❌ S3 Error:', error.message);
    if (error.name === 'NoSuchBucket') {
      console.log('The bucket does not exist. Please create it first.');
    } else if (error.name === 'Forbidden') {
      console.log('Access denied. Check your AWS credentials and permissions.');
    } else if (error.name === 'InvalidBucketName') {
      console.log('Invalid bucket name. Bucket names must be globally unique.');
    }
  }
}

testS3Bucket();

