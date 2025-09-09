import { NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

export async function GET() {
  const prisma = new PrismaClient()
  
  try {
    console.log('Testing database connection...')
    
    // Test basic connection
    await prisma.$connect()
    console.log('Database connected successfully')
    
    // Test a simple query that doesn't require tables
    const result = await prisma.$executeRaw`SELECT 1 as test`
    console.log('Raw query result:', result)
    
    // Try to create a test user and show
    try {
      const testUser = await prisma.user.upsert({
        where: { id: 'test-user-123' },
        update: {},
        create: {
          id: 'test-user-123',
          email: 'test@example.com'
        }
      })
      console.log('Test user created/found:', testUser.id)
      
      const testShow = await prisma.show.create({
        data: {
          title: 'Test Show',
          description: 'A test show for database verification',
          director: 'Test Director',
          contactEmail: 'test@example.com',
          status: 'draft',
          userId: testUser.id
        }
      })
      console.log('Test show created:', testShow.id)
      
      return NextResponse.json({ 
        success: true, 
        message: 'Database connection and tables working!',
        testQuery: result,
        testUser: testUser.id,
        testShow: testShow.id
      })
    } catch (tableError) {
      console.log('Tables not ready, but connection works:', tableError.message)
      return NextResponse.json({ 
        success: true, 
        message: 'Database connection successful, but tables need setup',
        testQuery: result,
        tableError: tableError.message
      })
    }
    
  } catch (error) {
    console.error('Database connection error:', error)
    return NextResponse.json(
      { 
        success: false, 
        error: 'Database connection failed',
        details: error instanceof Error ? error.message : 'Unknown error'
      },
      { status: 500 }
    )
  } finally {
    await prisma.$disconnect()
  }
}
