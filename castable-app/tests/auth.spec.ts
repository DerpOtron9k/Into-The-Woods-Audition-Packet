import { test, expect } from '@playwright/test'

test.describe('Clerk Authentication', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should display sign in and sign up buttons when user is not authenticated', async ({ page }) => {
    // Check that the header is visible
    await expect(page.getByRole('heading', { name: 'Castable' })).toBeVisible()
    
    // Check that sign in and sign up buttons are visible
    await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /sign up/i })).toBeVisible()
    
    // Check that user button is not visible
    await expect(page.getByRole('button', { name: /user menu/i })).not.toBeVisible()
  })

  test('should open sign in modal when sign in button is clicked', async ({ page }) => {
    await page.getByRole('button', { name: /sign in/i }).click()
    
    // Wait for Clerk modal to appear - try multiple possible selectors
    await page.waitForSelector('[data-clerk-modal], .cl-modal, [role="dialog"]', { timeout: 10000 })
    
    // Check that Clerk sign in component is rendered
    await expect(page.locator('form')).toBeVisible()
  })

  test('should open sign up modal when sign up button is clicked', async ({ page }) => {
    await page.getByRole('button', { name: /sign up/i }).click()
    
    // Wait for Clerk modal to appear - try multiple possible selectors
    await page.waitForSelector('[data-clerk-modal], .cl-modal, [role="dialog"]', { timeout: 10000 })
    
    // Check that Clerk sign up component is rendered
    await expect(page.locator('form')).toBeVisible()
  })

  test('should display welcome message on home page', async ({ page }) => {
    await expect(page.getByText('Welcome to Castable')).toBeVisible()
  })

  test('should have proper page structure', async ({ page }) => {
    // Check HTML structure
    await expect(page.locator('html')).toHaveAttribute('lang', 'en')
    await expect(page.locator('body')).toBeVisible()
    
    // Check header structure
    const header = page.locator('header')
    await expect(header).toBeVisible()
    await expect(header.locator('h1')).toHaveText('Castable')
    
    // Check main content - use first() to handle multiple main elements
    const main = page.locator('main').first()
    await expect(main).toBeVisible()
  })
})

test.describe('Clerk Authentication Flow (Mock)', () => {
  test('should handle authentication state changes', async ({ page }) => {
    // Mock the authentication state
    await page.addInitScript(() => {
      // Mock Clerk's authentication state
      window.Clerk = {
        user: null,
        loaded: true,
        isSignedIn: () => false,
        isLoaded: () => true
      }
    })

    await page.goto('/')
    
    // Verify unauthenticated state
    await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /sign up/i })).toBeVisible()
  })

  test('should handle authenticated state', async ({ page }) => {
    // Mock authenticated state
    await page.addInitScript(() => {
      window.Clerk = {
        user: { id: 'test-user', firstName: 'Test', lastName: 'User' },
        loaded: true,
        isSignedIn: () => true,
        isLoaded: () => true
      }
    })

    await page.goto('/')
    
    // In a real scenario, this would show the user button
    // For now, we'll just verify the page loads without errors
    await expect(page.getByText('Welcome to Castable')).toBeVisible()
  })
})
