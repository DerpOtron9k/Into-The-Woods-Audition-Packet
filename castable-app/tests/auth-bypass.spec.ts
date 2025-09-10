import { test, expect } from '@playwright/test'

test.describe('Authentication Bypass', () => {
  test('should access dashboard without authentication in test mode', async ({ page }) => {
    // Navigate directly to dashboard - should not redirect to auth
    await page.goto('/dashboard')
    
    // Should not be redirected to Clerk auth page
    await expect(page).not.toHaveURL(/clerk\.accounts\.dev/)
    await expect(page).not.toHaveURL(/sign-in/)
    
    // Should show dashboard content
    await expect(page.locator('h1')).toContainText('Dashboard')
  })

  test('should access API routes without authentication in test mode', async ({ page }) => {
    // Test API endpoint directly
    const response = await page.request.get('/api/shows')
    
    // Should not return 401 Unauthorized
    expect(response.status()).not.toBe(401)
    
    // Should return some response (even if empty)
    expect(response.status()).toBe(200)
  })
})

