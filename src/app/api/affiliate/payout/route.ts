import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { CommissionPaymentService } from "@/lib/commission-payments"
import { AffiliateService } from "@/lib/affiliate"

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const profile = await AffiliateService.getAffiliateProfile(session.user.id)
    if (!profile) {
      return NextResponse.json({ error: "No affiliate profile found" }, { status: 404 })
    }

    const result = await CommissionPaymentService.requestManualPayout(profile.id)
    return NextResponse.json(result)
  } catch (error: any) {
    console.error("Payout request error:", error)
    return NextResponse.json({ 
      error: error.message || "Failed to process payout request" 
    }, { status: 500 })
  }
}

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const profile = await AffiliateService.getAffiliateProfile(session.user.id)
    if (!profile) {
      return NextResponse.json({ error: "No affiliate profile found" }, { status: 404 })
    }

    const [payoutHistory, pendingAmount] = await Promise.all([
      CommissionPaymentService.getPayoutHistory(profile.id),
      CommissionPaymentService.getPendingPayoutAmount(profile.id)
    ])

    return NextResponse.json({
      payoutHistory,
      pendingAmount
    })
  } catch (error: any) {
    console.error("Get payout info error:", error)
    return NextResponse.json({ 
      error: error.message || "Failed to get payout information" 
    }, { status: 500 })
  }
}
