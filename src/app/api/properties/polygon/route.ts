import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

type Point = [number, number] // [lat, lng]

function pointInPolygon(point: Point, vs: Point[]) {
  const x = point[1], y = point[0]
  let inside = false
  for (let i = 0, j = vs.length - 1; i < vs.length; j = i++) {
    const xi = vs[i][1], yi = vs[i][0]
    const xj = vs[j][1], yj = vs[j][0]
    const intersect = ((yi > y) !== (yj > y)) && (x < (xj - xi) * (y - yi) / ((yj - yi) || 1e-9) + xi)
    if (intersect) inside = !inside
  }
  return inside
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const polygon: Point[] = body?.polygon
    if (!polygon || !Array.isArray(polygon) || polygon.length < 3) {
      return NextResponse.json({ error: 'Invalid polygon' }, { status: 400 })
    }
    const props = await prisma.property.findMany({ where: { latitude: { not: null }, longitude: { not: null } }, take: 2000 })
    const results = props.filter(p => pointInPolygon([p.latitude as number, p.longitude as number], polygon)).map(p => ({
      id: p.rentcastId,
      address: p.address,
      city: p.city,
      state: p.state,
      zipCode: p.zipCode,
      latitude: p.latitude || undefined,
      longitude: p.longitude || undefined,
      beds: p.beds || undefined,
      baths: p.baths || undefined,
      squareFeet: p.squareFeet || undefined,
      lastSalePrice: p.lastSalePrice || undefined,
      propertyType: p.propertyType || undefined,
    }))
    return NextResponse.json({ results })
  } catch (e: any) {
    console.error(e)
    return NextResponse.json({ error: e.message || 'Polygon search failed' }, { status: 500 })
  }
}


