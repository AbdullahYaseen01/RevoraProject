import { NextRequest, NextResponse } from "next/server"
import { prisma } from "@/lib/db"

export async function GET(req: NextRequest) {
  try {
    console.log('🔍 Testing database connection...')
    
    // Test 1: Simple connection test
    await prisma.$queryRaw`SELECT 1 as test`
    console.log('✅ Database connection successful')
    
    // Test 2: Count users
    const userCount = await prisma.user.count()
    console.log('✅ User count:', userCount)
    
    // Test 3: Count searches
    const searchCount = await prisma.search.count()
    console.log('✅ Search count:', searchCount)
    
    // Test 4: Count subscriptions
    const subscriptionCount = await prisma.subscription.count()
    console.log('✅ Subscription count:', subscriptionCount)
    
    // Test 5: Get recent searches
    const recentSearches = await prisma.search.findMany({
      take: 5,
      orderBy: { createdAt: 'desc' },
      select: {
        id: true,
        userId: true,
        createdAt: true,
        searchParams: true
      }
    })
    console.log('✅ Recent searches:', recentSearches.length)
    
    return NextResponse.json({
      success: true,
      message: 'Database connection and operations successful',
      data: {
        connection: 'OK',
        userCount,
        searchCount,
        subscriptionCount,
        recentSearches: recentSearches.length,
        sampleSearch: recentSearches[0] || null
      }
    })
    
  } catch (error: any) {
    console.error('❌ Database test error:', error)
    return NextResponse.json({
      success: false,
      error: error.message,
      code: error.code
    }, { status: 500 })
  }
}
