import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

type Bounds = { north: number; south: number; east: number; west: number }

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const bounds: Bounds | undefined = body?.bounds
    if (!bounds) return NextResponse.json({ error: "Missing bounds" }, { status: 400 })

    const properties = await prisma.property.findMany({
      where: {
        latitude: { gte: bounds.south, lte: bounds.north },
        longitude: { gte: bounds.west, lte: bounds.east },
      },
      take: 500,
    })

    // Mark all as distressed for now (stub). Replace with real logic later.
    const distressed = properties.map(p => ({
      id: p.rentcastId,
      address: p.address,
      city: p.city,
      state: p.state,
      zipCode: p.zipCode,
      latitude: p.latitude,
      longitude: p.longitude,
      beds: p.beds ?? undefined,
      baths: p.baths ?? undefined,
      squareFeet: p.squareFeet ?? undefined,
      lastSalePrice: p.lastSalePrice ?? undefined,
      propertyType: p.propertyType ?? undefined,
      distressed: true,
    }))

    return NextResponse.json({ results: distressed })
  } catch (e: any) {
    console.error(e)
    return NextResponse.json({ error: e.message || "Analyze failed" }, { status: 500 })
  }
}


