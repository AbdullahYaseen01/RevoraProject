import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function POST(req: NextRequest) {
  const session = (await getServerSession(authOptions as any)) as { user?: { id?: string } } | null
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  try {
    const body = await req.json()
    const { method, passed } = body
    const up = await prisma.cashBuyerProfile.upsert({
      where: { userId: session.user.id },
      update: { kycVerified: !!passed },
      create: { userId: session.user.id, investmentCriteria: {}, kycVerified: !!passed, verificationStatus: "PENDING" }
    })
    return NextResponse.json({ success: true, profile: up })
  } catch (e: any) {
    console.error(e)
    return NextResponse.json({ error: e.message || "Failed" }, { status: 500 })
  }
}


