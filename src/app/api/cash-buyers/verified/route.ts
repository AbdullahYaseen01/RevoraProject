import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/db'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const q = searchParams.get('q') || undefined
    const market = searchParams.get('market') || undefined
    const take = Math.min(parseInt(searchParams.get('limit') || '20', 10), 100)
    const skip = Math.max(parseInt(searchParams.get('offset') || '0', 10), 0)

    const where: any = {
      role: 'CASH_BUYER',
      cashBuyerProfile: { verificationStatus: 'VERIFIED' }
    }

    if (market) {
      where.profile = { marketsOfInterest: { has: market } }
    }
    if (q) {
      where.OR = [
        { email: { contains: q, mode: 'insensitive' } },
        { profile: { legalName: { contains: q, mode: 'insensitive' } } },
        { profile: { mailingAddress: { contains: q, mode: 'insensitive' } } },
      ]
    }

    const [results, total] = await Promise.all([
      prisma.user.findMany({
        where,
        select: {
          id: true,
          email: true,
          phone: true,
          profile: true,
          cashBuyerProfile: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take,
      }),
      prisma.user.count({ where })
    ])

    return NextResponse.json({ results, total, limit: take, offset: skip })
  } catch (e: any) {
    console.error(e)
    return NextResponse.json({ error: e.message || 'Failed' }, { status: 500 })
  }
}


