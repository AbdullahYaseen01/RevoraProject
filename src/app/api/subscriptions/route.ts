import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { StripeSubscriptionService, StripeCustomerService } from '@/lib/stripe';
import { CreateSubscriptionRequest, ApiResponse, SubscriptionResponse } from '@/types/stripe';
import { SubscriptionTier } from '@prisma/client';

// GET /api/subscriptions - Get user's subscriptions
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Unauthorized'
      }, { status: 401 });
    }

    const subscriptions = await db.subscription.findMany({
      where: { userId: session.user.id },
      include: {
        user: {
          select: {
            id: true,
            email: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json<ApiResponse>({
      success: true,
      data: subscriptions
    });

  } catch (error) {
    console.error('Error fetching subscriptions:', error);
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Failed to fetch subscriptions'
    }, { status: 500 });
  }
}

// POST /api/subscriptions - Create a new subscription
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
    const { priceId, paymentMethodId, trialPeriodDays, metadata } = body as CreateSubscriptionRequest;

    if (!priceId) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Price ID is required'
      }, { status: 400 });
    }

    // Get or create Stripe customer
    let stripeCustomerId: string;
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

    // Create subscription in Stripe
    const subscriptionResponse = await StripeSubscriptionService.createSubscription({
      priceId,
      customerId: stripeCustomerId,
      paymentMethodId,
      trialPeriodDays,
      metadata: {
        ...metadata,
        userId: session.user.id
      }
    });

    // Save subscription to database
    const subscription = await db.subscription.upsert({
      where: { userId: session.user.id },
      update: {
        stripeCustomerId,
        stripeSubscriptionId: subscriptionResponse.subscription.id,
        tier: subscriptionResponse.subscription.tier as SubscriptionTier,
        status: subscriptionResponse.subscription.status,
        currentPeriodStart: subscriptionResponse.subscription.currentPeriodStart,
        currentPeriodEnd: subscriptionResponse.subscription.currentPeriodEnd,
        cancelAtPeriodEnd: subscriptionResponse.subscription.cancelAtPeriodEnd
      },
      create: {
        userId: session.user.id,
        stripeCustomerId,
        stripeSubscriptionId: subscriptionResponse.subscription.id,
        tier: subscriptionResponse.subscription.tier as SubscriptionTier,
        status: subscriptionResponse.subscription.status,
        currentPeriodStart: subscriptionResponse.subscription.currentPeriodStart,
        currentPeriodEnd: subscriptionResponse.subscription.currentPeriodEnd,
        cancelAtPeriodEnd: subscriptionResponse.subscription.cancelAtPeriodEnd
      }
    });

    // Update user's subscription tier
    await db.user.update({
      where: { id: session.user.id },
      data: { subscriptionTier: subscription.tier }
    });

    return NextResponse.json<ApiResponse<SubscriptionResponse>>({
      success: true,
      data: subscriptionResponse,
      message: 'Subscription created successfully'
    });

  } catch (error) {
    console.error('Error creating subscription:', error);
    return NextResponse.json<ApiResponse>({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create subscription'
    }, { status: 500 });
  }
}
