import { test, expect } from '@playwright/test'

test.describe('Show Duplication', () => {
  test.beforeEach(async ({ page }) => {
    // Mock the authentication by intercepting the auth check
    await page.addInitScript(() => {
      // Mock Clerk in the browser
      (window as any).Clerk = {
        user: { id: 'test-user-id' },
        isSignedIn: () => true,
        isLoaded: () => true
      }
    })
  })

  test('should show duplicate button on dashboard', async ({ page }) => {
    // Mock API responses
    await page.route('**/api/shows', async (route) => {
      if (route.request().method() === 'GET') {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify([
            {
              id: 'show-1',
              title: 'Test Show',
              description: 'A test show',
              status: 'active',
              createdAt: new Date().toISOString(),
              characters: [],
              applicants: [],
              auditionMaterials: []
            }
          ])
        })
      } else {
        await route.continue()
      }
    })

    // Navigate to dashboard
    await page.goto('/dashboard')
    
    // Wait for the show to be displayed
    await expect(page.locator('text=Test Show')).toBeVisible()
    
    // Check that duplicate button exists
    await expect(page.locator('button[title*="Duplicate"]')).toBeVisible()
  })

})