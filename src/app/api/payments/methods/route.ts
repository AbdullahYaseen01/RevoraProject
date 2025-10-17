import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { StripeCustomerService } from '@/lib/stripe';
import { ApiResponse } from '@/types/stripe';

// GET /api/payments/methods - Get user's payment methods
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Unauthorized'
      }, { status: 401 });
    }

    // Get user's Stripe customer ID
    const subscription = await db.subscription.findUnique({
      where: { userId: session.user.id },
      select: { stripeCustomerId: true }
    });

    if (!subscription?.stripeCustomerId) {
      return NextResponse.json<ApiResponse>({
        success: true,
        data: []
      });
    }

    // Get payment methods from Stripe
    const stripePaymentMethods = await StripeCustomerService.getPaymentMethods(
      subscription.stripeCustomerId
    );

    // Get payment methods from database
    const dbPaymentMethods = await db.paymentMethod.findMany({
      where: { userId: session.user.id },
      orderBy: [
        { isDefault: 'desc' },
        { createdAt: 'desc' }
      ]
    });

    // Merge Stripe and database data
    const paymentMethods = stripePaymentMethods.map(stripeMethod => {
      const dbMethod = dbPaymentMethods.find(
        db => db.stripePaymentMethodId === stripeMethod.id
      );

      return {
        id: stripeMethod.id,
        type: stripeMethod.type,
        card: stripeMethod.card ? {
          brand: stripeMethod.card.brand,
          last4: stripeMethod.card.last4,
          expMonth: stripeMethod.card.exp_month,
          expYear: stripeMethod.card.exp_year
        } : undefined,
        billingDetails: stripeMethod.billing_details,
        isDefault: dbMethod?.isDefault || false,
        createdAt: dbMethod?.createdAt || new Date(stripeMethod.created * 1000)
      };
    });

    return NextResponse.json<ApiResponse>({
      success: true,
      data: paymentMethods
    });

  } catch (error) {
    console.error('Error fetching payment methods:', error);
    return NextResponse.json<ApiResponse>({
      success: false,
      error: 'Failed to fetch payment methods'
    }, { status: 500 });
  }
}

// POST /api/payments/methods - Add new payment method
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
    const { paymentMethodId, setAsDefault = false } = body;

    if (!paymentMethodId) {
      return NextResponse.json<ApiResponse>({
        success: false,
        error: 'Payment method ID is required'
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

    // Attach payment method to customer
    const stripe = (await import('@/lib/stripe')).default;
    const paymentMethod = await stripe.paymentMethods.attach(paymentMethodId, {
      customer: stripeCustomerId,
    });

    // Set as default if requested
    if (setAsDefault) {
      await stripe.customers.update(stripeCustomerId, {
        invoice_settings: {
          default_payment_method: paymentMethodId,
        },
      });

      // Update other payment methods to not be default
      await db.paymentMethod.updateMany({
        where: { userId: session.user.id },
        data: { isDefault: false }
      });
    }

    // Save payment method to database
    const savedPaymentMethod = await db.paymentMethod.create({
      data: {
        userId: session.user.id,
        stripePaymentMethodId: paymentMethod.id,
        type: paymentMethod.type,
        cardBrand: paymentMethod.card?.brand,
        cardLast4: paymentMethod.card?.last4,
        cardExpMonth: paymentMethod.card?.exp_month,
        cardExpYear: paymentMethod.card?.exp_year,
        isDefault: setAsDefault,
        billingAddress: paymentMethod.billing_details.address
      }
    });

    return NextResponse.json<ApiResponse>({
      success: true,
      data: savedPaymentMethod,
      message: 'Payment method added successfully'
    });

  } catch (error) {
    console.error('Error adding payment method:', error);
    return NextResponse.json<ApiResponse>({
      success: false,
      error: error instanceof Error ? error.message : 'Failed to add payment method'
    }, { status: 500 });
  }
}
