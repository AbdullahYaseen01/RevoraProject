import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const city = searchParams.get("city") || undefined
    const zip = searchParams.get("zip") || undefined
    const address = searchParams.get("address") || undefined

    const buyers = await prisma.user.findMany({
      where: {
        role: "CASH_BUYER",
        OR: [
          city ? { profile: { marketsOfInterest: { has: city } } } : undefined,
          zip ? { profile: { marketsOfInterest: { has: zip } } } : undefined,
          address ? { profile: { mailingAddress: { contains: address, mode: 'insensitive' } } } : undefined,
        ].filter(Boolean) as any,
      },
      select: {
        id: true,
        email: true,
        phone: true,
        profile: true,
        cashBuyerProfile: true,
        createdAt: true,
      }
    })

    return NextResponse.json({ results: buyers })
  } catch (e: any) {
    console.error(e)
    return NextResponse.json({ error: e.message || "Search failed" }, { status: 500 })
  }
}


