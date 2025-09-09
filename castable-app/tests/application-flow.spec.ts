import { test, expect } from '@playwright/test'

test.describe('Actor Application Flow', () => {
  test('should complete full application process', async ({ page }) => {
    // Navigate to a public show page
    await page.goto('http://localhost:3000/shows/test-show-123')
    
    // Wait for page to load
    await expect(page.locator('h1')).toContainText('Into the Woods')
    
    // Click Apply Now button
    await page.click('text=Apply Now')
    
    // Should navigate to application form
    await expect(page.url()).toContain('/apply')
    await expect(page.locator('h1')).toContainText('Into the Woods')
    
    // Step 1: Select roles
    await expect(page.locator('text=Select Roles to Audition For')).toBeVisible()
    
    // Select Cinderella role
    await page.click('text=Cinderella')
    await expect(page.locator('text=Selected')).toBeVisible()
    
    // Click Next
    await page.click('text=Next')
    
    // Step 2: Personal Information
    await expect(page.locator('text=Personal Information')).toBeVisible()
    
    // Fill out personal information
    await page.fill('input[name="name"]', 'Test Actor')
    await page.fill('input[name="email"]', 'test@example.com')
    await page.fill('input[name="phone"]', '(555) 123-4567')
    await page.fill('textarea[name="experience"]', 'I have 5 years of theater experience')
    await page.fill('textarea[name="availability"]', 'Available evenings and weekends')
    
    // Click Next
    await page.click('text=Next')
    
    // Step 3: Upload Materials
    await expect(page.locator('text=Upload Materials')).toBeVisible()
    
    // Skip file uploads for now (would need actual files)
    await page.click('text=Next')
    
    // Step 4: Review
    await expect(page.locator('text=Review Your Application')).toBeVisible()
    await expect(page.locator('text=Test Actor')).toBeVisible()
    await expect(page.locator('text=test@example.com')).toBeVisible()
    await expect(page.locator('text=Cinderella')).toBeVisible()
    
    // Submit application
    await page.click('text=Submit Application')
    
    // Should show success page
    await expect(page.locator('text=Application Submitted Successfully')).toBeVisible()
    await expect(page.locator('text=Thank you for your interest')).toBeVisible()
  })

  test('should show deadline passed message when deadline has passed', async ({ page }) => {
    // Navigate to a show with passed deadline
    await page.goto('http://localhost:3000/shows/expired-show')
    
    // Should show deadline passed message
    await expect(page.locator('text=Application Deadline Passed')).toBeVisible()
    await expect(page.locator('text=Contact Director')).toBeVisible()
  })

  test('should be mobile responsive', async ({ page }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    
    // Navigate to application form
    await page.goto('http://localhost:3000/shows/test-show-123/apply')
    
    // Check that form is responsive
    await expect(page.locator('h1')).toBeVisible()
    await expect(page.locator('text=Select Roles to Audition For')).toBeVisible()
    
    // Check that buttons are touch-friendly
    const nextButton = page.locator('text=Next')
    await expect(nextButton).toBeVisible()
    
    // Check that form fields are properly sized
    const nameInput = page.locator('input[name="name"]')
    await expect(nameInput).toBeVisible()
  })

  test('should validate required fields', async ({ page }) => {
    await page.goto('http://localhost:3000/shows/test-show-123/apply')
    
    // Try to proceed without selecting roles
    await page.click('text=Next')
    
    // Should stay on first step
    await expect(page.locator('text=Select Roles to Audition For')).toBeVisible()
    
    // Select a role
    await page.click('text=Cinderella')
    await page.click('text=Next')
    
    // Try to proceed without filling required fields
    await page.click('text=Next')
    
    // Should stay on personal information step
    await expect(page.locator('text=Personal Information')).toBeVisible()
  })
})

test.describe('Public Show Page', () => {
  test('should display show information correctly', async ({ page }) => {
    await page.goto('http://localhost:3000/shows/test-show-123')
    
    // Check show title and description
    await expect(page.locator('h1')).toContainText('Into the Woods')
    await expect(page.locator('text=musical about fairy tale characters')).toBeVisible()
    
    // Check director information
    await expect(page.locator('text=Directed by Jane Smith')).toBeVisible()
    
    // Check characters section
    await expect(page.locator('text=Characters (2)')).toBeVisible()
    await expect(page.locator('text=Cinderella')).toBeVisible()
    await expect(page.locator('text=The Baker')).toBeVisible()
    
    // Check audition materials
    await expect(page.locator('text=Audition Materials')).toBeVisible()
    await expect(page.locator('text=audition-sides.pdf')).toBeVisible()
    
    // Check Apply Now button
    await expect(page.locator('text=Apply Now')).toBeVisible()
  })

  test('should be mobile responsive', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 667 })
    await page.goto('http://localhost:3000/shows/test-show-123')
    
    // Check that content is properly displayed on mobile
    await expect(page.locator('h1')).toBeVisible()
    await expect(page.locator('text=Apply Now')).toBeVisible()
    
    // Check that cards stack properly
    const cards = page.locator('[class*="card"]')
    await expect(cards.first()).toBeVisible()
  })
})
