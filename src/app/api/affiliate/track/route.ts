import { NextRequest, NextResponse } from "next/server"
import { AffiliateService } from "@/lib/affiliate"

export async function POST(req: NextRequest) {
  try {
    const { referralCode, userId } = await req.json()

    if (!referralCode || !userId) {
      return NextResponse.json({ error: "Missing referral code or user ID" }, { status: 400 })
    }

    const referral = await AffiliateService.trackReferral(referralCode, userId)
    return NextResponse.json({ success: true, referral })
  } catch (error: any) {
    console.error("Track referral error:", error)
    return NextResponse.json({ 
      error: error.message || "Failed to track referral" 
    }, { status: 500 })
  }
}
