import { test, expect } from '@playwright/test'
import { mockAuthentication } from './auth-helper'

test.describe('Debug Authentication', () => {
  test.beforeEach(async ({ page }) => {
    await mockAuthentication(page)
  })

  test('debug page content', async ({ page }) => {
    // Navigate to dashboard
    await page.goto('/dashboard')
    
    // Wait for page to load
    await page.waitForLoadState('networkidle')
    
    // Get page content
    const content = await page.content()
    console.log('Page content:', content.substring(0, 1000))
    
    // Get page title
    const title = await page.title()
    console.log('Page title:', title)
    
    // Get all h1 elements
    const h1Elements = await page.locator('h1').all()
    console.log('H1 elements found:', h1Elements.length)
    
    for (let i = 0; i < h1Elements.length; i++) {
      const text = await h1Elements[i].textContent()
      console.log(`H1 ${i}:`, text)
    }
    
    // Check if we're redirected to sign-in
    const currentUrl = page.url()
    console.log('Current URL:', currentUrl)
    
    // Check for sign-in elements
    const signInElements = await page.locator('text=Sign In').count()
    console.log('Sign In elements found:', signInElements)
    
    // Take a screenshot for debugging
    await page.screenshot({ path: 'debug-auth.png' })
  })
})

