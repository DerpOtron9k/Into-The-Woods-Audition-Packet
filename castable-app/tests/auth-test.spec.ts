import { test, expect } from '@playwright/test'
import { mockAuthentication } from './auth-helper'

test.describe('Authentication Mocking', () => {
  test.beforeEach(async ({ page }) => {
    await mockAuthentication(page)
  })

  test('should access dashboard with mocked authentication', async ({ page }) => {
    // Navigate to dashboard
    await page.goto('/dashboard')
    
    // Should be able to access dashboard without redirect to sign-in
    await expect(page.locator('h1')).toContainText('Dashboard')
  })

  test('should access shows page with mocked authentication', async ({ page }) => {
    // Navigate to shows page
    await page.goto('/dashboard/shows')
    
    // Should be able to access shows page
    await expect(page.locator('h1')).toContainText('My Shows')
  })

  test('should access create show page with mocked authentication', async ({ page }) => {
    // Navigate to create show page
    await page.goto('/dashboard/shows/create')
    
    // Should be able to access create show page
    await expect(page.locator('h1')).toContainText('Create New Show')
  })
})

