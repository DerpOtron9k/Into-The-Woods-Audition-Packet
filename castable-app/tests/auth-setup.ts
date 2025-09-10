import { Page } from '@playwright/test'

export async function setupMockAuth(page: Page) {
  // Mock Clerk authentication by intercepting the auth check
  await page.addInitScript(() => {
    // Mock the Clerk auth object
    window.Clerk = {
      user: {
        id: 'test-user-id',
        emailAddresses: [{ emailAddress: 'test@example.com' }],
        firstName: 'Test',
        lastName: 'User'
      },
      isSignedIn: () => true,
      isLoaded: () => true,
      loaded: true
    }

    // Mock the auth function from @clerk/nextjs/server
    // This will be available in the page context
    (window as any).__mockAuth = {
      userId: 'test-user-id',
      user: {
        id: 'test-user-id',
        emailAddresses: [{ emailAddress: 'test@example.com' }]
      }
    }
  })

  // Mock the API routes to bypass authentication
  await page.route('**/api/**', async (route) => {
    const request = route.request()
    const url = new URL(request.url())
    
    // Add mock auth headers to all API requests
    const headers = {
      ...request.headers(),
      'x-clerk-user-id': 'test-user-id',
      'x-clerk-session-token': 'mock-session-token'
    }

    // Continue with the request but add auth headers
    await route.continue({ headers })
  })
}

export async function mockApiResponse(page: Page, endpoint: string, method: string, response: any) {
  await page.route(`**${endpoint}`, async (route) => {
    if (route.request().method() === method) {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify(response)
      })
    } else {
      await route.continue()
    }
  })
}

