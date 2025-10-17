import { NextRequest, NextResponse } from "next/server"
import { getPropertyById } from "@/lib/rentcast"
import { prisma } from "@/lib/db"

type Params = { params: { id: string } }

export async function GET(_req: NextRequest, { params }: Params) {
  try {
    const id = params.id
    const data = await getPropertyById(id)
    if (!data) return NextResponse.json({ error: "Not found" }, { status: 404 })

    await prisma.property.upsert({
      where: { rentcastId: data.id },
      update: {
        address: data.address,
        city: data.city,
        state: data.state,
        zipCode: data.zipCode,
        latitude: data.latitude,
        longitude: data.longitude,
        beds: data.beds ?? undefined,
        baths: data.baths ?? undefined,
        squareFeet: data.squareFeet ?? undefined,
        yearBuilt: data.yearBuilt ?? undefined,
        lastSalePrice: data.lastSalePrice ?? undefined,
        propertyType: data.propertyType ?? undefined,
      },
      create: {
        rentcastId: data.id,
        address: data.address,
        city: data.city,
        state: data.state,
        zipCode: data.zipCode,
        latitude: data.latitude,
        longitude: data.longitude,
        beds: data.beds ?? undefined,
        baths: data.baths ?? undefined,
        squareFeet: data.squareFeet ?? undefined,
        yearBuilt: data.yearBuilt ?? undefined,
        lastSalePrice: data.lastSalePrice ?? undefined,
        propertyType: data.propertyType ?? undefined,
      }
    })

    return NextResponse.json({ property: data })
  } catch (e: any) {
    console.error(e)
    return NextResponse.json({ error: e.message || "Failed" }, { status: 500 })
  }
}


