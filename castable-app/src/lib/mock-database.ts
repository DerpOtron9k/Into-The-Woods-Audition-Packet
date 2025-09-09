import { PrismaClient } from '@prisma/client'

// Mock PostgreSQL service for development
// This maintains PRD compliance while allowing development to continue
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const db = globalForPrisma.prisma ?? new PrismaClient({
  datasources: {
    db: {
      url: process.env.DATABASE_URL || 'postgresql://mock:mock@localhost:5432/mock',
    },
  },
})

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db

// Mock database operations for development
export class MockDatabaseService {
  static async createUser(userData: { id: string; email: string }) {
    console.log('Mock: Creating user', userData)
    return { id: userData.id, email: userData.email, createdAt: new Date() }
  }

  static async createShow(showData: any) {
    console.log('Mock: Creating show', showData)
    return { id: 'mock-show-id', ...showData, createdAt: new Date() }
  }

  static async getShowsByUserId(userId: string) {
    console.log('Mock: Getting shows for user', userId)
    return []
  }
}

// Database health check
export async function checkDatabaseHealth() {
  return {
    status: 'mock',
    message: 'Using mock PostgreSQL for development',
    result: [{ health_check: '1' }]
  }
}

// Graceful shutdown
process.on('beforeExit', async () => {
  await db.$disconnect()
})