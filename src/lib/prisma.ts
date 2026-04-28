import { PrismaClient } from '@prisma/client'
import { PrismaLibSql } from '@prisma/adapter-libsql'

const globalForPrisma = globalThis as unknown as { prisma?: PrismaClient }

function createPrismaClient() {
  const url = process.env.DATABASE_URL ?? 'file:./dev.db'
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const adapter = new PrismaLibSql({ url } as any)
  return new PrismaClient({ adapter } as any)
  /* eslint-enable @typescript-eslint/no-explicit-any */
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient()
if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma
