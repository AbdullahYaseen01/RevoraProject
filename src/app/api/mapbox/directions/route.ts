import { NextRequest, NextResponse } from "next/server"
import { mapboxService } from "@/lib/mapbox"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const waypoints = searchParams.get("waypoints")
    
    if (!waypoints) {
      return NextResponse.json({ error: "Waypoints parameter is required" }, { status: 400 })
    }

    // Parse waypoints: "lng1,lat1;lng2,lat2;lng3,lat3"
    const coordinates: [number, number][] = waypoints.split(";").map(wp => {
      const [lng, lat] = wp.split(",").map(Number)
      return [lng, lat]
    })

    if (coordinates.length < 2) {
      return NextResponse.json({ error: "At least 2 waypoints are required" }, { status: 400 })
    }

    const profile = searchParams.get("profile") as 'driving' | 'walking' | 'cycling' || 'driving'
    const alternatives = searchParams.get("alternatives") === "true"
    const geometries = searchParams.get("geometries") as 'geojson' | 'polyline' | 'polyline6' || 'geojson'
    const overview = searchParams.get("overview") as 'full' | 'simplified' | 'false' || 'full'
    const steps = searchParams.get("steps") === "true"
    const annotations = searchParams.get("annotations")?.split(",")
    const language = searchParams.get("language") || "en"
    const roundtrip = searchParams.get("roundtrip") === "true"
    const source = searchParams.get("source") as 'first' | 'any' || 'first'
    const destination = searchParams.get("destination") as 'last' | 'any' || 'last'

    const results = await mapboxService.getDirections(coordinates, {
      profile,
      alternatives,
      geometries,
      overview,
      steps,
      annotations,
      language,
      roundtrip,
      source,
      destination
    })

    return NextResponse.json(results)
  } catch (error: any) {
    console.error("Directions error:", error)
    return NextResponse.json({ 
      error: error.message || "Directions request failed",
      type: "directions_error"
    }, { status: 500 })
  }
}
