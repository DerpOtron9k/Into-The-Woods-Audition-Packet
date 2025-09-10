import { test, expect } from '@playwright/test'

test.describe('Analytics and Monitoring', () => {
  test('should track show creation event', async ({ page }) => {
    // Mock analytics tracking
    await page.addInitScript(() => {
      window.gtag = (command: string, eventName: string, parameters?: any) => {
        console.log('Analytics event:', { command, eventName, parameters })
        // Store events for verification
        if (!window.analyticsEvents) {
          window.analyticsEvents = []
        }
        window.analyticsEvents.push({ command, eventName, parameters })
      }
    })

    // Navigate to show creation page
    await page.goto('http://localhost:3000/dashboard/shows/create')
    
    // Fill in basic show information
    await page.fill('input[name="title"]', 'Test Show for Analytics')
    await page.fill('textarea[name="description"]', 'A test show to verify analytics tracking')
    await page.fill('input[name="director"]', 'Test Director')
    await page.fill('input[name="organization"]', 'Test Theater')
    await page.fill('input[name="contactEmail"]', 'test@example.com')
    
    // Click Next to proceed
    await page.click('text=Next')
    
    // Add a character
    await page.click('text=Add Character')
    await page.fill('input[placeholder="Character name"]', 'Test Character')
    await page.fill('textarea[placeholder="Character description"]', 'A test character')
    await page.selectOption('select[name="gender"]', 'Female')
    await page.fill('input[placeholder="Age range"]', '18-25')
    await page.fill('input[placeholder="Vocal range"]', 'Soprano')
    
    // Click Next to proceed
    await page.click('text=Next')
    
    // Click Next to skip materials step
    await page.click('text=Next')
    
    // Publish the show
    await page.click('text=Publish Show')
    
    // Wait for success message
    await expect(page.locator('text=Show Published Successfully')).toBeVisible()
    
    // Verify analytics event was tracked
    const analyticsEvents = await page.evaluate(() => window.analyticsEvents)
    const showCreatedEvent = analyticsEvents.find((event: any) => 
      event.eventName === 'show_created' && 
      event.parameters?.show_title === 'Test Show for Analytics'
    )
    
    expect(showCreatedEvent).toBeTruthy()
    expect(showCreatedEvent.parameters.show_id).toBeTruthy()
  })

  test('should track show view event', async ({ page }) => {
    // Mock analytics tracking
    await page.addInitScript(() => {
      window.gtag = (command: string, eventName: string, parameters?: any) => {
        console.log('Analytics event:', { command, eventName, parameters })
        // Store events for verification
        if (!window.analyticsEvents) {
          window.analyticsEvents = []
        }
        window.analyticsEvents.push({ command, eventName, parameters })
      }
    })

    // Navigate to a public show page
    await page.goto('http://localhost:3000/shows/test-show-123')
    
    // Wait for page to load - check for any h1 element
    await expect(page.locator('h1')).toBeVisible({ timeout: 10000 })
    
    // Verify analytics event was tracked
    const analyticsEvents = await page.evaluate(() => window.analyticsEvents || [])
    const showViewedEvent = analyticsEvents.find((event: any) => 
      event.eventName === 'show_viewed' && 
      event.parameters?.show_title === 'Into the Woods'
    )
    
    expect(showViewedEvent).toBeTruthy()
    expect(showViewedEvent.parameters.show_id).toBe('test-show-123')
  })

  test('should track page views on navigation', async ({ page }) => {
    // Mock analytics tracking
    await page.addInitScript(() => {
      window.gtag = (command: string, eventName: string, parameters?: any) => {
        console.log('Analytics event:', { command, eventName, parameters })
        // Store events for verification
        if (!window.analyticsEvents) {
          window.analyticsEvents = []
        }
        window.analyticsEvents.push({ command, eventName, parameters })
      }
    })

    // Navigate to different pages and verify tracking
    await page.goto('http://localhost:3000/')
    await page.goto('http://localhost:3000/dashboard')
    await page.goto('http://localhost:3000/shows/test-show-123')
    
    // Verify page view events were tracked
    const analyticsEvents = await page.evaluate(() => window.analyticsEvents || [])
    const pageViewEvents = analyticsEvents.filter((event: any) => 
      event.command === 'config' && event.eventName === 'GA_MEASUREMENT_ID'
    )
    
    expect(pageViewEvents.length).toBeGreaterThan(0)
  })

  test('should handle analytics errors gracefully', async ({ page }) => {
    // Mock analytics to throw errors
    await page.addInitScript(() => {
      window.gtag = () => {
        throw new Error('Analytics error')
      }
    })

    // Navigate to pages - should not crash
    await page.goto('http://localhost:3000/')
    await page.goto('http://localhost:3000/shows/test-show-123')
    
    // Verify page still loads correctly
    await expect(page.locator('h1')).toBeVisible({ timeout: 10000 })
  })
})

// Declare global for TypeScript
declare global {
  interface Window {
    analyticsEvents: any[]
    gtag: (...args: any[]) => void
  }
}
