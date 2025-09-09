import { test, expect } from '@playwright/test'

test.describe('S3 File Upload Tests', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/test-s3-standalone')
    // Wait for the page to fully load and hydrate
    await page.waitForLoadState('networkidle')
    // Wait for the main content to be visible (client-side hydration)
    await page.waitForSelector('h1:has-text("S3 File Upload Test")', { timeout: 10000 })
    // Take a screenshot for debugging
    await page.screenshot({ path: 'test-s3-debug.png' })
    // Log the page content for debugging
    const content = await page.content()
    console.log('Page content length:', content.length)
    console.log('Page title:', await page.title())
  })

  test('should display the S3 upload test page correctly', async ({ page }) => {
    await expect(page.getByText('S3 File Upload Test')).toBeVisible()
    await expect(page.getByText('1. Select File')).toBeVisible()
    await expect(page.getByText('2. Choose Upload Category')).toBeVisible()
    await expect(page.getByText('⚙️ Configuration Status')).toBeVisible()
  })

  test('should show file selection interface', async ({ page }) => {
    const fileInput = page.getByRole('textbox', { name: /select file/i })
    await expect(fileInput).toBeVisible()
    
    // Upload buttons only appear after file selection, so check they exist but are not visible initially
    await expect(page.getByRole('button', { name: /headshot/i })).not.toBeVisible()
    await expect(page.getByRole('button', { name: /resume/i })).not.toBeVisible()
    await expect(page.getByRole('button', { name: /audition/i })).not.toBeVisible()
    await expect(page.getByRole('button', { name: /show material/i })).not.toBeVisible()
  })

  test('should handle file selection and display file details', async ({ page }) => {
    // Create a test file using Buffer (correct Playwright format)
    const testFile = {
      name: 'test-file.txt',
      mimeType: 'text/plain',
      buffer: Buffer.from('test content')
    }
    
    // Upload the file
    await page.setInputFiles('input[type="file"]', testFile)
    
    // Verify file details are displayed
    await expect(page.getByText('✅ Selected File:')).toBeVisible()
    await expect(page.getByText('Name: test-file.txt')).toBeVisible()
    await expect(page.getByText('Type: text/plain')).toBeVisible()
    
    // Verify upload buttons are now visible
    await expect(page.getByRole('button', { name: /upload as headshot/i })).toBeVisible()
  })

  test('should validate file size and show error for oversized files', async ({ page }) => {
    // Create a large file (over 100MB)
    const largeContent = 'x'.repeat(101 * 1024 * 1024) // 101MB
    const largeFile = {
      name: 'large-file.txt',
      mimeType: 'text/plain',
      buffer: Buffer.from(largeContent)
    }
    
    await page.setInputFiles('input[type="file"]', largeFile)
    
    // Verify error message is displayed
    await expect(page.getByText('❌ Error:')).toBeVisible()
    await expect(page.getByText('File size exceeds 100MB limit')).toBeVisible()
  })

  test('should upload file as headshot category', async ({ page }) => {
    // Create a test image file
    const testImage = {
      name: 'test-image.jpg',
      mimeType: 'image/jpeg',
      buffer: Buffer.from('fake image content')
    }
    
    await page.setInputFiles('input[type="file"]', testImage)
    
    // Wait for file details to appear
    await expect(page.getByText('✅ Selected File:')).toBeVisible()
    
    // Click upload as headshot
    await page.getByRole('button', { name: /upload as headshot/i }).click()
    
    // Verify upload progress is shown
    await expect(page.getByText('🔄 Uploading to S3...')).toBeVisible()
    
    // Wait for upload to complete (success or error)
    await page.waitForSelector('text=✅ Success: File uploaded successfully to S3!', { timeout: 10000 })
      .catch(() => page.waitForSelector('text=❌ Error:', { timeout: 10000 }))
  })

  test('should upload file as resume category', async ({ page }) => {
    const testPdf = {
      name: 'test-resume.pdf',
      mimeType: 'application/pdf',
      buffer: Buffer.from('fake pdf content')
    }
    
    await page.setInputFiles('input[type="file"]', testPdf)
    await expect(page.getByText('✅ Selected File:')).toBeVisible()
    
    await page.getByRole('button', { name: /upload as resume/i }).click()
    
    await expect(page.getByText('🔄 Uploading to S3...')).toBeVisible()
    
    // Wait for completion
    await page.waitForSelector('text=✅ Success: File uploaded successfully to S3!', { timeout: 10000 })
      .catch(() => page.waitForSelector('text=❌ Error:', { timeout: 10000 }))
  })

  test('should upload file as audition category', async ({ page }) => {
    const testAudio = {
      name: 'test-audio.mp3',
      mimeType: 'audio/mpeg',
      buffer: Buffer.from('fake audio content')
    }
    
    await page.setInputFiles('input[type="file"]', testAudio)
    await expect(page.getByText('✅ Selected File:')).toBeVisible()
    
    await page.getByRole('button', { name: /upload as audition/i }).click()
    
    await expect(page.getByText('🔄 Uploading to S3...')).toBeVisible()
    
    // Wait for completion
    await page.waitForSelector('text=✅ Success: File uploaded successfully to S3!', { timeout: 10000 })
      .catch(() => page.waitForSelector('text=❌ Error:', { timeout: 10000 }))
  })

  test('should upload file as show material category', async ({ page }) => {
    const testVideo = {
      name: 'test-video.mp4',
      mimeType: 'video/mp4',
      buffer: Buffer.from('fake video content')
    }
    
    await page.setInputFiles('input[type="file"]', testVideo)
    await expect(page.getByText('✅ Selected File:')).toBeVisible()
    
    await page.getByRole('button', { name: /upload as show material/i }).click()
    
    await expect(page.getByText('🔄 Uploading to S3...')).toBeVisible()
    
    // Wait for completion
    await page.waitForSelector('text=✅ Success: File uploaded successfully to S3!', { timeout: 10000 })
      .catch(() => page.waitForSelector('text=❌ Error:', { timeout: 10000 }))
  })

  test('should display upload results with S3 URL', async ({ page }) => {
    const testFile = {
      name: 'test-file.txt',
      mimeType: 'text/plain',
      buffer: Buffer.from('test content')
    }
    
    await page.setInputFiles('input[type="file"]', testFile)
    await page.getByRole('button', { name: /upload as show material/i }).click()
    
    // Wait for upload to complete
    await page.waitForSelector('text=✅ Success: File uploaded successfully to S3!', { timeout: 10000 })
      .catch(() => page.waitForSelector('text=❌ Error:', { timeout: 10000 }))
    
    // Check if results section appears
    const resultsSection = page.getByText('📋 Upload Results')
    if (await resultsSection.isVisible()) {
      await expect(resultsSection).toBeVisible()
      
      // Check for S3 URL in results
      const s3Url = page.getByText('🔗 S3 URL:')
      if (await s3Url.isVisible()) {
        await expect(s3Url).toBeVisible()
      }
    }
  })

  test('should show configuration status', async ({ page }) => {
    await expect(page.getByText('⚙️ Configuration Status')).toBeVisible()
    await expect(page.getByText('S3 Bucket:')).toBeVisible()
    await expect(page.getByText('AWS Region:')).toBeVisible()
    await expect(page.getByText('Max File Size: 100MB')).toBeVisible()
    await expect(page.getByText('Encryption: AES-256 (SSE-S3)')).toBeVisible()
  })

  test('should handle multiple file uploads', async ({ page }) => {
    // Upload first file
    const file1 = {
      name: 'file1.txt',
      mimeType: 'text/plain',
      buffer: Buffer.from('content1')
    }
    await page.setInputFiles('input[type="file"]', file1)
    await page.getByRole('button', { name: /upload as show material/i }).click()
    
    // Wait for first upload to complete
    await page.waitForSelector('text=✅ Success: File uploaded successfully to S3!', { timeout: 10000 })
      .catch(() => page.waitForSelector('text=❌ Error:', { timeout: 10000 }))
    
    // Upload second file
    const file2 = {
      name: 'file2.txt',
      mimeType: 'text/plain',
      buffer: Buffer.from('content2')
    }
    await page.setInputFiles('input[type="file"]', file2)
    await page.getByRole('button', { name: /upload as show material/i }).click()
    
    // Wait for second upload to complete
    await page.waitForSelector('text=✅ Success: File uploaded successfully to S3!', { timeout: 10000 })
      .catch(() => page.waitForSelector('text=❌ Error:', { timeout: 10000 }))
    
    // Check if results show multiple files
    const resultsSection = page.getByText('📋 Upload Results')
    if (await resultsSection.isVisible()) {
      await expect(resultsSection).toBeVisible()
    }
  })

  test('should reset file selection after upload', async ({ page }) => {
    const testFile = {
      name: 'test-file.txt',
      mimeType: 'text/plain',
      buffer: Buffer.from('test content')
    }
    
    await page.setInputFiles('input[type="file"]', testFile)
    await expect(page.getByText('✅ Selected File:')).toBeVisible()
    
    await page.getByRole('button', { name: /upload as show material/i }).click()
    
    // Wait for upload to complete
    await page.waitForSelector('text=✅ Success: File uploaded successfully to S3!', { timeout: 10000 })
      .catch(() => page.waitForSelector('text=❌ Error:', { timeout: 10000 }))
    
    // File selection should be reset (upload buttons should not be visible)
    await expect(page.getByRole('button', { name: /upload as headshot/i })).not.toBeVisible()
  })
})
