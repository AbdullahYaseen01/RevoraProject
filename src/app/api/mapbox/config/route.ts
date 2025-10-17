import { NextResponse } from "next/server"

export async function GET() {
  try {
    const accessToken = process.env.MAPBOX_API_KEY || process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN
    
    if (!accessToken) {
      return NextResponse.json({ 
        error: "Mapbox access token not found",
        hasToken: false 
      }, { status: 500 })
    }

    return NextResponse.json({ 
      hasToken: true,
      tokenLength: accessToken.length,
      tokenPrefix: accessToken.substring(0, 10) + '...'
    })
  } catch (error: any) {
    console.error("Mapbox config error:", error)
    return NextResponse.json({ 
      error: error.message || "Failed to get Mapbox config",
      hasToken: false 
    }, { status: 500 })
  }
}
