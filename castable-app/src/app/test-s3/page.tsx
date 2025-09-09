'use client'

import { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Upload, X, File, CheckCircle, AlertCircle } from 'lucide-react'

interface UploadResult {
  success: boolean
  url?: string
  key?: string
  error?: string
  originalName?: string
  size?: number
  type?: string
}

export default function TestS3Page() {
  const [uploadResults, setUploadResults] = useState<UploadResult[]>([])
  const [testEntityId] = useState('test-entity-123')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploadProgress, setUploadProgress] = useState({
    isUploading: false,
    progress: 0,
    error: null as string | null,
    success: false
  })

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Basic validation
    if (file.size > 100 * 1024 * 1024) { // 100MB max
      setUploadProgress({
        isUploading: false,
        progress: 0,
        error: 'File size exceeds 100MB limit',
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

  const handleUpload = async (category: string) => {
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
      formData.append('entityId', testEntityId)

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
        setUploadResults(prev => [result, ...prev])
        setSelectedFile(null)
      } else {
        setUploadProgress({
          isUploading: false,
          progress: 0,
          error: result.error || 'Upload failed',
          success: false
        })
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Upload failed'
      setUploadProgress({
        isUploading: false,
        progress: 0,
        error: errorMessage,
        success: false
      })
    }
  }

  const handleUploadComplete = (result: UploadResult) => {
    setUploadResults(prev => [result, ...prev])
  }

  const handleUploadError = (error: string) => {
    console.error('Upload error:', error)
  }

  const clearResults = () => {
    setUploadResults([])
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">S3 File Upload Test</h1>
        <p className="text-muted-foreground">
          Test file upload functionality for different file categories
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* File Upload Interface */}
        <Card className="col-span-2">
          <CardHeader>
            <CardTitle>S3 File Upload Test</CardTitle>
            <CardDescription>
              Test uploading files to S3 with different categories
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* File Selection */}
            <div className="space-y-2">
              <Label htmlFor="file-upload">Select File</Label>
              <Input
                id="file-upload"
                type="file"
                onChange={handleFileSelect}
                disabled={uploadProgress.isUploading}
                className="cursor-pointer"
              />
              {selectedFile && (
                <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/50">
                  <div className="flex items-center space-x-2">
                    <File className="h-4 w-4" />
                    <div>
                      <p className="text-sm font-medium">{selectedFile.name}</p>
                      <p className="text-xs text-muted-foreground">
                        {(selectedFile.size / 1024 / 1024).toFixed(2)} MB • {selectedFile.type}
                      </p>
                    </div>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => setSelectedFile(null)}
                    disabled={uploadProgress.isUploading}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </div>

            {/* Upload Buttons */}
            {selectedFile && !uploadProgress.isUploading && !uploadProgress.success && (
              <div className="grid grid-cols-2 gap-2">
                <Button onClick={() => handleUpload('headshot')} variant="outline">
                  Upload as Headshot
                </Button>
                <Button onClick={() => handleUpload('resume')} variant="outline">
                  Upload as Resume
                </Button>
                <Button onClick={() => handleUpload('audition')} variant="outline">
                  Upload as Audition
                </Button>
                <Button onClick={() => handleUpload('show-material')} variant="outline">
                  Upload as Show Material
                </Button>
              </div>
            )}

            {/* Progress and Status */}
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
          </CardContent>
        </Card>
      </div>

      {/* Upload Results */}
      {uploadResults.length > 0 && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle>Upload Results</CardTitle>
                <CardDescription>
                  {uploadResults.length} file(s) uploaded
                </CardDescription>
              </div>
              <Button variant="outline" onClick={clearResults}>
                Clear Results
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {uploadResults.map((result, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <Badge variant={result.success ? "default" : "destructive"}>
                        {result.success ? "Success" : "Failed"}
                      </Badge>
                      <span className="font-medium">{result.originalName}</span>
                    </div>
                    {result.size && (
                      <span className="text-sm text-muted-foreground">
                        {(result.size / 1024 / 1024).toFixed(2)} MB
                      </span>
                    )}
                  </div>
                  
                  {result.success && result.url && (
                    <div className="space-y-1">
                      <p className="text-sm text-muted-foreground">URL:</p>
                      <code className="text-xs bg-muted p-2 rounded block break-all">
                        {result.url}
                      </code>
                      {result.key && (
                        <p className="text-xs text-muted-foreground">
                          Key: {result.key}
                        </p>
                      )}
                    </div>
                  )}
                  
                  {result.error && (
                    <p className="text-sm text-destructive">{result.error}</p>
                  )}
                  
                  {index < uploadResults.length - 1 && <Separator />}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Configuration Info */}
      <Card>
        <CardHeader>
          <CardTitle>Configuration</CardTitle>
          <CardDescription>
            Current S3 configuration and limits
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h4 className="font-medium mb-2">File Limits</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>Headshots: 5MB (JPEG, PNG, WebP)</li>
                <li>Resumes: 2MB (PDF)</li>
                <li>Audition Files: 50MB (Audio, Video)</li>
                <li>Show Materials: 100MB (Any type)</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium mb-2">Environment</h4>
              <ul className="space-y-1 text-muted-foreground">
                <li>Entity ID: {testEntityId}</li>
                <li>Bucket: {process.env.NEXT_PUBLIC_S3_BUCKET_NAME || 'Not configured'}</li>
                <li>Region: {process.env.NEXT_PUBLIC_AWS_REGION || 'Not configured'}</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
