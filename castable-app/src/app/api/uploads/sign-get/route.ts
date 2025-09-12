import { NextRequest, NextResponse } from 'next/server'
import { S3Client, GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

export const runtime = 'nodejs'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const rawUrl = searchParams.get('url')
    if (!rawUrl) return NextResponse.json({ error: 'Missing url' }, { status: 400 })

    const bucket = process.env.S3_BUCKET || process.env.AWS_S3_BUCKET || process.env.S3_BUCKET_NAME
    const region = process.env.AWS_REGION || process.env.AWS_DEFAULT_REGION
    const accessKeyId = process.env.AWS_ACCESS_KEY_ID
    const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY

    if (!bucket || !region || !accessKeyId || !secretAccessKey) {
      return NextResponse.json({ error: 'S3 not configured' }, { status: 500 })
    }

    // Extract the object key from the full URL
    const u = new URL(rawUrl)
    const key = u.pathname.startsWith('/') ? u.pathname.slice(1) : u.pathname

    const s3 = new S3Client({ region, credentials: { accessKeyId, secretAccessKey } })
    const command = new GetObjectCommand({ Bucket: bucket, Key: key })
    const signed = await getSignedUrl(s3, command, { expiresIn: 60 * 5 })
    return NextResponse.redirect(signed, 302)
  } catch (error) {
    console.error('sign-get error:', error)
    return NextResponse.json({ error: 'Failed to sign get URL' }, { status: 500 })
  }
}



