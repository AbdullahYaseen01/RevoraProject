import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { StripePaymentService } from '@/lib/stripe';
import { ApiResponse } from '@/types/stripe';

// GET /api/payments/[id] - Get specific payment
export async function GET(
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

    const { id } = await context.params;
    const payment = await db.payment.findFirst({
      where: {
        id,
        userId: session.user.id
      },
      include: {
        subscription: {
          select: {
            id: true,
            tier: true,
            status: true
          }
        }
      }
    });

    if (!payment) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Payment not found'
      }, { status: 404 });
    }

    return NextResponse.json<ApiResponse>({
      success: true,
      data: payment
    });

  } catch (error) {
    console.error('Error fetching payment:', error);
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Failed to fetch payment'
    }, { status: 500 });
  }
}

// POST /api/payments/[id]/confirm - Confirm payment intent
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

    const body = await request.json();
    const { paymentMethodId } = body;

    // Get payment from database
    const { id } = await context.params;
    const payment = await db.payment.findFirst({
      where: {
        id,
        userId: session.user.id
      }
    });

    if (!payment) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Payment not found'
      }, { status: 404 });
    }

    if (!payment.stripePaymentIntentId) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Stripe payment intent not found'
      }, { status: 400 });
    }

    // Confirm payment intent in Stripe
    const confirmedPaymentIntent = await StripePaymentService.confirmPaymentIntent(
      payment.stripePaymentIntentId,
      paymentMethodId
    );

    // Update payment in database
    const updatedPayment = await db.payment.update({
      where: { id },
      data: {
        status: confirmedPaymentIntent.status,
        paymentMethodId: paymentMethodId || payment.paymentMethodId,
        updatedAt: new Date()
      }
    });

    return NextResponse.json<ApiResponse>({
      success: true,
      data: updatedPayment,
      message: 'Payment confirmed successfully'
    });

  } catch (error) {
    console.error('Error confirming payment:', error);
    return NextResponse.json<ApiResponse>({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to confirm payment'
    }, { status: 500 });
  }
}
