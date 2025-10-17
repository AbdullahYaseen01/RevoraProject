import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { StripeCheckoutService, StripeCustomerService } from '@/lib/stripe';
import { ApiResponse } from '@/types/stripe';

// POST /api/subscriptions/checkout - Create checkout session
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Unauthorized'
      }, { status: 401 });
    }

    const body = await request.json();
    const { priceId, successUrl, cancelUrl } = body;

    if (!priceId || !successUrl || !cancelUrl) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Price ID, success URL, and cancel URL are required'
      }, { status: 400 });
    }

    // Get or create Stripe customer
    let stripeCustomerId: string;
    const { db } = await import('@/lib/db');
    const existingSubscription = await db.subscription.findUnique({
      where: { userId: session.user.id }
    });

    if (existingSubscription?.stripeCustomerId) {
      stripeCustomerId = existingSubscription.stripeCustomerId;
    } else {
      // Create new Stripe customer
      const user = await db.user.findUnique({
        where: { id: session.user.id },
        select: { email: true, profile: { select: { legalName: true } } }
      });

      if (!user) {
        return NextResponse.json<ApiResponse>({
          success: false,
          error: 'User not found'
        }, { status: 404 });
      }

      const stripeCustomer = await StripeCustomerService.createCustomer(
        user.email,
        user.profile?.legalName || undefined,
        { userId: session.user.id }
      );

      stripeCustomerId = stripeCustomer.id;
    }

    // Create checkout session
    const checkoutSession = await StripeCheckoutService.createCheckoutSession(
      priceId,
      stripeCustomerId,
      successUrl,
      cancelUrl,
      { userId: session.user.id }
    );

    return NextResponse.json<ApiResponse<{ sessionId: string; url: string }>>({
      success: true,
      data: { 
        sessionId: checkoutSession.id,
        url: checkoutSession.url!
      },
      message: 'Checkout session created successfully'
    });

  } catch (error) {
    console.error('Error creating checkout session:', error);
    return NextResponse.json<ApiResponse>({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create checkout session'
    }, { status: 500 });
  }
}
