import { NextRequest, NextResponse } from 'next/server'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import crypto from 'node:crypto'

function isAllowedContentType(contentType: string): boolean {
  if (!contentType) return false
  if (contentType.startsWith('image/')) return true
  if (contentType === 'application/pdf') return true
  if (contentType === 'application/msword') return true
  if (contentType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') return true
  if (contentType.startsWith('video/')) return true
  return false
}

function sanitizeFileName(name: string): string {
  if (!name) return 'file'
  return name.replace(/[^a-zA-Z0-9._-]/g, '_')
}

export async function POST(request: NextRequest) {
  try {
    const { fileName, contentType, folder } = await request.json()

    const bucket = process.env.S3_BUCKET
    const region = process.env.AWS_REGION

    if (!bucket || !region)
      return NextResponse.json({ error: 'S3 not configured' }, { status: 500 })

    if (!fileName || !contentType)
      return NextResponse.json({ error: 'Missing fileName or contentType' }, { status: 400 })

    if (!isAllowedContentType(contentType))
      return NextResponse.json({ error: 'Unsupported content type' }, { status: 400 })

    const s3 = new S3Client({ region })

    const safeName = sanitizeFileName(fileName)
    const uniqueId = crypto.randomUUID()
    const prefix = folder && typeof folder === 'string' ? folder.replace(/[^a-zA-Z0-9/_-]/g, '_') : 'uploads'
    const key = `${prefix}/${uniqueId}-${safeName}`

    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      ContentType: contentType,
    })

    const uploadUrl = await getSignedUrl(s3, command, { expiresIn: 60 * 5 })
    const fileUrl = `https://${bucket}.s3.${region}.amazonaws.com/${key}`

    return NextResponse.json({ uploadUrl, fileUrl, key })
  } catch (error) {
    console.error('Presign error:', error)
    return NextResponse.json({ error: 'Failed to create presigned URL' }, { status: 500 })
  }
}


