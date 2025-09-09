import { PrismaClient } from '@prisma/client'

// Database connection with fallback
const createPrismaClient = () => {
  try {
    return new PrismaClient({
      datasources: {
        db: {
          url: process.env.DATABASE_URL,
        },
      },
    })
  } catch (error) {
    console.error('Failed to create Prisma client:', error)
    throw error
  }
}

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const db = globalForPrisma.prisma ?? createPrismaClient()

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = db

// Database health check
export async function checkDatabaseHealth() {
  try {
    await db.$connect()
    const result = await db.$queryRaw`SELECT 1 as health_check`
    return { status: 'healthy', result }
  } catch (error) {
    console.error('Database health check failed:', error)
    return { status: 'unhealthy', error: error.message }
  }
}

// Graceful shutdown
process.on('beforeExit', async () => {
  await db.$disconnect()
})

// Database service functions
export class DatabaseService {
  // User operations
  static async createUser(userData: { id: string; email: string }) {
    return await db.user.create({
      data: userData,
    })
  }

  static async getUserById(id: string) {
    return await db.user.findUnique({
      where: { id },
      include: { shows: true },
    })
  }

  // Show operations
  static async createShow(showData: {
    title: string
    description?: string
    auditionDate?: Date
    showDate?: Date
    userId: string
  }) {
    return await db.show.create({
      data: showData,
    })
  }

  static async getShowsByUserId(userId: string) {
    return await db.show.findMany({
      where: { userId },
      include: { characters: true, applicants: true },
      orderBy: { createdAt: 'desc' },
    })
  }

  // Character operations
  static async createCharacter(characterData: {
    name: string
    description?: string
    showId: string
  }) {
    return await db.character.create({
      data: characterData,
    })
  }

  // Applicant operations
  static async createApplicant(applicantData: {
    name: string
    email: string
    phone?: string
    headshotUrl?: string
    resumeUrl?: string
    auditionFileUrl?: string
    showId: string
  }) {
    return await db.applicant.create({
      data: applicantData,
    })
  }

  static async getApplicantsByShowId(showId: string) {
    return await db.applicant.findMany({
      where: { showId },
      orderBy: { createdAt: 'desc' },
    })
  }
}
