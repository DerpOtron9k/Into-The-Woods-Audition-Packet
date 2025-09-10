import { test, expect } from '@playwright/test'

test.describe('Show Preview Functionality', () => {
  test('should display preview step in show creation wizard', async ({ page }) => {
    // Navigate to show creation page
    await page.goto('http://localhost:3000/dashboard/shows/create')
    
    // Fill in basic show information
    await page.fill('input[name="title"]', 'Test Show for Preview')
    await page.fill('textarea[name="description"]', 'A test show to verify preview functionality')
    await page.fill('input[name="director"]', 'Test Director')
    await page.fill('input[name="contactEmail"]', 'test@example.com')
    
    // Click Next to proceed to characters step
    await page.click('text=Next')
    
    // Add a character
    await page.click('text=Add Character')
    await page.fill('input[placeholder="Character name"]', 'Test Character')
    await page.fill('textarea[placeholder="Character description"]', 'A test character for preview')
    await page.selectOption('select[name="gender"]', 'Female')
    await page.fill('input[placeholder="Age range"]', '18-25')
    await page.fill('input[placeholder="Vocal range"]', 'Soprano')
    
    // Click Next to proceed to materials step
    await page.click('text=Next')
    
    // Verify we're on materials step and Preview button is available
    await expect(page.locator('text=Audition Materials')).toBeVisible()
    await expect(page.locator('text=Preview')).toBeVisible()
    
    // Click Preview button
    await page.click('text=Preview')
    
    // Verify we're on preview step
    await expect(page.locator('text=Preview Your Show')).toBeVisible()
    await expect(page.locator('text=This is how actors will see your audition page')).toBeVisible()
    
    // Verify preview content shows the show data
    await expect(page.locator('text=Test Show for Preview')).toBeVisible()
    await expect(page.locator('text=A test show to verify preview functionality')).toBeVisible()
    await expect(page.locator('text=Directed by Test Director')).toBeVisible()
    await expect(page.locator('text=Test Character')).toBeVisible()
    
    // Verify preview shows disabled buttons (not functional in preview)
    await expect(page.locator('button:has-text("Apply Now")')).toBeDisabled()
    await expect(page.locator('button:has-text("Ask Director")')).toBeDisabled()
  })

  test('should show preview mode indicator', async ({ page }) => {
    // Navigate to show creation and fill basic info
    await page.goto('http://localhost:3000/dashboard/shows/create')
    await page.fill('input[name="title"]', 'Preview Test Show')
    await page.fill('textarea[name="description"]', 'Testing preview mode')
    await page.fill('input[name="director"]', 'Test Director')
    await page.fill('input[name="contactEmail"]', 'test@example.com')
    
    // Navigate to preview step
    await page.click('text=Next') // Characters step
    await page.click('text=Next') // Materials step
    await page.click('text=Preview') // Preview step
    
    // Verify preview mode indicators
    await expect(page.locator('text=Preview Mode')).toBeVisible()
    await expect(page.locator('text=This is a preview. The actual page will be live after publishing.')).toBeVisible()
  })

  test('should display all show information in preview', async ({ page }) => {
    // Navigate to show creation and fill comprehensive info
    await page.goto('http://localhost:3000/dashboard/shows/create')
    
    // Fill basic information
    await page.fill('input[name="title"]', 'Complete Test Show')
    await page.fill('textarea[name="description"]', 'A comprehensive test show with all details')
    await page.fill('input[name="director"]', 'Jane Director')
    await page.fill('input[name="organization"]', 'Test Theater Company')
    await page.fill('input[name="location"]', '123 Theater St, City, State')
    await page.fill('input[name="contactEmail"]', 'jane@theater.com')
    await page.fill('input[name="contactPhone"]', '(555) 123-4567')
    
    // Set dates
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    const nextWeek = new Date()
    nextWeek.setDate(nextWeek.getDate() + 7)
    
    await page.fill('input[name="auditionDate"]', tomorrow.toISOString().slice(0, 16))
    await page.fill('input[name="deadline"]', nextWeek.toISOString().slice(0, 16))
    
    // Navigate to characters step
    await page.click('text=Next')
    
    // Add multiple characters
    await page.click('text=Add Character')
    await page.fill('input[placeholder="Character name"]', 'Lead Character')
    await page.fill('textarea[placeholder="Character description"]', 'The main character')
    await page.selectOption('select[name="gender"]', 'Female')
    await page.fill('input[placeholder="Age range"]', '25-35')
    await page.fill('input[placeholder="Vocal range"]', 'Mezzo-Soprano')
    await page.fill('textarea[placeholder="Additional notes"]', 'Must be able to dance')
    
    await page.click('text=Add Character')
    await page.fill('input[placeholder="Character name"]', 'Supporting Character')
    await page.fill('textarea[placeholder="Character description"]', 'A supporting role')
    await page.selectOption('select[name="gender"]', 'Male')
    await page.fill('input[placeholder="Age range"]', '30-40')
    await page.fill('input[placeholder="Vocal range"]', 'Baritone')
    
    // Navigate to preview
    await page.click('text=Next') // Materials step
    await page.click('text=Preview') // Preview step
    
    // Verify all information is displayed in preview
    await expect(page.locator('text=Complete Test Show')).toBeVisible()
    await expect(page.locator('text=A comprehensive test show with all details')).toBeVisible()
    await expect(page.locator('text=Directed by Jane Director')).toBeVisible()
    await expect(page.locator('text=Test Theater Company')).toBeVisible()
    await expect(page.locator('text=123 Theater St, City, State')).toBeVisible()
    await expect(page.locator('text=jane@theater.com')).toBeVisible()
    await expect(page.locator('text=(555) 123-4567')).toBeVisible()
    
    // Verify characters are displayed
    await expect(page.locator('text=Lead Character')).toBeVisible()
    await expect(page.locator('text=The main character')).toBeVisible()
    await expect(page.locator('text=Supporting Character')).toBeVisible()
    await expect(page.locator('text=A supporting role')).toBeVisible()
    
    // Verify character count
    await expect(page.locator('text=Characters (2)')).toBeVisible()
  })

  test('should allow navigation from preview back to edit', async ({ page }) => {
    // Navigate to preview step
    await page.goto('http://localhost:3000/dashboard/shows/create')
    await page.fill('input[name="title"]', 'Navigation Test')
    await page.fill('textarea[name="description"]', 'Testing navigation')
    await page.fill('input[name="director"]', 'Test Director')
    await page.fill('input[name="contactEmail"]', 'test@example.com')
    
    await page.click('text=Next') // Characters
    await page.click('text=Next') // Materials
    await page.click('text=Preview') // Preview
    
    // Verify we're on preview step
    await expect(page.locator('text=Preview Your Show')).toBeVisible()
    
    // Click Previous to go back to materials step
    await page.click('text=Previous')
    
    // Verify we're back on materials step
    await expect(page.locator('text=Audition Materials')).toBeVisible()
    await expect(page.locator('text=Preview')).toBeVisible()
  })

  test('should proceed from preview to final review', async ({ page }) => {
    // Navigate to preview step
    await page.goto('http://localhost:3000/dashboard/shows/create')
    await page.fill('input[name="title"]', 'Final Test Show')
    await page.fill('textarea[name="description"]', 'Testing final flow')
    await page.fill('input[name="director"]', 'Test Director')
    await page.fill('input[name="contactEmail"]', 'test@example.com')
    
    await page.click('text=Next') // Characters
    await page.click('text=Next') // Materials
    await page.click('text=Preview') // Preview
    
    // Click Next to proceed to final review
    await page.click('text=Next')
    
    // Verify we're on final review step
    await expect(page.locator('text=Review & Publish')).toBeVisible()
    await expect(page.locator('text=Publish Show')).toBeVisible()
  })
})

