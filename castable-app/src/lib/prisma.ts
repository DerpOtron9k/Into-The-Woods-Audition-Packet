import { PrismaClient } from '@prisma/client'

function ensurePgbouncerFlags(url: string | undefined): string | undefined {
  if (!url) return url
  if (url.includes('pgbouncer=true')) return url
  const hasQuery = url.includes('?')
  const suffix = 'pgbouncer=true&connection_limit=1'
  return `${url}${hasQuery ? '&' : '?'}${suffix}`
}

const effectiveDatabaseUrl = ensurePgbouncerFlags(process.env.DATABASE_URL)

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

export const prisma = globalForPrisma.prisma ?? new PrismaClient({ datasourceUrl: effectiveDatabaseUrl })

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma

