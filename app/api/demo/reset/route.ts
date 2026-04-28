import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/src/lib/auth'
import { prisma } from '@/src/lib/prisma'

export async function POST() {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const userId = (session.user as { id?: string }).id!

  // Wipe all financial data and reset onboarding flag
  await Promise.all([
    prisma.userStock.deleteMany({ where: { userId } }),
    prisma.userCreditCard.deleteMany({ where: { userId } }),
    prisma.userBond.deleteMany({ where: { userId } }),
    prisma.courseCompletion.deleteMany({ where: { userId } }),
    prisma.userFinancialProfile.deleteMany({ where: { userId } }),
  ])

  return NextResponse.json({ ok: true })
}
