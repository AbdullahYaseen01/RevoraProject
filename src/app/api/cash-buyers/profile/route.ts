import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function POST(req: NextRequest) {
  const session = (await getServerSession(authOptions as any)) as { user?: { id?: string } } | null
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  try {
    const body = await req.json()
    const { legalName, businessEntity, companyName, mailingAddress, marketsOfInterest, contactPreferences } = body
    const up = await prisma.userProfile.upsert({
      where: { userId: session.user.id },
      update: { legalName, businessEntity, companyName, mailingAddress, marketsOfInterest, contactPreferences },
      create: { userId: session.user.id, legalName, businessEntity, companyName, mailingAddress, marketsOfInterest: marketsOfInterest||[], contactPreferences: contactPreferences||[] }
    })
    return NextResponse.json({ success: true, profile: up })
  } catch (e: any) {
    console.error(e)
    return NextResponse.json({ error: e.message || "Failed" }, { status: 500 })
  }
}


