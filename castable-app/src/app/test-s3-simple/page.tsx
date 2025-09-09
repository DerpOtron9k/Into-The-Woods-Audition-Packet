'use client'

import { useState } from 'react'

interface UploadResult {
  success: boolean
  url?: string
  key?: string
  error?: string
  originalName?: string
  size?: number
  type?: string
}

export default function TestS3SimplePage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploadResults, setUploadResults] = useState<UploadResult[]>([])
  const [uploadProgress, setUploadProgress] = useState({
    isUploading: false,
    progress: 0,
    error: null as string | null,
    success: false
  })

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

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
      formData.append('entityId', 'test-entity-123')

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

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1 style={{ textAlign: 'center', marginBottom: '30px' }}>S3 File Upload Test</h1>
      
      {/* File Selection */}
      <div style={{ marginBottom: '20px' }}>
        <label style={{ display: 'block', marginBottom: '10px', fontWeight: 'bold' }}>
          Select File to Upload:
        </label>
        <input
          type="file"
          onChange={handleFileSelect}
          disabled={uploadProgress.isUploading}
          style={{ 
            width: '100%', 
            padding: '10px', 
            border: '1px solid #ccc', 
            borderRadius: '4px',
            fontSize: '16px'
          }}
        />
        
        {selectedFile && (
          <div style={{ 
            marginTop: '10px', 
            padding: '10px', 
            border: '1px solid #ddd', 
            borderRadius: '4px',
            backgroundColor: '#f9f9f9'
          }}>
            <strong>Selected File:</strong> {selectedFile.name}<br/>
            <strong>Size:</strong> {formatFileSize(selectedFile.size)}<br/>
            <strong>Type:</strong> {selectedFile.type}
          </div>
        )}
      </div>

      {/* Upload Buttons */}
      {selectedFile && !uploadProgress.isUploading && !uploadProgress.success && (
        <div style={{ marginBottom: '20px' }}>
          <h3>Choose Upload Category:</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px' }}>
            <button
              onClick={() => handleUpload('headshot')}
              style={{
                padding: '10px',
                border: '1px solid #007bff',
                borderRadius: '4px',
                backgroundColor: '#007bff',
                color: 'white',
                cursor: 'pointer'
              }}
            >
              Upload as Headshot
            </button>
            <button
              onClick={() => handleUpload('resume')}
              style={{
                padding: '10px',
                border: '1px solid #28a745',
                borderRadius: '4px',
                backgroundColor: '#28a745',
                color: 'white',
                cursor: 'pointer'
              }}
            >
              Upload as Resume
            </button>
            <button
              onClick={() => handleUpload('audition')}
              style={{
                padding: '10px',
                border: '1px solid #ffc107',
                borderRadius: '4px',
                backgroundColor: '#ffc107',
                color: 'black',
                cursor: 'pointer'
              }}
            >
              Upload as Audition
            </button>
            <button
              onClick={() => handleUpload('show-material')}
              style={{
                padding: '10px',
                border: '1px solid #6f42c1',
                borderRadius: '4px',
                backgroundColor: '#6f42c1',
                color: 'white',
                cursor: 'pointer'
              }}
            >
              Upload as Show Material
            </button>
          </div>
        </div>
      )}

      {/* Progress and Status */}
      {uploadProgress.error && (
        <div style={{
          padding: '10px',
          backgroundColor: '#f8d7da',
          border: '1px solid #f5c6cb',
          borderRadius: '4px',
          color: '#721c24',
          marginBottom: '20px'
        }}>
          <strong>Error:</strong> {uploadProgress.error}
        </div>
      )}

      {uploadProgress.success && (
        <div style={{
          padding: '10px',
          backgroundColor: '#d4edda',
          border: '1px solid #c3e6cb',
          borderRadius: '4px',
          color: '#155724',
          marginBottom: '20px'
        }}>
          <strong>Success:</strong> File uploaded successfully!
        </div>
      )}

      {uploadProgress.isUploading && (
        <div style={{ marginBottom: '20px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '5px' }}>
            <span>Uploading...</span>
            <span>{uploadProgress.progress}%</span>
          </div>
          <div style={{
            width: '100%',
            height: '20px',
            backgroundColor: '#e9ecef',
            borderRadius: '10px',
            overflow: 'hidden'
          }}>
            <div style={{
              width: `${uploadProgress.progress}%`,
              height: '100%',
              backgroundColor: '#007bff',
              transition: 'width 0.3s ease'
            }}></div>
          </div>
        </div>
      )}

      {/* Upload Results */}
      {uploadResults.length > 0 && (
        <div>
          <h3>Upload Results ({uploadResults.length} files):</h3>
          {uploadResults.map((result, index) => (
            <div key={index} style={{
              marginBottom: '15px',
              padding: '15px',
              border: '1px solid #ddd',
              borderRadius: '4px',
              backgroundColor: result.success ? '#d4edda' : '#f8d7da'
            }}>
              <div style={{ marginBottom: '10px' }}>
                <strong>Status:</strong> {result.success ? '✅ Success' : '❌ Failed'}<br/>
                <strong>File:</strong> {result.originalName}<br/>
                {result.size && <><strong>Size:</strong> {formatFileSize(result.size)}<br/></>}
                {result.type && <><strong>Type:</strong> {result.type}<br/></>}
              </div>
              
              {result.success && result.url && (
                <div>
                  <strong>S3 URL:</strong><br/>
                  <code style={{
                    display: 'block',
                    wordBreak: 'break-all',
                    backgroundColor: '#f8f9fa',
                    padding: '5px',
                    borderRadius: '3px',
                    fontSize: '12px'
                  }}>
                    {result.url}
                  </code>
                  {result.key && (
                    <div style={{ marginTop: '5px', fontSize: '12px', color: '#666' }}>
                      <strong>Key:</strong> {result.key}
                    </div>
                  )}
                </div>
              )}
              
              {result.error && (
                <div style={{ color: '#721c24' }}>
                  <strong>Error:</strong> {result.error}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Configuration Info */}
      <div style={{
        marginTop: '30px',
        padding: '15px',
        backgroundColor: '#f8f9fa',
        border: '1px solid #dee2e6',
        borderRadius: '4px'
      }}>
        <h3>Configuration Status:</h3>
        <ul>
          <li>✅ S3 Bucket: {process.env.NEXT_PUBLIC_S3_BUCKET_NAME || 'Not configured'}</li>
          <li>✅ AWS Region: {process.env.NEXT_PUBLIC_AWS_REGION || 'Not configured'}</li>
          <li>✅ Max File Size: 100MB</li>
          <li>✅ Encryption: AES-256 (SSE-S3)</li>
        </ul>
      </div>
    </div>
  )
}
