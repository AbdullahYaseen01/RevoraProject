import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { prisma } from '@/lib/db'
import qrcode from 'qrcode'

export async function GET() {
  const session = await getServerSession(authOptions as any)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const speakeasy = require('speakeasy')
  const secret = speakeasy.generateSecret({ name: 'Revara (2FA)' })

  const otpauth = secret.otpauth_url
  const svg = await qrcode.toString(otpauth, { type: 'svg' })

  // Temporarily store secret on user until verified
  await prisma.user.update({ where: { id: session.user.id }, data: { twoFactorSecret: secret.base32 } })

  return NextResponse.json({ otpauth, svg })
}

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions as any)
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const { token } = await request.json()
  if (!token) {
    return NextResponse.json({ error: 'Token required' }, { status: 400 })
  }

  const user = await prisma.user.findUnique({ where: { id: session.user.id } })
  if (!user?.twoFactorSecret) {
    return NextResponse.json({ error: 'No 2FA secret found' }, { status: 400 })
  }

  const speakeasy = require('speakeasy')
  const verified = speakeasy.totp.verify({
    secret: user.twoFactorSecret,
    encoding: 'base32',
    token,
    window: 2
  })

  if (!verified) {
    return NextResponse.json({ error: 'Invalid 2FA token' }, { status: 400 })
  }

  await prisma.user.update({ where: { id: user.id }, data: { twoFactorEnabled: true } })
  return NextResponse.json({ success: true })
}


