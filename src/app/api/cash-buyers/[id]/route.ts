import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

type Params = { params: { id: string } }

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const buyer = await prisma.user.findUnique({
      where: { id: params.id },
      select: {
        id: true,
        email: true,
        phone: true,
        profile: true,
        cashBuyerProfile: true,
        createdAt: true,
      }
    })
    if (!buyer) return NextResponse.json({ error: "Not found" }, { status: 404 })
    return NextResponse.json({ buyer })
  } catch (e: any) {
    console.error(e)
    return NextResponse.json({ error: e.message || "Failed" }, { status: 500 })
  }
}


