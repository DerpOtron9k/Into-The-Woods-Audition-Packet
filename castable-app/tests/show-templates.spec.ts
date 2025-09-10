import { test, expect } from '@playwright/test'

test.describe('Show Templates Functionality', () => {
  test('should create and save a show template', async ({ page }) => {
    // Navigate to show creation page
    await page.goto('http://localhost:3000/dashboard/shows/create')
    
    // Fill in show information
    await page.fill('input[name="title"]', 'Test Show for Template')
    await page.fill('textarea[name="description"]', 'A test show to create a template')
    await page.fill('input[name="director"]', 'Test Director')
    await page.fill('input[name="organization"]', 'Test Theater')
    await page.fill('input[name="contactEmail"]', 'test@example.com')
    
    // Navigate to characters step
    await page.click('text=Next')
    
    // Add a character
    await page.click('text=Add Character')
    await page.fill('input[placeholder="Character name"]', 'Test Character')
    await page.fill('textarea[placeholder="Character description"]', 'A test character')
    await page.selectOption('select[name="gender"]', 'Female')
    await page.fill('input[placeholder="Age range"]', '18-25')
    
    // Navigate to materials step
    await page.click('text=Next')
    
    // Navigate to preview step
    await page.click('text=Preview')
    
    // Navigate to review step
    await page.click('text=Next')
    
    // Verify we're on review step
    await expect(page.locator('text=Review Your Show')).toBeVisible()
    
    // Click Save as Template button
    await page.click('text=Save as Template')
    
    // Fill in template details
    await page.fill('input[placeholder="e.g., Musical Template"]', 'Test Musical Template')
    await page.fill('textarea[placeholder="Brief description of this template"]', 'A template for musical shows')
    
    // Save template
    await page.click('text=Save Template')
    
    // Verify success message
    await expect(page.locator('text=Template saved successfully!')).toBeVisible()
  })

  test('should display templates page with saved templates', async ({ page }) => {
    // Navigate to templates page
    await page.goto('http://localhost:3000/dashboard/templates')
    
    // Verify templates page loads
    await expect(page.locator('text=Show Templates')).toBeVisible()
    await expect(page.locator('text=Save and reuse show configurations for future productions')).toBeVisible()
    
    // Check for create template button
    await expect(page.locator('text=Create Template')).toBeVisible()
  })

  test('should create a new template from templates page', async ({ page }) => {
    // Navigate to templates page
    await page.goto('http://localhost:3000/dashboard/templates')
    
    // Click Create Template button
    await page.click('text=Create Template')
    
    // Fill in template details
    await page.fill('input[placeholder="e.g., Musical Template"]', 'Drama Template')
    await page.fill('input[placeholder="Brief description of this template"]', 'Template for drama productions')
    await page.fill('input[placeholder="Default title for shows using this template"]', 'Drama Show')
    await page.fill('textarea[placeholder="Default description for shows using this template"]', 'A dramatic production')
    await page.fill('input[placeholder="Your name"]', 'Template Director')
    await page.fill('input[placeholder="Theater company name"]', 'Template Theater')
    await page.fill('input[placeholder="your-email@example.com"]', 'template@example.com')
    
    // Create template
    await page.click('text=Create Template')
    
    // Verify template appears in the list
    await expect(page.locator('text=Drama Template')).toBeVisible()
    await expect(page.locator('text=Template for drama productions')).toBeVisible()
  })

  test('should use template to create new show', async ({ page }) => {
    // First create a template
    await page.goto('http://localhost:3000/dashboard/templates')
    await page.click('text=Create Template')
    
    await page.fill('input[placeholder="e.g., Musical Template"]', 'Quick Test Template')
    await page.fill('input[placeholder="Your name"]', 'Template Director')
    await page.fill('input[placeholder="your-email@example.com"]', 'template@example.com')
    await page.click('text=Create Template')
    
    // Wait for template to be created
    await expect(page.locator('text=Quick Test Template')).toBeVisible()
    
    // Click Use Template button
    await page.click('text=Use Template')
    
    // Verify we're redirected to show creation page
    await expect(page.locator('text=Create New Show')).toBeVisible()
    
    // Verify template data is loaded
    await expect(page.locator('input[value="Template Director"]')).toBeVisible()
    await expect(page.locator('input[value="template@example.com"]')).toBeVisible()
  })

  test('should search and filter templates', async ({ page }) => {
    // Navigate to templates page
    await page.goto('http://localhost:3000/dashboard/templates')
    
    // Create multiple templates for testing
    await page.click('text=Create Template')
    await page.fill('input[placeholder="e.g., Musical Template"]', 'Musical Template')
    await page.fill('input[placeholder="Brief description of this template"]', 'For musical productions')
    await page.click('text=Create Template')
    
    await page.click('text=Create Template')
    await page.fill('input[placeholder="e.g., Musical Template"]', 'Drama Template')
    await page.fill('input[placeholder="Brief description of this template"]', 'For drama productions')
    await page.click('text=Create Template')
    
    // Test search functionality
    await page.fill('input[placeholder="Search templates..."]', 'Musical')
    
    // Verify only musical template is visible
    await expect(page.locator('text=Musical Template')).toBeVisible()
    await expect(page.locator('text=Drama Template')).not.toBeVisible()
    
    // Clear search
    await page.fill('input[placeholder="Search templates..."]', '')
    
    // Verify both templates are visible again
    await expect(page.locator('text=Musical Template')).toBeVisible()
    await expect(page.locator('text=Drama Template')).toBeVisible()
  })

  test('should delete template', async ({ page }) => {
    // Navigate to templates page
    await page.goto('http://localhost:3000/dashboard/templates')
    
    // Create a template to delete
    await page.click('text=Create Template')
    await page.fill('input[placeholder="e.g., Musical Template"]', 'Delete Test Template')
    await page.fill('input[placeholder="Brief description of this template"]', 'This will be deleted')
    await page.click('text=Create Template')
    
    // Verify template exists
    await expect(page.locator('text=Delete Test Template')).toBeVisible()
    
    // Click delete button (trash icon)
    await page.click('button:has(svg[data-lucide="trash-2"])')
    
    // Confirm deletion
    await page.click('text=OK')
    
    // Verify template is deleted
    await expect(page.locator('text=Delete Test Template')).not.toBeVisible()
  })

  test('should show template details and character count', async ({ page }) => {
    // Navigate to templates page
    await page.goto('http://localhost:3000/dashboard/templates')
    
    // Create a template with characters
    await page.click('text=Create Template')
    await page.fill('input[placeholder="e.g., Musical Template"]', 'Detailed Template')
    await page.fill('input[placeholder="Brief description of this template"]', 'Template with details')
    await page.fill('input[placeholder="Default title for shows using this template"]', 'Detailed Show')
    await page.click('text=Create Template')
    
    // Verify template details are displayed
    await expect(page.locator('text=Detailed Template')).toBeVisible()
    await expect(page.locator('text=Template with details')).toBeVisible()
    await expect(page.locator('text=Default Title:')).toBeVisible()
    await expect(page.locator('text=Detailed Show')).toBeVisible()
    await expect(page.locator('text=Characters:')).toBeVisible()
    await expect(page.locator('text=Created:')).toBeVisible()
  })

  test('should handle empty templates state', async ({ page }) => {
    // Navigate to templates page
    await page.goto('http://localhost:3000/dashboard/templates')
    
    // Verify empty state is displayed
    await expect(page.locator('text=No templates found')).toBeVisible()
    await expect(page.locator('text=Create your first template to get started.')).toBeVisible()
    await expect(page.locator('text=Create Template')).toBeVisible()
  })
})

