// Authentication helper for Playwright tests
export async function mockAuthentication(page: any) {
  // Set test environment variables
  await page.addInitScript(() => {
    // Set environment variables for test mode
    process.env.NODE_ENV = 'test'
    process.env.NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY = 'test-key'
    process.env.CLERK_SECRET_KEY = 'test-secret'
  })

  // Mock all Clerk API calls
  await page.route('**/clerk.accounts.dev/**', async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        client: {
          id: 'test-client-id',
          sessions: [{
            id: 'test-session-123',
            status: 'active',
            user: {
              id: 'test-user-123',
              emailAddresses: [{ emailAddress: 'test@example.com' }],
              firstName: 'Test',
              lastName: 'User'
            }
          }]
        }
      })
    })
  })

  // Mock authentication by intercepting requests and adding auth headers
  await page.route('**/*', async (route) => {
    const request = route.request()
    
    // Add authentication headers to all requests
    const headers = {
      ...request.headers(),
      'x-clerk-auth-status': 'signed-in',
      'x-clerk-user-id': 'test-user-123',
      'x-clerk-session-id': 'test-session-123'
    }
    
    await route.continue({ headers })
  })

  // Mock Clerk on the client side
  await page.addInitScript(() => {
    // Mock Clerk object
    (window as any).Clerk = {
      user: { 
        id: 'test-user-123',
        emailAddresses: [{ emailAddress: 'test@example.com' }],
        firstName: 'Test',
        lastName: 'User'
      },
      isSignedIn: () => true,
      isLoaded: () => true,
      load: () => Promise.resolve(),
      signOut: () => Promise.resolve(),
      openSignIn: () => Promise.resolve(),
      openSignUp: () => Promise.resolve(),
      openUserProfile: () => Promise.resolve(),
      openOrganizationProfile: () => Promise.resolve(),
      openOrganizationSwitcher: () => Promise.resolve(),
      setActive: () => Promise.resolve(),
      addListener: () => {},
      removeListener: () => {},
      publish: () => {},
      subscribe: () => (() => {}),
      unsubscribe: () => {},
      session: {
        id: 'test-session-123',
        status: 'active',
        user: {
          id: 'test-user-123',
          emailAddresses: [{ emailAddress: 'test@example.com' }],
          firstName: 'Test',
          lastName: 'User'
        }
      }
    }
    
    // Mock auth function used in API routes
    (window as any).auth = () => Promise.resolve({ userId: 'test-user-123' })
    
    // Mock Next.js auth function
    if (typeof (window as any).__NEXT_DATA__ === 'undefined') {
      (window as any).__NEXT_DATA__ = {}
    }
    (window as any).__NEXT_DATA__.props = {
      ...((window as any).__NEXT_DATA__.props || {}),
      pageProps: {
        ...((window as any).__NEXT_DATA__.props?.pageProps || {}),
        user: {
          id: 'test-user-123',
          email: 'test@example.com',
          firstName: 'Test',
          lastName: 'User'
        }
      }
    }
  })
}

// Helper to create test shows for editing tests
export async function createTestShow(page: any, showData: any = {}) {
  const defaultShowData = {
    title: 'Test Show for Editing',
    description: 'This is a test show that will be edited',
    director: 'Test Director',
    organization: 'Test Theater',
    contactEmail: 'test@example.com',
    contactPhone: '555-0123',
    location: 'Test Theater',
    auditionDate: '2024-12-01',
    deadline: '2024-11-25',
    characters: [
      {
        name: 'Test Character 1',
        description: 'A test character',
        gender: 'Any',
        ageRange: '18-30',
        vocalRange: 'Soprano',
        notes: 'Test notes'
      }
    ],
    auditionMaterials: [
      {
        type: 'script',
        fileName: 'test-script.pdf',
        fileUrl: 'https://example.com/test-script.pdf',
        fileSize: 1024,
        mimeType: 'application/pdf'
      }
    ]
  }

  const mergedData = { ...defaultShowData, ...showData }

  // Navigate to create show page
  await page.goto('/dashboard/shows/create')
  
  // Fill basic information
  await page.fill('input[id="title"]', mergedData.title)
  await page.fill('textarea[id="description"]', mergedData.description)
  await page.fill('input[id="director"]', mergedData.director)
  await page.fill('input[id="organization"]', mergedData.organization)
  await page.fill('input[id="contactEmail"]', mergedData.contactEmail)
  await page.fill('input[id="contactPhone"]', mergedData.contactPhone)
  await page.fill('input[id="location"]', mergedData.location)
  
  if (mergedData.auditionDate) {
    await page.fill('input[id="auditionDate"]', mergedData.auditionDate)
  }
  if (mergedData.deadline) {
    await page.fill('input[id="deadline"]', mergedData.deadline)
  }

  // Go to characters step
  await page.click('button:has-text("Next")')
  
  // Add characters
  for (let i = 0; i < mergedData.characters.length; i++) {
    const character = mergedData.characters[i]
    await page.click('button:has-text("Add Character")')
    
    // Wait for the character form to appear
    await page.waitForSelector('input[placeholder="e.g., Cinderella"]', { timeout: 5000 })
    
    // Fill character details using the dynamic form structure
    const characterInputs = await page.locator('input[placeholder="e.g., Cinderella"]').nth(i)
    await characterInputs.fill(character.name)
    
    const descriptionInputs = await page.locator('textarea[placeholder*="Describe the character"]').nth(i)
    await descriptionInputs.fill(character.description)
    
    // Select gender
    const genderSelects = await page.locator('[role="combobox"]').nth(i * 2) // Assuming gender is the first select
    await genderSelects.click()
    await page.click(`text=${character.gender}`)
    
    // Fill age range
    const ageInputs = await page.locator('input[placeholder="e.g., 18-25, 30-40"]').nth(i)
    await ageInputs.fill(character.ageRange)
    
    // Fill vocal range
    const vocalInputs = await page.locator('input[placeholder="e.g., Soprano, Tenor"]').nth(i)
    await vocalInputs.fill(character.vocalRange)
    
    // Fill notes
    const notesInputs = await page.locator('textarea[placeholder*="Additional notes"]').nth(i)
    await notesInputs.fill(character.notes)
  }

  // Go to materials step (skip adding materials for now)
  await page.click('button:has-text("Next")')
  
  // Go to preview step
  await page.click('button:has-text("Preview")')
  
  // Go to review step and publish
  await page.click('button:has-text("Next")')
  await page.click('button:has-text("Publish Show")')
  
  // Wait for success and get the show ID from the URL or response
  await page.waitForURL(/\/dashboard\/shows\/.*/, { timeout: 10000 })
  
  // Extract show ID from URL
  const url = page.url()
  const showId = url.match(/\/shows\/([^\/]+)/)?.[1]
  
  return showId
}
