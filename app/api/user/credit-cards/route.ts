import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/src/lib/auth'
import { prisma } from '@/src/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const userId = (session.user as { id?: string }).id!
  const cards = await prisma.userCreditCard.findMany({ where: { userId } })
  return NextResponse.json({ cards })
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const userId = (session.user as { id?: string }).id!
  const body = await req.json()

  if (Array.isArray(body)) {
    await prisma.userCreditCard.deleteMany({ where: { userId } })
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const cards = await prisma.userCreditCard.createMany({
      data: body.map((c: Record<string, unknown>) => ({ ...c, userId })) as any,
    })
    return NextResponse.json({ cards })
  }

  const card = await prisma.userCreditCard.create({ data: { ...body, userId } })
  return NextResponse.json({ card })
}

export async function DELETE() {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const userId = (session.user as { id?: string }).id!
  await prisma.userCreditCard.deleteMany({ where: { userId } })
  return NextResponse.json({ success: true })
}
