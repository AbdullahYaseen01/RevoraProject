import { NextRequest, NextResponse } from "next/server"

export async function GET(
  req: NextRequest,
  { params }: { params: { size: string } }
) {
  try {
    const { searchParams } = new URL(req.url)
    const ref = searchParams.get('ref')
    
    const size = params.size
    const [width, height] = size.split('x').map(Number)
    
    if (!width || !height) {
      return NextResponse.json({ error: "Invalid size format" }, { status: 400 })
    }

    // Generate SVG banner
    const svg = `
      <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" style="stop-color:#3B82F6;stop-opacity:1" />
            <stop offset="100%" style="stop-color:#1D4ED8;stop-opacity:1" />
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#grad1)"/>
        <text x="50%" y="50%" font-family="Arial, sans-serif" font-size="${Math.min(width, height) / 8}" font-weight="bold" text-anchor="middle" dominant-baseline="middle" fill="white">
          Real Estate Investment Platform
        </text>
        <text x="50%" y="70%" font-family="Arial, sans-serif" font-size="${Math.min(width, height) / 12}" text-anchor="middle" dominant-baseline="middle" fill="white" opacity="0.9">
          Find Profitable Properties • ${ref ? `Ref: ${ref}` : 'Join Now'}
        </text>
      </svg>
    `

    return new NextResponse(svg, {
      headers: {
        'Content-Type': 'image/svg+xml',
        'Cache-Control': 'public, max-age=3600'
      }
    })
  } catch (error: any) {
    console.error("Banner generation error:", error)
    return NextResponse.json({ 
      error: error.message || "Failed to generate banner" 
    }, { status: 500 })
  }
}
