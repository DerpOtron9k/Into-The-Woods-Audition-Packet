'use client'

import { useState, useRef } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Upload, X, File, CheckCircle, AlertCircle } from 'lucide-react'

interface FileUploadProps {
  category: 'headshot' | 'resume' | 'audition' | 'show-material'
  entityId: string
  onUploadComplete?: (result: UploadResult) => void
  onUploadError?: (error: string) => void
  maxSize?: number
  acceptedTypes?: string[]
  className?: string
}

interface UploadResult {
  success: boolean
  url?: string
  key?: string
  error?: string
  originalName?: string
  size?: number
  type?: string
}

interface UploadProgress {
  isUploading: boolean
  progress: number
  error: string | null
  success: boolean
}

export function FileUpload({
  category,
  entityId,
  onUploadComplete,
  onUploadError,
  maxSize = 10 * 1024 * 1024, // 10MB default
  acceptedTypes = ['image/jpeg', 'image/png', 'image/webp', 'application/pdf', 'audio/mpeg', 'audio/wav', 'video/mp4'],
  className = ''
}: FileUploadProps) {
  const [uploadProgress, setUploadProgress] = useState<UploadProgress>({
    isUploading: false,
    progress: 0,
    error: null,
    success: false
  })
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file size
    if (file.size > maxSize) {
      setUploadProgress({
        isUploading: false,
        progress: 0,
        error: `File size exceeds maximum allowed size of ${Math.round(maxSize / 1024 / 1024)}MB`,
        success: false
      })
      return
    }

    // Validate file type
    if (!acceptedTypes.includes(file.type)) {
      setUploadProgress({
        isUploading: false,
        progress: 0,
        error: `File type ${file.type} is not allowed`,
        success: false
      })
      return
    }

    setSelectedFile(file)
    setUploadProgress({
      isUploading: false,
      progress: 0,
      error: null,
      success: false
    })
  }

  const handleUpload = async () => {
    if (!selectedFile) return

    setUploadProgress({
      isUploading: true,
      progress: 0,
      error: null,
      success: false
    })

    try {
      const formData = new FormData()
      formData.append('file', selectedFile)
      formData.append('category', category)
      formData.append('entityId', entityId)

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      })

      const result: UploadResult = await response.json()

      if (result.success) {
        setUploadProgress({
          isUploading: false,
          progress: 100,
          error: null,
          success: true
        })
        onUploadComplete?.(result)
        setSelectedFile(null)
        if (fileInputRef.current) {
          fileInputRef.current.value = ''
        }
      } else {
        setUploadProgress({
          isUploading: false,
          progress: 0,
          error: result.error || 'Upload failed',
          success: false
        })
        onUploadError?.(result.error || 'Upload failed')
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Upload failed'
      setUploadProgress({
        isUploading: false,
        progress: 0,
        error: errorMessage,
        success: false
      })
      onUploadError?.(errorMessage)
    }
  }

  const handleRemoveFile = () => {
    setSelectedFile(null)
    setUploadProgress({
      isUploading: false,
      progress: 0,
      error: null,
      success: false
    })
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div className={`space-y-4 ${className}`}>
      <div className="space-y-2">
        <Label htmlFor="file-upload">
          Upload {category === 'headshot' ? 'Headshot' : 
                  category === 'resume' ? 'Resume' : 
                  category === 'audition' ? 'Audition File' : 
                  'Show Material'}
        </Label>
        <Input
          ref={fileInputRef}
          id="file-upload"
          type="file"
          accept={acceptedTypes.join(',')}
          onChange={handleFileSelect}
          disabled={uploadProgress.isUploading}
          className="cursor-pointer"
        />
        <p className="text-sm text-muted-foreground">
          Max size: {formatFileSize(maxSize)} • Allowed types: {acceptedTypes.join(', ')}
        </p>
      </div>

      {selectedFile && (
        <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/50">
          <div className="flex items-center space-x-2">
            <File className="h-4 w-4" />
            <div>
              <p className="text-sm font-medium">{selectedFile.name}</p>
              <p className="text-xs text-muted-foreground">
                {formatFileSize(selectedFile.size)} • {selectedFile.type}
              </p>
            </div>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRemoveFile}
            disabled={uploadProgress.isUploading}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {uploadProgress.error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{uploadProgress.error}</AlertDescription>
        </Alert>
      )}

      {uploadProgress.success && (
        <Alert>
          <CheckCircle className="h-4 w-4" />
          <AlertDescription>File uploaded successfully!</AlertDescription>
        </Alert>
      )}

      {uploadProgress.isUploading && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span>Uploading...</span>
            <span>{uploadProgress.progress}%</span>
          </div>
          <Progress value={uploadProgress.progress} className="w-full" />
        </div>
      )}

      {selectedFile && !uploadProgress.isUploading && !uploadProgress.success && (
        <Button onClick={handleUpload} className="w-full">
          <Upload className="h-4 w-4 mr-2" />
          Upload File
        </Button>
      )}
    </div>
  )
}
