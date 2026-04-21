import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/src/lib/auth'
import { prisma } from '@/src/lib/prisma'

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const userId = (session.user as { id?: string }).id
  if (!userId) {
    return NextResponse.json({ error: 'No user id' }, { status: 400 })
  }

  const { course } = await req.json()
  if (!course) {
    return NextResponse.json({ error: 'Missing course' }, { status: 400 })
  }

  await prisma.courseCompletion.upsert({
    where: { userId_course: { userId, course } },
    update: { completedAt: new Date() },
    create: { userId, course },
  })

  return NextResponse.json({ success: true })
}
