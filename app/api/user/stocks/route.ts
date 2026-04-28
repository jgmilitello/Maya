import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/src/lib/auth'
import { prisma } from '@/src/lib/prisma'

export async function GET() {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const userId = (session.user as { id?: string }).id!
  const stocks = await prisma.userStock.findMany({ where: { userId } })
  return NextResponse.json({ stocks })
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const userId = (session.user as { id?: string }).id!
  const body = await req.json()

  // Supports bulk (array) or single object
  if (Array.isArray(body)) {
    // Replace all stocks for this user
    await prisma.userStock.deleteMany({ where: { userId } })
    const stocks = await prisma.userStock.createMany({
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      data: body.map((s: Record<string, unknown>) => ({ ...s, userId })) as any,
    })
    return NextResponse.json({ stocks })
  }

  const stock = await prisma.userStock.create({ data: { ...body, userId } })
  return NextResponse.json({ stock })
}

export async function DELETE() {
  const session = await getServerSession(authOptions)
  if (!session?.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const userId = (session.user as { id?: string }).id!
  await prisma.userStock.deleteMany({ where: { userId } })
  return NextResponse.json({ success: true })
}
