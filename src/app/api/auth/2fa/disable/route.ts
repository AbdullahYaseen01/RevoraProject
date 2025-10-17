import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'

export async function POST() {
  const session = await getServerSession(authOptions as any)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  await prisma.user.update({ where: { id: session.user.id }, data: { twoFactorEnabled: false, twoFactorSecret: null } })
  return NextResponse.json({ success: true })
}


