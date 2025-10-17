import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { AffiliateService } from "@/lib/affiliate"

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const data = await req.json()
    const { businessType, instagram, tiktok, youtube, website, otherPlatforms, audienceSize, experience, whyJoin } = data

    // Validate required fields
    if (!businessType || !audienceSize || !experience || !whyJoin) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    // Check if user already has an affiliate profile
    const existingProfile = await AffiliateService.getAffiliateProfile(session.user.id)
    if (existingProfile) {
      return NextResponse.json({ error: "You already have an affiliate profile" }, { status: 400 })
    }

    // Create affiliate profile
    const socialMedia = {
      instagram: instagram || null,
      tiktok: tiktok || null,
      youtube: youtube || null,
      website: website || null,
      otherPlatforms: otherPlatforms || null
    }

    const affiliateProfile = await AffiliateService.createAffiliateProfile(session.user.id, {
      businessType,
      socialMedia
    })

    return NextResponse.json({ 
      success: true, 
      affiliateProfile,
      message: "Application submitted successfully. We'll review it and get back to you soon."
    })
  } catch (error: any) {
    console.error("Affiliate application error:", error)
    return NextResponse.json({ 
      error: error.message || "Failed to submit application" 
    }, { status: 500 })
  }
}