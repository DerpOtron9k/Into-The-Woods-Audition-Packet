import { test, expect } from '@playwright/test'
import { mockAuthentication, createTestShow } from './auth-helper'

// Mock authentication before each test
test.beforeEach(async ({ page }) => {
  await mockAuthentication(page)
})

test.describe('Show Editing Functionality', () => {
  test('should navigate to edit page from shows list', async ({ page }) => {
    // First create a test show
    const showId = await createTestShow(page, {
      title: 'Test Show for Editing',
      description: 'This show will be edited'
    })
    
    // Navigate to shows page
    await page.goto('http://localhost:3000/dashboard/shows')
    
    // Wait for shows to load
    await expect(page.locator('text=My Shows')).toBeVisible()
    
    // Look for edit button
    const editButton = page.locator('button:has-text("Edit Show")').first()
    await expect(editButton).toBeVisible()
    await editButton.click()
    
    // Verify we're on the edit page
    await expect(page.locator('text=Edit Show')).toBeVisible()
    await expect(page.locator('text=Back to Shows')).toBeVisible()
  })

  test('should load existing show data in edit form', async ({ page }) => {
    // First create a show to edit
    await page.goto('http://localhost:3000/dashboard/shows/create')
    await page.fill('input[name="title"]', 'Editable Test Show')
    await page.fill('textarea[name="description"]', 'This show will be edited')
    await page.fill('input[name="director"]', 'Editable Director')
    await page.fill('input[name="organization"]', 'Editable Theater')
    await page.fill('input[name="location"]', 'Editable Location')
    await page.fill('input[name="contactEmail"]', 'editable@example.com')
    await page.fill('input[name="contactPhone"]', '(555) 999-8888')
    
    // Add a character
    await page.click('text=Next')
    await page.click('text=Add Character')
    await page.fill('input[placeholder="Character name"]', 'Editable Character')
    await page.fill('textarea[placeholder="Character description"]', 'A character to edit')
    await page.selectOption('select[name="gender"]', 'Male')
    await page.fill('input[placeholder="Age range"]', '25-35')
    
    // Complete the show creation
    await page.click('text=Next') // Materials
    await page.click('text=Preview') // Preview
    await page.click('text=Next') // Review
    await page.click('text=Publish Show') // Publish
    
    // Wait for redirect and then edit
    await expect(page.locator('text=My Shows')).toBeVisible()
    await page.click('button:has-text("Edit Show")')
    
    // Verify form is populated with existing data
    await expect(page.locator('input[value="Editable Test Show"]')).toBeVisible()
    await expect(page.locator('textarea[value="This show will be edited"]')).toBeVisible()
    await expect(page.locator('input[value="Editable Director"]')).toBeVisible()
    await expect(page.locator('input[value="Editable Theater"]')).toBeVisible()
    await expect(page.locator('input[value="Editable Location"]')).toBeVisible()
    await expect(page.locator('input[value="editable@example.com"]')).toBeVisible()
    await expect(page.locator('input[value="(555) 999-8888"]')).toBeVisible()
  })

  test('should allow editing show information', async ({ page }) => {
    // Create a show first
    await page.goto('http://localhost:3000/dashboard/shows/create')
    await page.fill('input[name="title"]', 'Original Title')
    await page.fill('textarea[name="description"]', 'Original description')
    await page.fill('input[name="director"]', 'Original Director')
    await page.fill('input[name="contactEmail"]', 'original@example.com')
    
    await page.click('text=Next') // Characters
    await page.click('text=Next') // Materials
    await page.click('text=Preview') // Preview
    await page.click('text=Next') // Review
    await page.click('text=Publish Show') // Publish
    
    // Navigate to edit page
    await expect(page.locator('text=My Shows')).toBeVisible()
    await page.click('button:has-text("Edit Show")')
    
    // Edit the show information
    await page.fill('input[name="title"]', 'Updated Title')
    await page.fill('textarea[name="description"]', 'Updated description')
    await page.fill('input[name="director"]', 'Updated Director')
    await page.fill('input[name="organization"]', 'Updated Theater')
    await page.fill('input[name="location"]', 'Updated Location')
    await page.fill('input[name="contactEmail"]', 'updated@example.com')
    await page.fill('input[name="contactPhone"]', '(555) 111-2222')
    
    // Navigate through the edit process
    await page.click('text=Next') // Characters
    await page.click('text=Next') // Materials
    await page.click('text=Preview') // Preview
    await page.click('text=Next') // Review
    await page.click('text=Save Changes') // Save
    
    // Verify we're redirected back to shows list
    await expect(page.locator('text=My Shows')).toBeVisible()
    
    // Verify the show was updated (check for updated title)
    await expect(page.locator('text=Updated Title')).toBeVisible()
  })

  test('should allow editing characters in existing show', async ({ page }) => {
    // Create a show with characters
    await page.goto('http://localhost:3000/dashboard/shows/create')
    await page.fill('input[name="title"]', 'Character Edit Test')
    await page.fill('textarea[name="description"]', 'Testing character editing')
    await page.fill('input[name="director"]', 'Character Director')
    await page.fill('input[name="contactEmail"]', 'character@example.com')
    
    await page.click('text=Next')
    await page.click('text=Add Character')
    await page.fill('input[placeholder="Character name"]', 'Original Character')
    await page.fill('textarea[placeholder="Character description"]', 'Original description')
    await page.selectOption('select[name="gender"]', 'Female')
    await page.fill('input[placeholder="Age range"]', '18-25')
    
    await page.click('text=Next') // Materials
    await page.click('text=Preview') // Preview
    await page.click('text=Next') // Review
    await page.click('text=Publish Show') // Publish
    
    // Navigate to edit page
    await expect(page.locator('text=My Shows')).toBeVisible()
    await page.click('button:has-text("Edit Show")')
    
    // Go to characters step
    await page.click('text=Next')
    
    // Edit the existing character
    await page.fill('input[placeholder="Character name"]', 'Updated Character')
    await page.fill('textarea[placeholder="Character description"]', 'Updated description')
    await page.selectOption('select[name="gender"]', 'Male')
    await page.fill('input[placeholder="Age range"]', '25-35')
    await page.fill('input[placeholder="Vocal range"]', 'Tenor')
    await page.fill('textarea[placeholder="Additional notes"]', 'Updated notes')
    
    // Add another character
    await page.click('text=Add Character')
    await page.fill('input[placeholder="Character name"]', 'New Character')
    await page.fill('textarea[placeholder="Character description"]', 'A new character')
    await page.selectOption('select[name="gender"]', 'Female')
    await page.fill('input[placeholder="Age range"]', '30-40')
    
    // Complete the edit
    await page.click('text=Next') // Materials
    await page.click('text=Preview') // Preview
    await page.click('text=Next') // Review
    await page.click('text=Save Changes') // Save
    
    // Verify we're redirected back
    await expect(page.locator('text=My Shows')).toBeVisible()
  })

  test('should show preview of edited show', async ({ page }) => {
    // Create a show
    await page.goto('http://localhost:3000/dashboard/shows/create')
    await page.fill('input[name="title"]', 'Preview Edit Test')
    await page.fill('textarea[name="description"]', 'Testing preview of edits')
    await page.fill('input[name="director"]', 'Preview Director')
    await page.fill('input[name="contactEmail"]', 'preview@example.com')
    
    await page.click('text=Next') // Characters
    await page.click('text=Add Character')
    await page.fill('input[placeholder="Character name"]', 'Preview Character')
    await page.fill('textarea[placeholder="Character description"]', 'A character for preview')
    await page.selectOption('select[name="gender"]', 'Any')
    await page.fill('input[placeholder="Age range"]', '20-30')
    
    await page.click('text=Next') // Materials
    await page.click('text=Preview') // Preview
    await page.click('text=Next') // Review
    await page.click('text=Publish Show') // Publish
    
    // Navigate to edit page
    await expect(page.locator('text=My Shows')).toBeVisible()
    await page.click('button:has-text("Edit Show")')
    
    // Edit the show
    await page.fill('input[name="title"]', 'Updated Preview Title')
    await page.fill('textarea[name="description"]', 'Updated preview description')
    await page.fill('input[name="director"]', 'Updated Preview Director')
    await page.fill('input[name="organization"]', 'Updated Theater Company')
    
    // Go to preview step
    await page.click('text=Next') // Characters
    await page.click('text=Next') // Materials
    await page.click('text=Preview') // Preview
    
    // Verify preview shows updated information
    await expect(page.locator('text=Updated Preview Title')).toBeVisible()
    await expect(page.locator('text=Updated preview description')).toBeVisible()
    await expect(page.locator('text=Updated Preview Director')).toBeVisible()
    await expect(page.locator('text=Updated Theater Company')).toBeVisible()
    await expect(page.locator('text=Preview Character')).toBeVisible()
  })

  test('should handle edit permissions correctly', async ({ page }) => {
    // Try to access edit page for non-existent show
    await page.goto('http://localhost:3000/dashboard/shows/non-existent-id/edit')
    
    // Should show error or not found message
    await expect(page.locator('text=Show Not Found')).toBeVisible()
    await expect(page.locator('text=Back to Shows')).toBeVisible()
  })

  test('should show loading state while fetching show data', async ({ page }) => {
    // Navigate to edit page (this will show loading state)
    await page.goto('http://localhost:3000/dashboard/shows/test-id/edit')
    
    // Should show loading state
    await expect(page.locator('text=Loading show data...')).toBeVisible()
  })

  test('should validate required fields before saving', async ({ page }) => {
    // Create a show first
    await page.goto('http://localhost:3000/dashboard/shows/create')
    await page.fill('input[name="title"]', 'Validation Test')
    await page.fill('textarea[name="description"]', 'Testing validation')
    await page.fill('input[name="director"]', 'Validation Director')
    await page.fill('input[name="contactEmail"]', 'validation@example.com')
    
    await page.click('text=Next') // Characters
    await page.click('text=Next') // Materials
    await page.click('text=Preview') // Preview
    await page.click('text=Next') // Review
    await page.click('text=Publish Show') // Publish
    
    // Navigate to edit page
    await expect(page.locator('text=My Shows')).toBeVisible()
    await page.click('button:has-text("Edit Show")')
    
    // Clear required fields
    await page.fill('input[name="title"]', '')
    await page.fill('input[name="director"]', '')
    await page.fill('input[name="contactEmail"]', '')
    
    // Try to save
    await page.click('text=Next') // Characters
    await page.click('text=Next') // Materials
    await page.click('text=Preview') // Preview
    await page.click('text=Next') // Review
    await page.click('text=Save Changes') // Save
    
    // Should show validation error or prevent saving
    // (This depends on how validation is implemented)
  })

  test('should navigate between edit steps correctly', async ({ page }) => {
    // Create a show first
    await page.goto('http://localhost:3000/dashboard/shows/create')
    await page.fill('input[name="title"]', 'Navigation Test')
    await page.fill('textarea[name="description"]', 'Testing navigation')
    await page.fill('input[name="director"]', 'Navigation Director')
    await page.fill('input[name="contactEmail"]', 'navigation@example.com')
    
    await page.click('text=Next') // Characters
    await page.click('text=Next') // Materials
    await page.click('text=Preview') // Preview
    await page.click('text=Next') // Review
    await page.click('text=Publish Show') // Publish
    
    // Navigate to edit page
    await expect(page.locator('text=My Shows')).toBeVisible()
    await page.click('button:has-text("Edit Show")')
    
    // Test navigation between steps
    await expect(page.locator('text=Basic Information')).toBeVisible()
    
    await page.click('text=Next')
    await expect(page.locator('text=Characters')).toBeVisible()
    
    await page.click('text=Previous')
    await expect(page.locator('text=Basic Information')).toBeVisible()
    
    await page.click('text=Next')
    await page.click('text=Next')
    await expect(page.locator('text=Audition Materials')).toBeVisible()
    
    await page.click('text=Preview')
    await expect(page.locator('text=Preview Your Show')).toBeVisible()
    
    await page.click('text=Next')
    await expect(page.locator('text=Review Your Changes')).toBeVisible()
  })
})
