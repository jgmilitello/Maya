import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/src/lib/auth'
import { prisma } from '@/src/lib/prisma'

export async function GET(req: NextRequest) {
  const session = await getServerSession(authOptions)
  if (!session?.user) {
    return NextResponse.json({ completed: false })
  }

  const userId = (session.user as { id?: string }).id
  if (!userId) {
    return NextResponse.json({ completed: false })
  }

  const { searchParams } = new URL(req.url)
  const course = searchParams.get('course')
  if (!course) {
    return NextResponse.json({ error: 'Missing course param' }, { status: 400 })
  }

  const completion = await prisma.courseCompletion.findUnique({
    where: { userId_course: { userId, course } },
  })

  return NextResponse.json({ completed: !!completion })
}
