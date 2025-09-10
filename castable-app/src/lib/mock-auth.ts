// Mock authentication for testing and development
export const mockAuth = {
  userId: 'test-user-id',
  user: {
    id: 'test-user-id',
    emailAddresses: [{ emailAddress: 'test@example.com' }],
    firstName: 'Test',
    lastName: 'User'
  }
}

// Check if we're in test mode or development with mock auth enabled
export function isMockAuthEnabled() {
  return process.env.NODE_ENV === 'test' || process.env.MOCK_AUTH === 'true'
}

// Get mock auth data
export function getMockAuth() {
  return mockAuth
}