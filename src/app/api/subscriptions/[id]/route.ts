import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { StripeSubscriptionService } from '@/lib/stripe';
import { UpdateSubscriptionRequest, ApiResponse } from '@/types/stripe';
import { SubscriptionTier } from '@prisma/client';

// GET /api/subscriptions/[id] - Get specific subscription
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Unauthorized'
      }, { status: 401 });
    }

    const subscription = await db.subscription.findFirst({
      where: {
        id: params.id,
        userId: session.user.id
      },
      include: {
        user: {
          select: {
            id: true,
            email: true
          }
        },
        payments: {
          orderBy: { createdAt: 'desc' },
          take: 10
        },
        invoices: {
          orderBy: { createdAt: 'desc' },
          take: 10
        }
      }
    });

    if (!subscription) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Subscription not found'
      }, { status: 404 });
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      data: subscription
    });

  } catch (error) {
    console.error('Error fetching subscription:', error);
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Failed to fetch subscription'
    }, { status: 500 });
  }
}

// PUT /api/subscriptions/[id] - Update subscription
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Unauthorized'
      }, { status: 401 });
    }

    const body = await request.json();
    const { priceId, quantity, prorationBehavior, metadata } = body as UpdateSubscriptionRequest;

    // Verify subscription belongs to user
    const existingSubscription = await db.subscription.findFirst({
      where: {
        id: params.id,
        userId: session.user.id
      }
    });

    if (!existingSubscription) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Subscription not found'
      }, { status: 404 });
    }

    if (!existingSubscription.stripeSubscriptionId) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Stripe subscription not found'
      }, { status: 400 });
    }

    // Update subscription in Stripe
    const updatedStripeSubscription = await StripeSubscriptionService.updateSubscription({
      subscriptionId: existingSubscription.stripeSubscriptionId,
      priceId,
      quantity,
      prorationBehavior,
      metadata: {
        ...metadata,
        userId: session.user.id
      }
    });

    // Update subscription in database
    const updatedSubscription = await db.subscription.update({
      where: { id: params.id },
      data: {
        status: updatedStripeSubscription.status,
        currentPeriodStart: new Date(updatedStripeSubscription.current_period_start * 1000),
        currentPeriodEnd: new Date(updatedStripeSubscription.current_period_end * 1000),
        cancelAtPeriodEnd: updatedStripeSubscription.cancel_at_period_end,
        ...(priceId && {
          tier: updatedStripeSubscription.items.data[0]?.price.id === process.env.STRIPE_PRICE_ID_STARTER ? SubscriptionTier.STARTER :
               updatedStripeSubscription.items.data[0]?.price.id === process.env.STRIPE_PRICE_ID_PRO ? SubscriptionTier.PRO :
               updatedStripeSubscription.items.data[0]?.price.id === process.env.STRIPE_PRICE_ID_ENTERPRISE ? SubscriptionTier.ENTERPRISE :
               existingSubscription.tier
        })
      }
    });

    // Update user's subscription tier if changed
    if (priceId) {
      await db.user.update({
        where: { id: session.user.id },
        data: { subscriptionTier: updatedSubscription.tier }
      });
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      data: updatedSubscription,
      message: 'Subscription updated successfully'
    });

  } catch (error) {
    console.error('Error updating subscription:', error);
    return NextResponse.json<ApiResponse>({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update subscription'
    }, { status: 500 });
  }
}

// DELETE /api/subscriptions/[id] - Cancel subscription
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Unauthorized'
      }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const cancelAtPeriodEnd = searchParams.get('cancelAtPeriodEnd') !== 'false';

    // Verify subscription belongs to user
    const existingSubscription = await db.subscription.findFirst({
      where: {
        id: params.id,
        userId: session.user.id
      }
    });

    if (!existingSubscription) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Subscription not found'
      }, { status: 404 });
    }

    if (!existingSubscription.stripeSubscriptionId) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Stripe subscription not found'
      }, { status: 400 });
    }

    // Cancel subscription in Stripe
    const canceledSubscription = await StripeSubscriptionService.cancelSubscription(
      existingSubscription.stripeSubscriptionId,
      cancelAtPeriodEnd
    );

    // Update subscription in database
    const updatedSubscription = await db.subscription.update({
      where: { id: params.id },
      data: {
        status: canceledSubscription.status,
        cancelAtPeriodEnd: canceledSubscription.cancel_at_period_end,
        ...(canceledSubscription.canceled_at && {
          currentPeriodEnd: new Date(canceledSubscription.canceled_at * 1000)
        })
      }
    });

    // If canceled immediately, update user's subscription tier
    if (!cancelAtPeriodEnd) {
      await db.user.update({
        where: { id: session.user.id },
        data: { subscriptionTier: SubscriptionTier.STARTER }
      });
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      data: updatedSubscription,
      message: cancelAtPeriodEnd 
        ? 'Subscription will be canceled at the end of the current period'
        : 'Subscription canceled immediately'
    });

  } catch (error) {
    console.error('Error canceling subscription:', error);
    return NextResponse.json<ApiResponse>({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to cancel subscription'
    }, { status: 500 });
  }
}
