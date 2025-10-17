import { NextRequest, NextResponse } from "next/server"
import { AffiliateService } from "@/lib/affiliate"

export async function POST(req: NextRequest) {
  try {
    const { userId, subscriptionId, subscriptionAmount } = await req.json()

    if (!userId || !subscriptionId || !subscriptionAmount) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    const commission = await AffiliateService.convertReferral(userId, subscriptionId, subscriptionAmount)
    
    if (!commission) {
      return NextResponse.json({ message: "No referral found for this user" }, { status: 200 })
    }

    return NextResponse.json({ success: true, commission })
  } catch (error: any) {
    console.error("Convert referral error:", error)
    return NextResponse.json({ 
      error: error.message || "Failed to convert referral" 
    }, { status: 500 })
  }
}
