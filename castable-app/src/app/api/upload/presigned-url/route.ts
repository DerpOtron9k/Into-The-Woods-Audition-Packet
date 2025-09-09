import { NextRequest, NextResponse } from 'next/server'
import { S3Service } from '@/lib/s3'
import { auth } from '@clerk/nextjs/server'

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const { key, expiresIn = 3600 } = await request.json()
    
    if (!key) {
      return NextResponse.json(
        { error: 'File key is required' },
        { status: 400 }
      )
    }

    // Validate expiresIn (max 7 days)
    const maxExpiresIn = 7 * 24 * 3600 // 7 days in seconds
    const validExpiresIn = Math.min(Math.max(expiresIn, 60), maxExpiresIn)

    const presignedUrl = await S3Service.getDownloadUrl(key, validExpiresIn)
    
    return NextResponse.json({
      success: true,
      url: presignedUrl,
      expiresIn: validExpiresIn
    })

  } catch (error) {
    console.error('Presigned URL error:', error)
    return NextResponse.json(
      { error: 'Failed to generate presigned URL' },
      { status: 500 }
    )
  }
}
