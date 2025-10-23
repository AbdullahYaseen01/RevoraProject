import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET(request: NextRequest) {
  try {
    // Get counts for all major tables
    const [
      userCount,
      propertyCount,
      searchCount,
      contactCount,
      subscriptionCount,
      paymentCount,
      affiliateCount,
      referralCount
    ] = await Promise.all([
      prisma.user.count(),
      prisma.property.count(),
      prisma.search.count(),
      prisma.contact.count(),
      prisma.subscription.count(),
      prisma.payment.count(),
      prisma.affiliateProfile.count(),
      prisma.referral.count()
    ]);

    // Get some sample data
    const recentUsers = await prisma.user.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        email: true,
        role: true,
        createdAt: true,
        isEmailVerified: true
      }
    });

    const recentSearches = await prisma.search.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        userId: true,
        searchParams: true,
        createdAt: true
      }
    });

    return NextResponse.json({
      success: true,
      message: "Database statistics retrieved successfully",
      timestamp: new Date().toISOString(),
      counts: {
        users: userCount,
        properties: propertyCount,
        searches: searchCount,
        contacts: contactCount,
        subscriptions: subscriptionCount,
        payments: paymentCount,
        affiliates: affiliateCount,
        referrals: referralCount
      },
      sampleData: {
        recentUsers,
        recentSearches
      }
    });
  } catch (error) {
    console.error("Database stats error:", error);
    return NextResponse.json({
      success: false,
      error: error instanceof Error ? error.message : "Database error",
      timestamp: new Date().toISOString()
    }, { status: 500 });
  }
}

