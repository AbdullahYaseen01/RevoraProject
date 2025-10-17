import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions as any)
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  try {
    const body = await req.json()
    const { entityVerified } = body
    const up = await prisma.cashBuyerProfile.upsert({
      where: { userId: session.user.id },
      update: { entityVerified: !!entityVerified },
      create: { userId: session.user.id, investmentCriteria: {}, entityVerified: !!entityVerified, verificationStatus: "PENDING" }
    })
    return NextResponse.json({ success: true, profile: up })
  } catch (e: any) {
    console.error(e)
    return NextResponse.json({ error: e.message || "Failed" }, { status: 500 })
  }
}


