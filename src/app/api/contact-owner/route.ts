import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

async function fakeSkiptrace(_address: string) {
  return { phones: ["+1-555-0100"], emails: ["owner@example.com"] }
}

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions as any)
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  try {
    const formData = await req.formData()
    const propertyId = String(formData.get("propertyId") || "")
    if (!propertyId) return NextResponse.json({ error: "Missing propertyId" }, { status: 400 })

    const property = await prisma.property.findFirst({ where: { rentcastId: propertyId } })
    const address = property?.address ?? ""

    const contactInfo = await fakeSkiptrace(address)

    await prisma.contact.create({
      data: {
        userId: session.user.id,
        propertyId: property?.id ?? (await ensurePropertyRow(propertyId)).id,
        contactType: "owner",
        status: "CONTACTED",
        contactInfo,
        cost: 0.1,
      }
    })

    return NextResponse.json({ success: true, contactInfo })
  } catch (e: any) {
    console.error(e)
    return NextResponse.json({ error: e.message || "Failed" }, { status: 500 })
  }
}

async function ensurePropertyRow(rentcastId: string) {
  return prisma.property.upsert({
    where: { rentcastId },
    update: {},
    create: {
      rentcastId,
      address: "",
      city: "",
      state: "",
      zipCode: "",
    }
  })
}


