import { test, expect } from '@playwright/test'

test('should load dashboard without auth redirect', async ({ page }) => {
  // Navigate to dashboard
  await page.goto('/dashboard')
  
  // Wait a bit to see what happens
  await page.waitForTimeout(3000)
  
  // Check if we're still on the dashboard or redirected
  const currentUrl = page.url()
  console.log('Current URL:', currentUrl)
  
  // Take a screenshot for debugging
  await page.screenshot({ path: 'dashboard-test.png' })
  
  // The test passes if we don't get redirected to auth
  expect(currentUrl).toContain('/dashboard')
})

