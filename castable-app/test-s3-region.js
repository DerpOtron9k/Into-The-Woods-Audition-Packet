const { S3Client, GetBucketLocationCommand } = require('@aws-sdk/client-s3');
require('dotenv').config();

async function testBucketRegion() {
  const bucketName = process.env.S3_BUCKET_NAME || 'castable-audition-files';
  
  // Try different regions
  const regions = ['us-east-1', 'us-west-2', 'eu-west-1', 'ap-southeast-1'];
  
  for (const region of regions) {
    try {
      console.log(`\nTesting region: ${region}`);
      const s3Client = new S3Client({
        region: region,
        credentials: {
          accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
          secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
        },
      });
      
      const command = new GetBucketLocationCommand({ Bucket: bucketName });
      const result = await s3Client.send(command);
      const actualRegion = result.LocationConstraint || 'us-east-1';
      
      console.log(`✅ Bucket found in region: ${actualRegion}`);
      console.log(`Update your .env file: AWS_REGION=${actualRegion}`);
      break;
      
    } catch (error) {
      console.log(`❌ ${region}: ${error.name} - ${error.message}`);
    }
  }
}

testBucketRegion();

