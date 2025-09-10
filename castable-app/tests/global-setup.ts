import { chromium, FullConfig } from '@playwright/test'

async function globalSetup(config: FullConfig) {
  // This runs once before all tests
  console.log('Setting up global test environment...')
  
  // You can add any global setup here if needed
  // For now, we're handling auth mocking in beforeEach
}

export default globalSetup

