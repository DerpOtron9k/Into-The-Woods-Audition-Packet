import { S3Client, PutObjectCommand, DeleteObjectCommand, GetObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'

// S3 Client configuration
const s3Client = new S3Client({
  region: process.env.AWS_REGION || 'us-east-1',
  credentials: {
    accessKeyId: process.env.AWS_ACCESS_KEY_ID || '',
    secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || '',
  },
})

const BUCKET_NAME = process.env.S3_BUCKET_NAME || 'castable-audition-files'
const BUCKET_URL = process.env.S3_BUCKET_URL || `https://${BUCKET_NAME}.s3.amazonaws.com`

// File type validation
export const ALLOWED_FILE_TYPES = [
  'image/jpeg',
  'image/png', 
  'image/webp',
  'application/pdf',
  'audio/mpeg',
  'audio/wav',
  'video/mp4'
] as const

export const MAX_FILE_SIZE = parseInt(process.env.MAX_FILE_SIZE || '104857600') // 100MB

// File type categories
export type FileCategory = 'headshot' | 'resume' | 'audition' | 'show-material'

export interface UploadResult {
  success: boolean
  url?: string
  key?: string
  error?: string
}

export interface FileValidation {
  isValid: boolean
  error?: string
}

/**
 * Validate file before upload
 */
export function validateFile(file: File): FileValidation {
  // Check file size
  if (file.size > MAX_FILE_SIZE) {
    return {
      isValid: false,
      error: `File size exceeds maximum allowed size of ${MAX_FILE_SIZE / 1024 / 1024}MB`
    }
  }

  // Check file type
  if (!ALLOWED_FILE_TYPES.includes(file.type as any)) {
    return {
      isValid: false,
      error: `File type ${file.type} is not allowed. Allowed types: ${ALLOWED_FILE_TYPES.join(', ')}`
    }
  }

  return { isValid: true }
}

/**
 * Generate a unique file key for S3 storage
 */
export function generateFileKey(category: FileCategory, userId: string, originalName: string): string {
  const timestamp = Date.now()
  const extension = originalName.split('.').pop()
  const sanitizedName = originalName.replace(/[^a-zA-Z0-9.-]/g, '_')
  
  return `${category}/${userId}/${timestamp}-${sanitizedName}`
}

/**
 * Upload file to S3
 */
export async function uploadFileToS3(
  file: File,
  category: FileCategory,
  userId: string
): Promise<UploadResult> {
  try {
    // Validate file
    const validation = validateFile(file)
    if (!validation.isValid) {
      return {
        success: false,
        error: validation.error
      }
    }

    // Generate unique key
    const key = generateFileKey(category, userId, file.name)
    
    // Convert file to buffer
    const buffer = Buffer.from(await file.arrayBuffer())
    
    // Upload to S3 with encryption
    const command = new PutObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key,
      Body: buffer,
      ContentType: file.type,
      ServerSideEncryption: 'AES256', // SSE-S3 encryption
      Metadata: {
        originalName: file.name,
        uploadedBy: userId,
        category: category,
        uploadedAt: new Date().toISOString()
      }
    })

    await s3Client.send(command)
    
    const url = `${BUCKET_URL}/${key}`
    
    return {
      success: true,
      url,
      key
    }
  } catch (error) {
    console.error('S3 upload error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Upload failed'
    }
  }
}

/**
 * Delete file from S3
 */
export async function deleteFileFromS3(key: string): Promise<UploadResult> {
  try {
    const command = new DeleteObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key
    })

    await s3Client.send(command)
    
    return {
      success: true
    }
  } catch (error) {
    console.error('S3 delete error:', error)
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Delete failed'
    }
  }
}

/**
 * Generate presigned URL for secure file access
 */
export async function generatePresignedUrl(key: string, expiresIn: number = 3600): Promise<string> {
  try {
    const command = new GetObjectCommand({
      Bucket: BUCKET_NAME,
      Key: key
    })

    const url = await getSignedUrl(s3Client, command, { expiresIn })
    return url
  } catch (error) {
    console.error('Presigned URL generation error:', error)
    throw new Error('Failed to generate presigned URL')
  }
}

/**
 * Extract file key from S3 URL
 */
export function extractKeyFromUrl(url: string): string | null {
  try {
    const urlObj = new URL(url)
    return urlObj.pathname.substring(1) // Remove leading slash
  } catch {
    return null
  }
}

/**
 * Get file category from key
 */
export function getCategoryFromKey(key: string): FileCategory | null {
  const parts = key.split('/')
  if (parts.length >= 1) {
    const category = parts[0] as FileCategory
    if (['headshot', 'resume', 'audition', 'show-material'].includes(category)) {
      return category
    }
  }
  return null
}

/**
 * S3 Service class for database operations
 */
export class S3Service {
  /**
   * Upload headshot for applicant
   */
  static async uploadHeadshot(file: File, applicantId: string, userId: string): Promise<UploadResult> {
    return uploadFileToS3(file, 'headshot', userId)
  }

  /**
   * Upload resume for applicant
   */
  static async uploadResume(file: File, applicantId: string, userId: string): Promise<UploadResult> {
    return uploadFileToS3(file, 'resume', userId)
  }

  /**
   * Upload audition file for applicant
   */
  static async uploadAuditionFile(file: File, applicantId: string, userId: string): Promise<UploadResult> {
    return uploadFileToS3(file, 'audition', userId)
  }

  /**
   * Upload show material (audio, video, PDFs)
   */
  static async uploadShowMaterial(file: File, showId: string, userId: string): Promise<UploadResult> {
    return uploadFileToS3(file, 'show-material', userId)
  }

  /**
   * Delete file and update database
   */
  static async deleteFile(key: string): Promise<UploadResult> {
    return deleteFileFromS3(key)
  }

  /**
   * Get secure download URL
   */
  static async getDownloadUrl(key: string, expiresIn: number = 3600): Promise<string> {
    return generatePresignedUrl(key, expiresIn)
  }
}
