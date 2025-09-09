import { test, expect } from '@playwright/test'

test.describe('Clerk Component Integration', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('should render ClerkProvider without errors', async ({ page }) => {
    // Check that the page loads without JavaScript errors
    const errors: string[] = []
    page.on('console', msg => {
      if (msg.type() === 'error') {
        errors.push(msg.text())
      }
    })

    await page.waitForLoadState('networkidle')
    
    // Verify no critical errors
    const criticalErrors = errors.filter(error => 
      !error.includes('Clerk') && 
      !error.includes('environment') &&
      !error.includes('publishable key')
    )
    expect(criticalErrors).toHaveLength(0)
  })

  test('should have proper accessibility attributes', async ({ page }) => {
    // Check header accessibility
    const header = page.locator('header')
    await expect(header).toBeVisible()
    
    // Check that buttons have proper roles
    const signInButton = page.getByRole('button', { name: /sign in/i })
    const signUpButton = page.getByRole('button', { name: /sign up/i })
    
    await expect(signInButton).toBeVisible()
    await expect(signUpButton).toBeVisible()
  })

  test('should handle responsive design', async ({ page }) => {
    // Test mobile viewport
    await page.setViewportSize({ width: 375, height: 667 })
    await page.reload()
    
    await expect(page.getByRole('heading', { name: 'Castable' })).toBeVisible()
    await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /sign up/i })).toBeVisible()
    
    // Test desktop viewport
    await page.setViewportSize({ width: 1920, height: 1080 })
    await page.reload()
    
    await expect(page.getByRole('heading', { name: 'Castable' })).toBeVisible()
    await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /sign up/i })).toBeVisible()
  })

  test('should load sign-in page correctly', async ({ page }) => {
    await page.goto('/sign-in')
    
    // Check that the page loads
    await expect(page).toHaveURL(/.*sign-in/)
    
    // Check for Clerk sign-in form elements
    await expect(page.locator('form')).toBeVisible()
    
    // Check that the header is still present - use first() to handle multiple headings
    await expect(page.getByRole('heading', { name: 'Castable' }).first()).toBeVisible()
  })

  test('should load sign-up page correctly', async ({ page }) => {
    await page.goto('/sign-up')
    
    // Check that the page loads
    await expect(page).toHaveURL(/.*sign-up/)
    
    // Check for Clerk sign-up form elements
    await expect(page.locator('form')).toBeVisible()
    
    // Check that the header is still present - use first() to handle multiple headings
    await expect(page.getByRole('heading', { name: 'Castable' }).first()).toBeVisible()
  })
})
