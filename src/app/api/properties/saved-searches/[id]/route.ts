import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { id } = await context.params
    const search = await prisma.search.findFirst({
      where: {
        id,
        userId: session.user.id
      }
    })

    if (!search) {
      return NextResponse.json({ error: "Search not found" }, { status: 404 })
    }

    await prisma.search.delete({
      where: {
        id
      }
    })

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error("Failed to delete saved search:", error)
    return NextResponse.json({ error: "Failed to delete saved search" }, { status: 500 })
  }
}
