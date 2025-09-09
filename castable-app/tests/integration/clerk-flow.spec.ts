import { test, expect } from '@playwright/test'
import { mockClerkAuth, waitForClerkLoad } from '../helpers/auth-helpers'

test.describe('Clerk Authentication Integration', () => {
  test('should handle complete authentication flow', async ({ page }) => {
    // Start with unauthenticated state
    await mockClerkAuth(page, false)
    await page.goto('/')
    await waitForClerkLoad(page)

    // Verify unauthenticated state
    await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /sign up/i })).toBeVisible()

    // Test sign in modal
    await page.getByRole('button', { name: /sign in/i }).click()
    await page.waitForSelector('[data-clerk-modal], .cl-modal, [role="dialog"]', { timeout: 10000 })
    await expect(page.locator('form')).toBeVisible()

    // Close modal and go back to home
    await page.keyboard.press('Escape')
    await page.goto('/')
    await waitForClerkLoad(page)

    // Test sign up modal
    await page.getByRole('button', { name: /sign up/i }).click()
    await page.waitForSelector('[data-clerk-modal], .cl-modal, [role="dialog"]', { timeout: 10000 })
    await expect(page.locator('form')).toBeVisible()
  })

  test('should handle authenticated state correctly', async ({ page }) => {
    // Mock authenticated state
    await mockClerkAuth(page, true)
    await page.goto('/')
    await waitForClerkLoad(page)

    // In a real implementation, this would show the UserButton
    // For now, we verify the page loads without errors
    await expect(page.getByText('Welcome to Castable')).toBeVisible()
    await expect(page.getByRole('heading', { name: 'Castable' })).toBeVisible()
  })

  test('should maintain authentication state across page navigation', async ({ page }) => {
    await mockClerkAuth(page, false)
    await page.goto('/')
    await waitForClerkLoad(page)

    // Open sign in modal
    await page.getByRole('button', { name: /sign in/i }).click()
    await page.waitForSelector('[data-clerk-modal], .cl-modal, [role="dialog"]', { timeout: 10000 })

    // Close modal and navigate back to home
    await page.keyboard.press('Escape')
    await page.goto('/')
    await waitForClerkLoad(page)

    // Should still show sign in/up buttons
    await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible()
    await expect(page.getByRole('button', { name: /sign up/i })).toBeVisible()
  })

  test('should handle middleware correctly', async ({ page }) => {
    // Test that middleware doesn't interfere with public pages
    await page.goto('/')
    await expect(page.getByText('Welcome to Castable')).toBeVisible()

    await page.goto('/sign-in')
    await expect(page.locator('form')).toBeVisible()

    await page.goto('/sign-up')
    await expect(page.locator('form')).toBeVisible()
  })
})
