import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const city = searchParams.get("city") || undefined
    const zip = searchParams.get("zip") || undefined
    const address = searchParams.get("address") || undefined

    // Build the where clause more carefully
    const whereClause: any = {
      role: "CASH_BUYER"
    }

    // Only add OR conditions if we have search parameters
    if (city || zip || address) {
      const orConditions = []
      
      if (city) {
        orConditions.push({ profile: { marketsOfInterest: { has: city } } })
      }
      if (zip) {
        orConditions.push({ profile: { marketsOfInterest: { has: zip } } })
      }
      if (address) {
        orConditions.push({ profile: { mailingAddress: { contains: address, mode: 'insensitive' } } })
      }
      
      if (orConditions.length > 0) {
        whereClause.OR = orConditions
      }
    }

    const buyers = await prisma.user.findMany({
      where: whereClause,
      select: {
        id: true,
        email: true,
        phone: true,
        profile: true,
        cashBuyerProfile: true,
        createdAt: true,
      }
    })

    // Transform the data to match the expected format
    const transformedBuyers = buyers.map(buyer => {
      // Type-safe access to investmentCriteria JSON field
      const investmentCriteria = buyer.cashBuyerProfile?.investmentCriteria as any
      const dealHistory = buyer.cashBuyerProfile?.dealHistory as any
      
      return {
        id: buyer.id,
        name: buyer.profile?.legalName || buyer.profile?.companyName || 'Unknown',
        email: buyer.email,
        phone: buyer.phone || 'Not provided',
        location: buyer.profile?.mailingAddress || 'Not specified',
        investmentRange: buyer.cashBuyerProfile?.verifiedAmountRange || 'Not specified',
        propertyTypes: investmentCriteria?.propertyTypes || ['Residential'],
        verificationStatus: buyer.cashBuyerProfile?.verificationStatus || 'PENDING',
        dealHistory: Array.isArray(dealHistory) ? dealHistory.length : 0,
        lastActive: buyer.createdAt.toISOString(),
        rating: 4.5 // Default rating since we don't have this field yet
      }
    })

    return NextResponse.json({ 
      success: true, 
      data: transformedBuyers 
    })
  } catch (e: any) {
    console.error(e)
    return NextResponse.json({ 
      success: false, 
      error: e.message || "Search failed" 
    }, { status: 500 })
  }
}


