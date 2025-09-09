// Setup test data for Playwright tests
const { PrismaClient } = require('@prisma/client')

async function setupTestData() {
  const prisma = new PrismaClient()
  
  try {
    console.log('🧪 Setting up test data for Playwright tests...')
    
    // Create test show for application flow tests
    const testShow = await prisma.show.create({
      data: {
        id: 'test-show-123',
        title: 'Into the Woods',
        description: 'A musical about fairy tale characters and their intertwined stories.',
        director: 'Jane Smith',
        organization: 'Community Theater Group',
        auditionDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
        deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
        location: '123 Main St, City, State',
        contactEmail: 'director@theater.com',
        contactPhone: '(555) 123-4567',
        status: 'active',
        userId: 'test-user-123',
        characters: {
          create: [
            {
              name: 'Cinderella',
              description: 'A kind-hearted young woman who dreams of a better life',
              gender: 'Female',
              ageRange: '18-25',
              vocalRange: 'Soprano',
              notes: 'Must be able to sing and dance'
            },
            {
              name: 'The Baker',
              description: 'A determined baker on a quest to break a curse',
              gender: 'Male',
              ageRange: '25-35',
              vocalRange: 'Baritone',
              notes: 'Strong acting and singing required'
            }
          ]
        },
        auditionMaterials: {
          create: [
            {
              type: 'script',
              fileName: 'audition-sides.pdf',
              fileUrl: 'https://example.com/audition-sides.pdf',
              fileSize: 1024000,
              mimeType: 'application/pdf'
            }
          ]
        }
      }
    })
    
    console.log('✅ Test show created:', testShow.id)
    
    // Create expired show for deadline testing
    const expiredShow = await prisma.show.create({
      data: {
        id: 'expired-show',
        title: 'Expired Show',
        description: 'A show with a passed deadline',
        director: 'Test Director',
        contactEmail: 'director@theater.com',
        deadline: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
        status: 'active',
        userId: 'test-user-123'
      }
    })
    
    console.log('✅ Expired show created:', expiredShow.id)
    
    console.log('\n🎉 Test data setup complete!')
    console.log('📋 Test shows available:')
    console.log(`   - http://localhost:3000/shows/test-show-123`)
    console.log(`   - http://localhost:3000/shows/expired-show`)
    
  } catch (error) {
    console.error('❌ Error setting up test data:', error)
  } finally {
    await prisma.$disconnect()
  }
}

setupTestData()
