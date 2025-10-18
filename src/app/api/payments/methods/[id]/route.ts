import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { ApiResponse } from '@/types/stripe';

// DELETE /api/payments/methods/[id] - Remove payment method
export async function DELETE(
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

    // Get payment method from database
    const { id } = await context.params;
    const paymentMethod = await db.paymentMethod.findFirst({
      where: {
        id,
        userId: session.user.id
      }
    });

    if (!paymentMethod) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Payment method not found'
      }, { status: 404 });
    }

    // Detach payment method from Stripe customer
    const stripe = (await import('@/lib/stripe')).default;
    if (!stripe) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Stripe is not configured'
      }, { status: 500 });
    }
    await stripe.paymentMethods.detach(paymentMethod.stripePaymentMethodId);

    // Remove payment method from database
    await db.paymentMethod.delete({
      where: { id }
    });

    return NextResponse.json<ApiResponse>({
      success: true,
      message: 'Payment method removed successfully'
    });

  } catch (error) {
    console.error('Error removing payment method:', error);
    return NextResponse.json<ApiResponse>({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to remove payment method'
    }, { status: 500 });
  }
}

// PUT /api/payments/methods/[id] - Update payment method (set as default)
export async function PUT(
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

    const body = await request.json();
    const { setAsDefault = false } = body;

    // Get payment method from database
    const { id } = await context.params;
    const paymentMethod = await db.paymentMethod.findFirst({
      where: {
        id,
        userId: session.user.id
      }
    });

    if (!paymentMethod) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Payment method not found'
      }, { status: 404 });
    }

    if (setAsDefault) {
      // Get user's Stripe customer ID
      const subscription = await db.subscription.findUnique({
        where: { userId: session.user.id },
        select: { stripeCustomerId: true }
      });

      if (subscription?.stripeCustomerId) {
        // Set as default in Stripe
        const stripe = (await import('@/lib/stripe')).default;
        if (stripe) {
          await stripe.customers.update(subscription.stripeCustomerId, {
            invoice_settings: {
              default_payment_method: paymentMethod.stripePaymentMethodId,
            },
          });
        }
      }

      // Update other payment methods to not be default
      await db.paymentMethod.updateMany({
        where: { 
          userId: session.user.id,
          id: { not: id }
        },
        data: { isDefault: false }
      });
    }

    // Update payment method in database
    const updatedPaymentMethod = await db.paymentMethod.update({
      where: { id },
      data: { isDefault: setAsDefault }
    });

    return NextResponse.json<ApiResponse>({
      success: true,
      data: updatedPaymentMethod,
      message: setAsDefault 
        ? 'Payment method set as default'
        : 'Payment method updated successfully'
    });

  } catch (error) {
    console.error('Error updating payment method:', error);
    return NextResponse.json<ApiResponse>({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to update payment method'
    }, { status: 500 });
  }
}
