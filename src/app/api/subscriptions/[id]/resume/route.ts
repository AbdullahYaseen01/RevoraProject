import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { StripeSubscriptionService } from '@/lib/stripe';
import { ApiResponse } from '@/types/stripe';

// POST /api/subscriptions/[id]/resume - Resume a canceled subscription
export async function POST(
  request: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Unauthorized'
      }, { status: 401 });
    }

    // Verify subscription belongs to user
    const { id } = await context.params;
    const existingSubscription = await db.subscription.findFirst({
      where: {
        id,
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

    // Resume subscription in Stripe
    const resumedSubscription = await StripeSubscriptionService.resumeSubscription(
      existingSubscription.stripeSubscriptionId
    );

    // Update subscription in database
    const updatedSubscription = await db.subscription.update({
      where: { id },
      data: {
        status: resumedSubscription.status,
        cancelAtPeriodEnd: resumedSubscription.cancel_at_period_end
      }
    });

    return NextResponse.json<ApiResponse>({
      success: true,
      data: updatedSubscription,
      message: 'Subscription resumed successfully'
    });

  } catch (error) {
    console.error('Error resuming subscription:', error);
    return NextResponse.json<ApiResponse>({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to resume subscription'
    }, { status: 500 });
  }
}
