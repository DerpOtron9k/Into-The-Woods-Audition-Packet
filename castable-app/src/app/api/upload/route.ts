import { NextRequest, NextResponse } from 'next/server'
import { S3Service, validateFile } from '@/lib/s3'

export async function POST(request: NextRequest) {
  try {
    // For testing purposes, use a test user ID
    // In production, you would check authentication
    const testUserId = 'test-user-123'

    // Parse form data
    const formData = await request.formData()
    const file = formData.get('file') as File
    const category = formData.get('category') as string
    const entityId = formData.get('entityId') as string // showId or applicantId

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      )
    }

    if (!category || !['headshot', 'resume', 'audition', 'show-material'].includes(category)) {
      return NextResponse.json(
        { error: 'Invalid category. Must be: headshot, resume, audition, or show-material' },
        { status: 400 }
      )
    }

    if (!entityId) {
      return NextResponse.json(
        { error: 'Entity ID is required' },
        { status: 400 }
      )
    }

    // Validate file
    const validation = validateFile(file)
    if (!validation.isValid) {
      return NextResponse.json(
        { error: validation.error },
        { status: 400 }
      )
    }

    // Upload file based on category
    let uploadResult
    switch (category) {
      case 'headshot':
        uploadResult = await S3Service.uploadHeadshot(file, entityId, testUserId)
        break
      case 'resume':
        uploadResult = await S3Service.uploadResume(file, entityId, testUserId)
        break
      case 'audition':
        uploadResult = await S3Service.uploadAuditionFile(file, entityId, testUserId)
        break
      case 'show-material':
        uploadResult = await S3Service.uploadShowMaterial(file, entityId, testUserId)
        break
      default:
        return NextResponse.json(
          { error: 'Invalid category' },
          { status: 400 }
        )
    }

    if (!uploadResult.success) {
      return NextResponse.json(
        { error: uploadResult.error || 'Upload failed' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      url: uploadResult.url,
      key: uploadResult.key,
      category,
      entityId,
      originalName: file.name,
      size: file.size,
      type: file.type
    })

  } catch (error) {
    console.error('Upload error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest) {
  try {
    // For testing purposes, skip authentication
    // In production, you would check authentication

    const { key } = await request.json()
    
    if (!key) {
      return NextResponse.json(
        { error: 'File key is required' },
        { status: 400 }
      )
    }

    const deleteResult = await S3Service.deleteFile(key)
    
    if (!deleteResult.success) {
      return NextResponse.json(
        { error: deleteResult.error || 'Delete failed' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'File deleted successfully'
    })

  } catch (error) {
    console.error('Delete error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
