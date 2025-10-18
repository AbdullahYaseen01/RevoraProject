import { NextRequest, NextResponse } from "next/server"
import { mapboxService } from "@/lib/mapbox"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const query = searchParams.get("q")
    
    if (!query) {
      return NextResponse.json({ error: "Query parameter 'q' is required" }, { status: 400 })
    }

    const limit = searchParams.get("limit") ? Number(searchParams.get("limit")) : 5
    const proximity = searchParams.get("proximity")?.split(",").map(Number) as [number, number] | undefined
    const bbox = searchParams.get("bbox")?.split(",").map(Number) as [number, number, number, number] | undefined
    const types = searchParams.get("types")?.split(",")
    const countryParam = searchParams.get("country")
    const country = countryParam === null ? undefined : countryParam
    const languageParam = searchParams.get("language")
    const language = (languageParam === null ? undefined : languageParam) || "en"

    const results = await mapboxService.geocode(query, {
      limit,
      proximity,
      bbox,
      types,
      country,
      language
    })

    return NextResponse.json(results)
  } catch (error: any) {
    console.error("Geocoding error:", error)
    return NextResponse.json({ 
      error: error.message || "Geocoding failed",
      type: "geocoding_error"
    }, { status: 500 })
  }
}
