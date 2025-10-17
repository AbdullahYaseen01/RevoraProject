import { NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET() {
  try {
    const [totalAffiliates, totalCommissions, totalReferrals] = await Promise.all([
      prisma.affiliateProfile.count({
        where: { isApproved: true }
      }),
      prisma.commission.aggregate({
        where: { status: 'paid' },
        _sum: { amount: true }
      }),
      prisma.referral.count({
        where: { status: 'converted' }
      })
    ])

    return NextResponse.json({
      totalAffiliates,
      totalCommissions: totalCommissions._sum.amount || 0,
      totalReferrals
    })
  } catch (error: any) {
    console.error("Get public stats error:", error)
    return NextResponse.json({ 
      error: error.message || "Failed to get stats" 
    }, { status: 500 })
  }
}
