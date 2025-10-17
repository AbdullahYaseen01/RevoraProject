import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function GET(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const searches = await prisma.search.findMany({
      where: {
        userId: session.user.id
      },
      orderBy: {
        createdAt: 'desc'
      },
      take: 50 // Limit to last 50 searches
    })

    return NextResponse.json({ searches })
  } catch (error: any) {
    console.error("Failed to fetch saved searches:", error)
    return NextResponse.json({ error: "Failed to fetch saved searches" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { searchParams, name } = await req.json()

    if (!searchParams) {
      return NextResponse.json({ error: "Search parameters are required" }, { status: 400 })
    }

    const search = await prisma.search.create({
      data: {
        userId: session.user.id,
        searchParams: {
          ...searchParams,
          name: name || `Search ${new Date().toLocaleDateString()}`
        }
      }
    })

    return NextResponse.json({ search })
  } catch (error: any) {
    console.error("Failed to save search:", error)
    return NextResponse.json({ error: "Failed to save search" }, { status: 500 })
  }
}
