import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { StripePaymentService, StripeCustomerService } from '@/lib/stripe';
import { ApiResponse, PaymentResponse } from '@/types/stripe';

// GET /api/payments - Get user's payment history
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Unauthorized'
      }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '50');
    const offset = parseInt(searchParams.get('offset') || '0');

    const payments = await db.payment.findMany({
      where: { userId: session.user.id },
      include: {
        subscription: {
          select: {
            id: true,
            tier: true,
            status: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
      skip: offset
    });

    const total = await db.payment.count({
      where: { userId: session.user.id }
    });

    return NextResponse.json<ApiResponse>({
      success: true,
      data: {
        payments,
        pagination: {
          total,
          limit,
          offset,
          hasMore: offset + limit < total
        }
      }
    });

  } catch (error) {
    console.error('Error fetching payments:', error);
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Failed to fetch payments'
    }, { status: 500 });
  }
}

// POST /api/payments - Create payment intent
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
    const { amount, currency = 'usd', description, metadata } = body;

    if (!amount || amount <= 0) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Valid amount is required'
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

    // Create payment intent
    const paymentResponse = await StripePaymentService.createPaymentIntent(
      amount,
      currency,
      stripeCustomerId,
      {
        ...metadata,
        userId: session.user.id,
        description: description || 'One-time payment'
      }
    );

    return NextResponse.json<ApiResponse<PaymentResponse>>({
      success: true,
      data: paymentResponse,
      message: 'Payment intent created successfully'
    });

  } catch (error) {
    console.error('Error creating payment intent:', error);
    return NextResponse.json<ApiResponse>({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to create payment intent'
    }, { status: 500 });
  }
}
