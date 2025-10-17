import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { AffiliateService } from "@/lib/affiliate"

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

    return NextResponse.json(profile)
  } catch (error: any) {
    console.error("Get affiliate profile error:", error)
    return NextResponse.json({ 
      error: error.message || "Failed to get affiliate profile" 
    }, { status: 500 })
  }
}
