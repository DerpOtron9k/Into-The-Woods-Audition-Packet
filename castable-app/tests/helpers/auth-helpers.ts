import { Page } from '@playwright/test'

/**
 * Mock Clerk authentication state for testing
 */
export async function mockClerkAuth(page: Page, isAuthenticated: boolean = false) {
  await page.addInitScript((authenticated) => {
    window.Clerk = {
      user: authenticated ? { 
        id: 'test-user-123', 
        firstName: 'Test', 
        lastName: 'User',
        emailAddresses: [{ emailAddress: 'test@example.com' }]
      } : null,
      loaded: true,
      isSignedIn: () => authenticated,
      isLoaded: () => true,
      openSignIn: () => Promise.resolve(),
      openSignUp: () => Promise.resolve(),
      signOut: () => Promise.resolve()
    }
  }, isAuthenticated)
}

/**
 * Wait for Clerk to load
 */
export async function waitForClerkLoad(page: Page) {
  await page.waitForFunction(() => {
    return window.Clerk && window.Clerk.isLoaded && window.Clerk.isLoaded()
  })
}

/**
 * Check if user is authenticated
 */
export async function isUserAuthenticated(page: Page): Promise<boolean> {
  return await page.evaluate(() => {
    return window.Clerk && window.Clerk.isSignedIn && window.Clerk.isSignedIn()
  })
}
