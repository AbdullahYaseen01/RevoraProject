import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

async function fakeSkiptraceByBuyer(_buyerId: string) {
  return { phones: ["+1-555-0199"], emails: ["buyer@example.com"] }
}

export async function POST(req: NextRequest) {
  const session = (await getServerSession(authOptions as any)) as { user?: { id?: string } } | null
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })

  try {
    const body = await req.json()
    const buyerId = String(body.buyerId || "")
    if (!buyerId) return NextResponse.json({ error: "Missing buyerId" }, { status: 400 })

    const info = await fakeSkiptraceByBuyer(buyerId)
    // store as a contact record without propertyId (out of scope)
    await prisma.contact.create({
      data: {
        userId: session.user.id,
        propertyId: (await prisma.property.findFirst({ select: { id: true } }))?.id || (await prisma.property.create({ data: { rentcastId: `manual-${Date.now()}`, address: "", city: "", state: "", zipCode: "" } })).id,
        contactType: "cash_buyer",
        status: "CONTACTED",
        contactInfo: info,
        cost: 0.1,
      }
    })

    return NextResponse.json({ success: true, contactInfo: info })
  } catch (e: any) {
    console.error(e)
    return NextResponse.json({ error: e.message || "Failed" }, { status: 500 })
  }
}


