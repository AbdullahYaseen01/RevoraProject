import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions as any)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { bounds, latitude, longitude, radius, limit = 50 } = body

    console.log('🗺️ Map search request:', { bounds, latitude, longitude, radius })

    let where: any = {}

    // Map bounds filtering
    if (bounds) {
      where.latitude = {
        gte: bounds.south,
        lte: bounds.north
      }
      where.longitude = {
        gte: bounds.west,
        lte: bounds.east
      }
    } else if (latitude && longitude && radius) {
      // Simple radius search (approximate)
      const latRange = radius / 69 // Rough conversion: 1 degree ≈ 69 miles
      const lngRange = radius / (69 * Math.cos(latitude * Math.PI / 180))
      
      where.latitude = {
        gte: latitude - latRange,
        lte: latitude + latRange
      }
      where.longitude = {
        gte: longitude - lngRange,
        lte: longitude + lngRange
      }
    } else {
      // Default to San Francisco area if no bounds provided
      where.latitude = {
        gte: 37.7,
        lte: 37.8
      }
      where.longitude = {
        gte: -122.5,
        lte: -122.3
      }
    }

    // Only get properties with valid coordinates
    where.latitude = { ...where.latitude, not: null }
    where.longitude = { ...where.longitude, not: null }

    console.log('🔍 Database query where clause:', where)

    const properties = await prisma.property.findMany({
      where,
      take: limit,
      orderBy: { lastSaleDate: 'desc' },
      select: {
        id: true,
        rentcastId: true,
        address: true,
        city: true,
        state: true,
        zipCode: true,
        latitude: true,
        longitude: true,
        beds: true,
        baths: true,
        squareFeet: true,
        lotSize: true,
        yearBuilt: true,
        lastSalePrice: true,
        lastSaleDate: true,
        propertyType: true,
        status: true
      }
    })

    console.log(`✅ Found ${properties.length} properties for map display`)

    return NextResponse.json({
      success: true,
      data: properties,
      count: properties.length
    })

  } catch (error: any) {
    console.error('❌ Map search error:', error)
    return NextResponse.json({ 
      success: false, 
      error: error.message || "Map search failed" 
    }, { status: 500 })
  }
}
