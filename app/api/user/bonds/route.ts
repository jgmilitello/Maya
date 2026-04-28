import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/src/lib/auth'
import { prisma } from '@/src/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const userId = (session.user as { id?: string }).id!
  const bonds = await prisma.userBond.findMany({ where: { userId } })
  return NextResponse.json({ bonds })
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const userId = (session.user as { id?: string }).id!
  const body = await req.json()

  if (Array.isArray(body)) {
    await prisma.userBond.deleteMany({ where: { userId } })
    const bonds = await prisma.userBond.createMany({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: body.map((b: Record<string, unknown>) => ({ ...b, userId })) as any,
    })
    return NextResponse.json({ bonds })
  }

  const bond = await prisma.userBond.create({ data: { ...body, userId } })
  return NextResponse.json({ bond })
}

export async function DELETE() {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const userId = (session.user as { id?: string }).id!
  await prisma.userBond.deleteMany({ where: { userId } })
  return NextResponse.json({ success: true })
}
