import { test, expect } from '@playwright/test'

test.describe('API Endpoints', () => {
  test('should test show editing API endpoints directly', async ({ request }) => {
    // Test the API endpoints directly without authentication
    // This bypasses the frontend authentication issues
    
    // Test GET /api/shows
    const showsResponse = await request.get('/api/shows')
    console.log('Shows API status:', showsResponse.status())
    
    // Test POST /api/shows (create a show)
    const createResponse = await request.post('/api/shows', {
      data: {
        title: 'Test Show for API',
        description: 'Testing API directly',
        director: 'Test Director',
        contactEmail: 'test@example.com',
        characters: [],
        auditionMaterials: []
      }
    })
    console.log('Create show API status:', createResponse.status())
    
    if (createResponse.ok()) {
      const showData = await createResponse.json()
      console.log('Created show:', showData)
      
      // Test PUT /api/shows (update the show)
      const updateResponse = await request.put('/api/shows', {
        data: {
          id: showData.show.id,
          title: 'Updated Test Show',
          description: 'Updated description',
          director: 'Updated Director',
          contactEmail: 'updated@example.com',
          characters: [],
          auditionMaterials: []
        }
      })
      console.log('Update show API status:', updateResponse.status())
      
      // Test GET /api/shows/[id] (get specific show)
      const getResponse = await request.get(`/api/shows/${showData.show.id}`)
      console.log('Get show API status:', getResponse.status())
    }
  })
})

