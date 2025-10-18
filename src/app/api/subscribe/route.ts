import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"
import { getServerSession } from "next-auth"
import { authOptions } from "@/lib/auth"

export async function POST(req: NextRequest) {
  const session = (await getServerSession(authOptions as any)) as { user?: { id?: string } } | null
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  try {
    const body = await req.json()
    const { tier } = body as { tier: 'STARTER'|'PRO'|'ENTERPRISE' }
    if (!tier) return NextResponse.json({ error: 'Missing tier' }, { status: 400 })
    await prisma.subscription.upsert({
      where: { userId: session.user.id },
      update: { tier, status: 'active' },
      create: { userId: session.user.id, tier, status: 'active' }
    })
    await prisma.user.update({ where: { id: session.user.id }, data: { subscriptionTier: tier } })
    return NextResponse.json({ success: true })
  } catch (e: any) {
    console.error(e)
    return NextResponse.json({ error: e.message || "Failed" }, { status: 500 })
  }
}


