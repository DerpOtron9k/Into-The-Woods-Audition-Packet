import { NextRequest, NextResponse } from 'next/server'

export async function GET() {
  const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>S3 Test - No Auth</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
      margin: 0;
      padding: 0;
      background-color: #f5f5f5;
    }
    * {
      box-sizing: border-box;
    }
    .container {
      max-width: 800px;
      margin: 0 auto;
      font-family: Arial, sans-serif;
      padding: 20px;
    }
    .section {
      margin-bottom: 20px;
      padding: 20px;
      border: 1px solid #ddd;
      border-radius: 8px;
      background: white;
    }
    .file-input {
      width: 100%;
      padding: 10px;
      border: 1px solid #ccc;
      border-radius: 4px;
      font-size: 16px;
      margin-bottom: 10px;
    }
    .file-info {
      padding: 15px;
      border: 1px solid #28a745;
      border-radius: 4px;
      background-color: #d4edda;
      color: #155724;
      margin-top: 10px;
    }
    .upload-buttons {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 15px;
    }
    .upload-btn {
      padding: 15px;
      border: 2px solid;
      border-radius: 8px;
      color: white;
      cursor: pointer;
      font-size: 16px;
      font-weight: bold;
      text-align: center;
    }
    .btn-headshot { background-color: #007bff; border-color: #007bff; }
    .btn-resume { background-color: #28a745; border-color: #28a745; }
    .btn-audition { background-color: #ffc107; border-color: #ffc107; color: black; }
    .btn-show { background-color: #6f42c1; border-color: #6f42c1; }
    .error {
      padding: 15px;
      background-color: #f8d7da;
      border: 2px solid #f5c6cb;
      border-radius: 8px;
      color: #721c24;
      margin-bottom: 20px;
    }
    .success {
      padding: 15px;
      background-color: #d4edda;
      border: 2px solid #c3e6cb;
      border-radius: 8px;
      color: #155724;
      margin-bottom: 20px;
    }
    .uploading {
      margin-bottom: 20px;
      padding: 20px;
      border: 1px solid #ddd;
      border-radius: 8px;
    }
    .progress-bar {
      width: 100%;
      height: 25px;
      background-color: #e9ecef;
      border-radius: 12px;
      overflow: hidden;
      border: 1px solid #ccc;
    }
    .progress-fill {
      height: 100%;
      background-color: #007bff;
      transition: width 0.3s ease;
      border-radius: 12px;
    }
    .config {
      padding: 20px;
      background-color: #f8f9fa;
      border: 1px solid #dee2e6;
      border-radius: 8px;
    }
    .config-grid {
      display: grid;
      grid-template-columns: repeat(2, 1fr);
      gap: 10px;
      font-size: 14px;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1 style="text-align: center; margin-bottom: 30px; color: #333;">
      S3 File Upload Test (No Authentication)
    </h1>

    <!-- File Selection -->
    <div class="section">
      <h2 style="margin-top: 0;">1. Select File</h2>
      <input type="file" id="fileInput" class="file-input" />
      <div id="fileInfo" style="display: none;" class="file-info">
        <strong>✅ Selected File:</strong><br/>
        <strong>Name:</strong> <span id="fileName"></span><br/>
        <strong>Size:</strong> <span id="fileSize"></span><br/>
        <strong>Type:</strong> <span id="fileType"></span>
      </div>
    </div>

    <!-- Upload Buttons -->
    <div id="uploadSection" class="section" style="display: none;">
      <h2 style="margin-top: 0;">2. Choose Upload Category</h2>
      <div class="upload-buttons">
        <button class="upload-btn btn-headshot" onclick="uploadFile('headshot')">
          📸 Headshot<br/>
          <small>(Images)</small>
        </button>
        <button class="upload-btn btn-resume" onclick="uploadFile('resume')">
          📄 Resume<br/>
          <small>(PDFs)</small>
        </button>
        <button class="upload-btn btn-audition" onclick="uploadFile('audition')">
          🎵 Audition<br/>
          <small>(Audio/Video)</small>
        </button>
        <button class="upload-btn btn-show" onclick="uploadFile('show-material')">
          🎭 Show Material<br/>
          <small>(Any Type)</small>
        </button>
      </div>
    </div>

    <!-- Status Messages -->
    <div id="errorMessage" class="error" style="display: none;"></div>
    <div id="successMessage" class="success" style="display: none;"></div>

    <!-- Upload Progress -->
    <div id="uploadProgress" class="uploading" style="display: none;">
      <h3>🔄 Uploading to S3...</h3>
      <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
        <span>Progress</span>
        <span><strong id="progressPercent">0%</strong></span>
      </div>
      <div class="progress-bar">
        <div id="progressFill" class="progress-fill" style="width: 0%;"></div>
      </div>
    </div>

    <!-- Upload Results -->
    <div id="uploadResults" style="display: none;" class="section">
      <h2 style="margin-top: 0;">📋 Upload Results</h2>
      <div id="resultsList"></div>
    </div>

    <!-- Configuration Info -->
    <div class="config">
      <h3 style="margin-top: 0;">⚙️ Configuration Status</h3>
      <div class="config-grid">
        <div>
          <strong>S3 Bucket:</strong> castable-audition-files<br/>
          <strong>AWS Region:</strong> us-east-1<br/>
        </div>
        <div>
          <strong>Max File Size:</strong> 100MB<br/>
          <strong>Encryption:</strong> AES-256 (SSE-S3)<br/>
        </div>
      </div>
    </div>
  </div>

  <script>
    let selectedFile = null;
    let uploadResults = [];

    function formatFileSize(bytes) {
      if (bytes === 0) return '0 Bytes';
      const k = 1024;
      const sizes = ['Bytes', 'KB', 'MB', 'GB'];
      const i = Math.floor(Math.log(bytes) / Math.log(k));
      return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    function showError(message) {
      const errorDiv = document.getElementById('errorMessage');
      errorDiv.textContent = '❌ Error: ' + message;
      errorDiv.style.display = 'block';
      document.getElementById('successMessage').style.display = 'none';
    }

    function showSuccess(message) {
      const successDiv = document.getElementById('successMessage');
      successDiv.textContent = '✅ Success: ' + message;
      successDiv.style.display = 'block';
      document.getElementById('errorMessage').style.display = 'none';
    }

    function hideMessages() {
      document.getElementById('errorMessage').style.display = 'none';
      document.getElementById('successMessage').style.display = 'none';
    }

    function showUploadProgress() {
      document.getElementById('uploadProgress').style.display = 'block';
      document.getElementById('errorMessage').style.display = 'none';
      document.getElementById('successMessage').style.display = 'none';
    }

    function hideUploadProgress() {
      document.getElementById('uploadProgress').style.display = 'none';
    }

    function updateProgress(percent) {
      document.getElementById('progressPercent').textContent = percent + '%';
      document.getElementById('progressFill').style.width = percent + '%';
    }

    function addResult(result) {
      uploadResults.unshift(result);
      updateResultsDisplay();
    }

    function updateResultsDisplay() {
      const resultsDiv = document.getElementById('uploadResults');
      const resultsList = document.getElementById('resultsList');
      
      if (uploadResults.length === 0) {
        resultsDiv.style.display = 'none';
        return;
      }

      resultsDiv.style.display = 'block';
      resultsList.innerHTML = uploadResults.map((result, index) => \`
        <div style="margin-bottom: 20px; padding: 20px; border: 1px solid #ddd; border-radius: 8px; background-color: \${result.success ? '#d4edda' : '#f8d7da'};">
          <h3 style="margin: 0 0 10px 0; color: \${result.success ? '#155724' : '#721c24'};">
            \${result.success ? '✅ Upload Successful' : '❌ Upload Failed'}
          </h3>
          <div style="font-size: 14px; line-height: 1.5;">
            <strong>File:</strong> \${result.originalName}<br/>
            \${result.size ? \`<strong>Size:</strong> \${formatFileSize(result.size)}<br/>\` : ''}
            \${result.type ? \`<strong>Type:</strong> \${result.type}<br/>\` : ''}
          </div>
          \${result.success && result.url ? \`
            <div style="margin-top: 10px;">
              <strong>🔗 S3 URL:</strong><br/>
              <code style="display: block; word-break: break-all; background-color: #f8f9fa; padding: 10px; border-radius: 4px; font-size: 12px; border: 1px solid #dee2e6; margin-top: 5px;">
                \${result.url}
              </code>
              \${result.key ? \`<div style="margin-top: 10px; font-size: 12px; color: #666;"><strong>S3 Key:</strong> \${result.key}</div>\` : ''}
            </div>
          \` : ''}
          \${result.error ? \`<div style="color: #721c24; margin-top: 10px;"><strong>Error Details:</strong> \${result.error}</div>\` : ''}
        </div>
      \`).join('');
    }

    document.getElementById('fileInput').addEventListener('change', function(event) {
      const file = event.target.files[0];
      if (!file) {
        selectedFile = null;
        document.getElementById('fileInfo').style.display = 'none';
        document.getElementById('uploadSection').style.display = 'none';
        return;
      }

      if (file.size > 100 * 1024 * 1024) { // 100MB max
        showError('File size exceeds 100MB limit');
        return;
      }

      selectedFile = file;
      document.getElementById('fileName').textContent = file.name;
      document.getElementById('fileSize').textContent = formatFileSize(file.size);
      document.getElementById('fileType').textContent = file.type;
      document.getElementById('fileInfo').style.display = 'block';
      document.getElementById('uploadSection').style.display = 'block';
      hideMessages();
    });

    async function uploadFile(category) {
      if (!selectedFile) return;

      showUploadProgress();
      updateProgress(0);

      try {
        const formData = new FormData();
        formData.append('file', selectedFile);
        formData.append('category', category);
        formData.append('entityId', 'test-entity-123');

        updateProgress(50);

        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        updateProgress(90);

        const result = await response.json();

        if (result.success) {
          updateProgress(100);
          hideUploadProgress();
          showSuccess('File uploaded successfully to S3!');
          addResult(result);
          selectedFile = null;
          document.getElementById('fileInput').value = '';
          document.getElementById('fileInfo').style.display = 'none';
          document.getElementById('uploadSection').style.display = 'none';
        } else {
          hideUploadProgress();
          showError(result.error || 'Upload failed');
        }
      } catch (error) {
        hideUploadProgress();
        showError(error.message || 'Upload failed');
      }
    }
  </script>
</body>
</html>
  `;

  return new NextResponse(html, {
    headers: {
      'Content-Type': 'text/html',
    },
  })
}

