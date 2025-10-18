import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json()

    if (!token) {
      return NextResponse.json(
        { error: 'Verification token is required' },
        { status: 400 }
      )
    }

    // Find the verification token
    const verification = await prisma.emailVerification.findUnique({
      where: { token }
    })

    if (!verification || verification.used || verification.expires < new Date()) {
      return NextResponse.json(
        { error: 'Invalid or expired verification token' },
        { status: 400 }
      )
    }

    // Update user email verification status
    await prisma.user.update({
      where: { email: verification.email },
      data: {
        isEmailVerified: true,
        emailVerified: new Date()
      }
    })

    // Mark token as used
    await prisma.emailVerification.update({
      where: { id: verification.id },
      data: { used: true }
    })

    return NextResponse.json({
      success: true,
      message: 'Email verified successfully'
    })
  } catch (error) {
    console.error('Email verification error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const token = searchParams.get('token')

    if (!token) {
      return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/auth/error?error=InvalidToken`)
    }

    // Find the verification token
    const verification = await prisma.emailVerification.findUnique({
      where: { token }
    })

    if (!verification || verification.used || verification.expires < new Date()) {
      return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/auth/error?error=InvalidToken`)
    }

    // Update user email verification status
    await prisma.user.update({
      where: { email: verification.email },
      data: {
        isEmailVerified: true,
        emailVerified: new Date()
      }
    })

    // Mark token as used
    await prisma.emailVerification.update({
      where: { id: verification.id },
      data: { used: true }
    })

    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/auth/signin?verified=true`)
  } catch (error) {
    console.error('Email verification error:', error)
    return NextResponse.redirect(`${process.env.NEXTAUTH_URL}/auth/error?error=VerificationFailed`)
  }
}
