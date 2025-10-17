import { NextRequest, NextResponse } from "next/server"
import { mapboxService } from "@/lib/mapbox"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const lng = searchParams.get("lng")
    const lat = searchParams.get("lat")
    
    if (!lng || !lat) {
      return NextResponse.json({ error: "Longitude (lng) and latitude (lat) parameters are required" }, { status: 400 })
    }

    const coordinates: [number, number] = [Number(lng), Number(lat)]
    
    if (isNaN(coordinates[0]) || isNaN(coordinates[1])) {
      return NextResponse.json({ error: "Invalid coordinates provided" }, { status: 400 })
    }

    const limit = searchParams.get("limit") ? Number(searchParams.get("limit")) : 1
    const types = searchParams.get("types")?.split(",")
    const language = searchParams.get("language") || "en"

    const results = await mapboxService.reverseGeocode(coordinates, {
      limit,
      types,
      language
    })

    return NextResponse.json(results)
  } catch (error: any) {
    console.error("Reverse geocoding error:", error)
    return NextResponse.json({ 
      error: error.message || "Reverse geocoding failed",
      type: "reverse_geocoding_error"
    }, { status: 500 })
  }
}
