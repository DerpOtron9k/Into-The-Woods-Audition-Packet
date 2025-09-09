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

export default function TestS3StandalonePage() {
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
    <div style={{ maxWidth: '800px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
      {/* File Selection */}
      <div style={{ marginBottom: '20px', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
        <h2 style={{ marginTop: 0 }}>1. Select File</h2>
        <input
          type="file"
          onChange={handleFileSelect}
          disabled={uploadProgress.isUploading}
          style={{ 
            width: '100%', 
            padding: '10px', 
            border: '1px solid #ccc', 
            borderRadius: '4px',
            fontSize: '16px',
            marginBottom: '10px'
          }}
        />
        
        {selectedFile && (
          <div style={{ 
            padding: '15px', 
            border: '1px solid #28a745', 
            borderRadius: '4px',
            backgroundColor: '#d4edda',
            color: '#155724'
          }}>
            <strong>✅ Selected File:</strong><br/>
            <strong>Name:</strong> {selectedFile.name}<br/>
            <strong>Size:</strong> {formatFileSize(selectedFile.size)}<br/>
            <strong>Type:</strong> {selectedFile.type}
          </div>
        )}
      </div>

      {/* Upload Buttons */}
      {selectedFile && !uploadProgress.isUploading && !uploadProgress.success && (
        <div style={{ marginBottom: '20px', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
          <h2 style={{ marginTop: 0 }}>2. Choose Upload Category</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '15px' }}>
            <button
              onClick={() => handleUpload('headshot')}
              style={{
                padding: '15px',
                border: '2px solid #007bff',
                borderRadius: '8px',
                backgroundColor: '#007bff',
                color: 'white',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: 'bold'
              }}
            >
              📸 Headshot<br/>
              <small>(Images)</small>
            </button>
            <button
              onClick={() => handleUpload('resume')}
              style={{
                padding: '15px',
                border: '2px solid #28a745',
                borderRadius: '8px',
                backgroundColor: '#28a745',
                color: 'white',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: 'bold'
              }}
            >
              📄 Resume<br/>
              <small>(PDFs)</small>
            </button>
            <button
              onClick={() => handleUpload('audition')}
              style={{
                padding: '15px',
                border: '2px solid #ffc107',
                borderRadius: '8px',
                backgroundColor: '#ffc107',
                color: 'black',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: 'bold'
              }}
            >
              🎵 Audition<br/>
              <small>(Audio/Video)</small>
            </button>
            <button
              onClick={() => handleUpload('show-material')}
              style={{
                padding: '15px',
                border: '2px solid #6f42c1',
                borderRadius: '8px',
                backgroundColor: '#6f42c1',
                color: 'white',
                cursor: 'pointer',
                fontSize: '16px',
                fontWeight: 'bold'
              }}
            >
              🎭 Show Material<br/>
              <small>(Any Type)</small>
            </button>
          </div>
        </div>
      )}

      {/* Progress and Status */}
      {uploadProgress.error && (
        <div style={{
          padding: '15px',
          backgroundColor: '#f8d7da',
          border: '2px solid #f5c6cb',
          borderRadius: '8px',
          color: '#721c24',
          marginBottom: '20px'
        }}>
          <strong>❌ Error:</strong> {uploadProgress.error}
        </div>
      )}

      {uploadProgress.success && (
        <div style={{
          padding: '15px',
          backgroundColor: '#d4edda',
          border: '2px solid #c3e6cb',
          borderRadius: '8px',
          color: '#155724',
          marginBottom: '20px'
        }}>
          <strong>✅ Success:</strong> File uploaded successfully to S3!
        </div>
      )}

      {uploadProgress.isUploading && (
        <div style={{ marginBottom: '20px', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
          <h3>🔄 Uploading to S3...</h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '10px' }}>
            <span>Progress</span>
            <span><strong>{uploadProgress.progress}%</strong></span>
          </div>
          <div style={{
            width: '100%',
            height: '25px',
            backgroundColor: '#e9ecef',
            borderRadius: '12px',
            overflow: 'hidden',
            border: '1px solid #ccc'
          }}>
            <div style={{
              width: `${uploadProgress.progress}%`,
              height: '100%',
              backgroundColor: '#007bff',
              transition: 'width 0.3s ease',
              borderRadius: '12px'
            }}></div>
          </div>
        </div>
      )}

      {/* Upload Results */}
      {uploadResults.length > 0 && (
        <div style={{ marginBottom: '20px', padding: '20px', border: '1px solid #ddd', borderRadius: '8px' }}>
          <h2 style={{ marginTop: 0 }}>📋 Upload Results ({uploadResults.length} files)</h2>
          {uploadResults.map((result, index) => (
            <div key={index} style={{
              marginBottom: '20px',
              padding: '20px',
              border: '1px solid #ddd',
              borderRadius: '8px',
              backgroundColor: result.success ? '#d4edda' : '#f8d7da'
            }}>
              <div style={{ marginBottom: '15px' }}>
                <h3 style={{ margin: '0 0 10px 0', color: result.success ? '#155724' : '#721c24' }}>
                  {result.success ? '✅ Upload Successful' : '❌ Upload Failed'}
                </h3>
                <div style={{ fontSize: '14px', lineHeight: '1.5' }}>
                  <strong>File:</strong> {result.originalName}<br/>
                  {result.size && <><strong>Size:</strong> {formatFileSize(result.size)}<br/></>}
                  {result.type && <><strong>Type:</strong> {result.type}<br/></>}
                </div>
              </div>
              
              {result.success && result.url && (
                <div>
                  <strong>🔗 S3 URL:</strong><br/>
                  <code style={{
                    display: 'block',
                    wordBreak: 'break-all',
                    backgroundColor: '#f8f9fa',
                    padding: '10px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    border: '1px solid #dee2e6',
                    marginTop: '5px'
                  }}>
                    {result.url}
                  </code>
                  {result.key && (
                    <div style={{ marginTop: '10px', fontSize: '12px', color: '#666' }}>
                      <strong>S3 Key:</strong> {result.key}
                    </div>
                  )}
                </div>
              )}
              
              {result.error && (
                <div style={{ color: '#721c24', marginTop: '10px' }}>
                  <strong>Error Details:</strong> {result.error}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Configuration Info */}
      <div style={{
        padding: '20px',
        backgroundColor: '#f8f9fa',
        border: '1px solid #dee2e6',
        borderRadius: '8px'
      }}>
        <h3 style={{ marginTop: 0 }}>⚙️ Configuration Status</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', fontSize: '14px' }}>
          <div>
            <strong>S3 Bucket:</strong> Not configured<br/>
            <strong>AWS Region:</strong> Not configured<br/>
          </div>
          <div>
            <strong>Max File Size:</strong> 100MB<br/>
            <strong>Encryption:</strong> AES-256 (SSE-S3)<br/>
          </div>
        </div>
      </div>
    </div>
  )
}
