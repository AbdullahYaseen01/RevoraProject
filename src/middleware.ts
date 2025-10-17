import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'
import { SubscriptionTier } from '@/types/stripe'

// Note: Middleware runs on the Edge runtime. Do NOT import database/Prisma here.

export async function middleware(req: NextRequest) {
  const url = req.nextUrl
  const token = await getToken({ req: req as any, secret: process.env.NEXTAUTH_SECRET })

  // Skip middleware for public routes
  const publicRoutes = [
    '/',
    '/pricing',
    '/auth/signin',
    '/auth/signup',
    '/auth/forgot-password',
    '/auth/reset-password',
    '/auth/error',
    '/api/auth',
    '/api/webhooks',
    '/api/subscriptions/checkout',
    '/api/subscribe'
  ]

  if (publicRoutes.some(route => url.pathname.startsWith(route))) {
    return NextResponse.next()
  }

  // Read subscription info from the JWT only (no DB in middleware)
  const userTier = ((token as any)?.subscriptionTier as SubscriptionTier) || SubscriptionTier.STARTER
  const subscriptionStatus = (token as any)?.subscriptionStatus as string | undefined
  const cancelAtPeriodEnd = Boolean((token as any)?.subscriptionCancelAtPeriodEnd)
  const hasActiveSubscription = subscriptionStatus === 'active' || (subscriptionStatus === 'canceled' && cancelAtPeriodEnd)
  
  // Define access levels for different features
  const accessLevels = {
    // Basic features - available to all tiers
    basic: [SubscriptionTier.STARTER, SubscriptionTier.PRO, SubscriptionTier.ENTERPRISE],
    
    // Advanced features - require PRO or higher
    advanced: [SubscriptionTier.PRO, SubscriptionTier.ENTERPRISE],
    
    // Enterprise features - require ENTERPRISE
    enterprise: [SubscriptionTier.ENTERPRISE]
  }

  // Define protected routes and their required access levels
  const protectedRoutes = {
    // Cash buyer features - require PRO or higher
    '/cash-buyers': 'advanced',
    '/api/cash-buyers': 'advanced',
    '/api/contact-cash-buyer': 'advanced',
    
    // Owner contact features - require PRO or higher
    '/api/contact-owner': 'advanced',
    
    // Advanced property analysis - require PRO or higher
    '/api/properties/analyze': 'advanced',
    
    // Enterprise features
    '/admin': 'enterprise',
    '/api/admin': 'enterprise',
    
    // Subscription management - require active subscription
    '/subscription': 'basic',
    '/api/subscriptions': 'basic',
    '/api/payments': 'basic'
  }

  // Check if route requires subscription access
  const requiredAccess = getRequiredAccessLevel(url.pathname, protectedRoutes)
  
  if (requiredAccess) {
    // Check if user is authenticated
    if (!token?.sub) {
      const redirect = new URL('/auth/signin', url.origin)
      redirect.searchParams.set('callbackUrl', url.pathname)
      return NextResponse.redirect(redirect)
    }

    // Check if user has active subscription
    if (!hasActiveSubscription) {
      const redirect = new URL('/pricing', url.origin)
      redirect.searchParams.set('reason', 'subscription_required')
      if (url.pathname.startsWith('/api/')) {
        return NextResponse.json({ 
          error: 'Active subscription required',
          code: 'SUBSCRIPTION_REQUIRED',
          upgradeUrl: '/pricing'
        }, { status: 402 })
      }
      return NextResponse.redirect(redirect)
    }

    // Check if user has required access level
    const hasAccess = checkAccessLevel(userTier, requiredAccess, accessLevels)
    
    if (!hasAccess) {
      const redirect = new URL('/pricing', url.origin)
      redirect.searchParams.set('reason', 'upgrade_required')
      redirect.searchParams.set('required_tier', requiredAccess)
      
      if (url.pathname.startsWith('/api/')) {
        return NextResponse.json({ 
          error: `Upgrade to ${requiredAccess.toUpperCase()} to access this feature`,
          code: 'INSUFFICIENT_TIER',
          currentTier: userTier,
          requiredTier: requiredAccess,
          upgradeUrl: '/pricing'
        }, { status: 402 })
      }
      return NextResponse.redirect(redirect)
    }
  }

  return NextResponse.next()
}

// Helper function to get required access level for a path
function getRequiredAccessLevel(pathname: string, protectedRoutes: Record<string, string>): string | null {
  for (const [route, accessLevel] of Object.entries(protectedRoutes)) {
    if (pathname.startsWith(route)) {
      return accessLevel
    }
  }
  return null
}

// Helper function to check if user has required access level
function checkAccessLevel(
  userTier: SubscriptionTier, 
  requiredLevel: string, 
  accessLevels: Record<string, SubscriptionTier[]>
): boolean {
  const requiredTiers = accessLevels[requiredLevel]
  if (!requiredTiers) return false
  
  return requiredTiers.includes(userTier)
}

export const config = {
  matcher: [
    '/cash-buyers/:path*',
    '/api/cash-buyers/:path*',
    '/api/contact-owner',
    '/api/contact-cash-buyer',
    '/api/properties/analyze',
    '/admin/:path*',
    '/api/admin/:path*',
    '/subscription/:path*',
    '/api/subscriptions/:path*',
    '/api/payments/:path*'
  ]
}


