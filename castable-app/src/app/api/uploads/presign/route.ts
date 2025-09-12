import { NextRequest, NextResponse } from 'next/server'
import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import crypto from 'node:crypto'

export const runtime = 'nodejs'

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

    const bucket = process.env.S3_BUCKET || process.env.AWS_S3_BUCKET || process.env.S3_BUCKET_NAME
    const region = process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION
    const accessKeyId = process.env.AWS_ACCESS_KEY_ID
    const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY

    if (!bucket || !region) {
      const missing: string[] = []
      if (!bucket) missing.push('S3_BUCKET')
      if (!region) missing.push('AWS_REGION')
      return NextResponse.json({ error: 'S3 not configured', missing }, { status: 500 })
    }

    if (!accessKeyId || !secretAccessKey)
      return NextResponse.json({ error: 'AWS credentials not configured' }, { status: 500 })

    if (!fileName || !contentType)
      return NextResponse.json({ error: 'Missing fileName or contentType' }, { status: 400 })

    if (!isAllowedContentType(contentType))
      return NextResponse.json({ error: 'Unsupported content type' }, { status: 400 })

    const s3 = new S3Client({ region, credentials: { accessKeyId, secretAccessKey } })

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
    const message = error instanceof Error ? error.message : 'Failed to create presigned URL'
    return NextResponse.json({ error: message }, { status: 500 })
  }
}


