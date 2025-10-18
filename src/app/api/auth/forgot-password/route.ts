import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { sendPasswordResetEmail, generateToken } from '@/lib/email'
import bcrypt from 'bcryptjs'

// Start password reset - send email with token
export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json()
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 })
    }

    // Always respond success to avoid email enumeration
    const user = await prisma.user.findUnique({ where: { email } })
    if (!user) {
      return NextResponse.json({ success: true })
    }

    const token = generateToken()
    const expires = new Date(Date.now() + 60 * 60 * 1000) // 1 hour

    await prisma.emailVerification.create({
      data: {
        email,
        token,
        expires,
        type: 'password_reset',
      }
    })

    await sendPasswordResetEmail(email, token)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Forgot password error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// Complete reset by providing token + new password
export async function PUT(request: NextRequest) {
  try {
    const { token, password } = await request.json()
    if (!token || !password) {
      return NextResponse.json({ error: 'Token and password are required' }, { status: 400 })
    }

    const record = await prisma.emailVerification.findUnique({ where: { token } })
    if (!record || record.used || record.expires < new Date() || record.type !== 'password_reset') {
      return NextResponse.json({ error: 'Invalid or expired token' }, { status: 400 })
    }

    const hashed = await bcrypt.hash(password, 10)
    await prisma.user.update({ where: { email: record.email }, data: { password: hashed } })
    await prisma.emailVerification.update({ where: { id: record.id }, data: { used: true } })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Reset password error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// (Removed duplicate POST handler)
