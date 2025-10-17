import { NextRequest, NextResponse } from "next/server"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"
import { AffiliateService } from "@/lib/affiliate"

export async function POST(
  req: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Check if user is admin (you'll need to implement this check based on your user roles)
    // For now, we'll assume all authenticated users can access this
    // In production, you should check if session.user.role === 'ADMIN'

    await AffiliateService.rejectAffiliate(params.id)
    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Reject affiliate error:", error)
    return NextResponse.json({ 
      error: error.message || "Failed to reject affiliate" 
    }, { status: 500 })
  }
}
