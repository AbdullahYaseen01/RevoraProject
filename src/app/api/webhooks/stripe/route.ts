import { NextRequest, NextResponse } from 'next/server';
import { headers } from 'next/headers';
import { db } from '@/lib/db';
import { StripeWebhookService } from '@/lib/stripe';
import { StripeWebhookEventType } from '@/types/stripe';
import { SubscriptionTier } from '@prisma/client';

export async function POST(request: NextRequest) {
  try {
    const body = await request.text();
    const headersList = await headers();
    const signature = (headersList as unknown as Headers).get('stripe-signature');

    if (!signature) {
      console.error('Missing Stripe signature');
      return NextResponse.json({ error: 'Missing signature' }, { status: 400 });
    }

    // Verify webhook signature
    const event = StripeWebhookService.verifyWebhookSignature(body, signature);

    console.log(`Processing webhook event: ${event.type}`);

    // Handle different event types
    switch (event.type) {
      case StripeWebhookEventType.CUSTOMER_CREATED:
        await handleCustomerCreated(event.data.object);
        break;

      case StripeWebhookEventType.CUSTOMER_UPDATED:
        await handleCustomerUpdated(event.data.object);
        break;

      case StripeWebhookEventType.SUBSCRIPTION_CREATED:
        await handleSubscriptionCreated(event.data.object);
        break;

      case StripeWebhookEventType.SUBSCRIPTION_UPDATED:
        await handleSubscriptionUpdated(event.data.object);
        break;

      case StripeWebhookEventType.SUBSCRIPTION_DELETED:
        await handleSubscriptionDeleted(event.data.object);
        break;

      case StripeWebhookEventType.INVOICE_PAYMENT_SUCCEEDED:
        await handleInvoicePaymentSucceeded(event.data.object);
        break;

      case StripeWebhookEventType.INVOICE_PAYMENT_FAILED:
        await handleInvoicePaymentFailed(event.data.object);
        break;

      case StripeWebhookEventType.PAYMENT_INTENT_SUCCEEDED:
        await handlePaymentIntentSucceeded(event.data.object);
        break;

      case StripeWebhookEventType.PAYMENT_INTENT_FAILED:
        await handlePaymentIntentFailed(event.data.object);
        break;

      case StripeWebhookEventType.CHECKOUT_SESSION_COMPLETED:
        await handleCheckoutSessionCompleted(event.data.object);
        break;

      default:
        console.log(`Unhandled event type: ${event.type}`);
    }

    return NextResponse.json({ received: true });

  } catch (error) {
    console.error('Webhook error:', error);
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 400 }
    );
  }
}

// Event handlers
async function handleCustomerCreated(customer: any) {
  console.log('Customer created:', customer.id);
  // Customer is automatically created when needed, no action required
}

async function handleCustomerUpdated(customer: any) {
  console.log('Customer updated:', customer.id);
  // Update customer data if needed
}

async function handleSubscriptionCreated(subscription: any) {
  console.log('Subscription created:', subscription.id);
  
  try {
    const userId = subscription.metadata?.userId;
    if (!userId) {
      console.error('No userId in subscription metadata');
      return;
    }

    // Get pricing plan to determine tier
    const pricingPlan = await getPricingPlanByPriceId(subscription.items.data[0]?.price.id);
    const tier = pricingPlan?.tier || SubscriptionTier.STARTER;

    // Update or create subscription in database
    await db.subscription.upsert({
      where: { stripeSubscriptionId: subscription.id },
      update: {
        status: subscription.status,
        currentPeriodStart: new Date(subscription.current_period_start * 1000),
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
        tier
      },
      create: {
        userId,
        stripeCustomerId: subscription.customer,
        stripeSubscriptionId: subscription.id,
        tier,
        status: subscription.status,
        currentPeriodStart: new Date(subscription.current_period_start * 1000),
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        cancelAtPeriodEnd: subscription.cancel_at_period_end
      }
    });

    // Update user's subscription tier
    await db.user.update({
      where: { id: userId },
      data: { subscriptionTier: tier }
    });

    console.log('Subscription created in database');
  } catch (error) {
    console.error('Error handling subscription created:', error);
  }
}

async function handleSubscriptionUpdated(subscription: any) {
  console.log('Subscription updated:', subscription.id);
  
  try {
    const dbSubscription = await db.subscription.findUnique({
      where: { stripeSubscriptionId: subscription.id }
    });

    if (!dbSubscription) {
      console.error('Subscription not found in database:', subscription.id);
      return;
    }

    // Get pricing plan to determine tier
    const pricingPlan = await getPricingPlanByPriceId(subscription.items.data[0]?.price.id);
    const tier = pricingPlan?.tier || dbSubscription.tier;

    // Update subscription in database
    await db.subscription.update({
      where: { stripeSubscriptionId: subscription.id },
      data: {
        status: subscription.status,
        currentPeriodStart: new Date(subscription.current_period_start * 1000),
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
        cancelAtPeriodEnd: subscription.cancel_at_period_end,
        tier
      }
    });

    // Update user's subscription tier
    await db.user.update({
      where: { id: dbSubscription.userId },
      data: { subscriptionTier: tier }
    });

    console.log('Subscription updated in database');
  } catch (error) {
    console.error('Error handling subscription updated:', error);
  }
}

async function handleSubscriptionDeleted(subscription: any) {
  console.log('Subscription deleted:', subscription.id);
  
  try {
    const dbSubscription = await db.subscription.findUnique({
      where: { stripeSubscriptionId: subscription.id }
    });

    if (!dbSubscription) {
      console.error('Subscription not found in database:', subscription.id);
      return;
    }

    // Update subscription status
    await db.subscription.update({
      where: { stripeSubscriptionId: subscription.id },
      data: {
        status: 'canceled',
        cancelAtPeriodEnd: false
      }
    });

    // Reset user's subscription tier to starter
    await db.user.update({
      where: { id: dbSubscription.userId },
      data: { subscriptionTier: SubscriptionTier.STARTER }
    });

    console.log('Subscription canceled in database');
  } catch (error) {
    console.error('Error handling subscription deleted:', error);
  }
}

async function handleInvoicePaymentSucceeded(invoice: any) {
  console.log('Invoice payment succeeded:', invoice.id);
  
  try {
    const subscription = await db.subscription.findUnique({
      where: { stripeSubscriptionId: invoice.subscription }
    });

    if (!subscription) {
      console.error('Subscription not found for invoice:', invoice.id);
      return;
    }

    // Create payment record
    await db.payment.create({
      data: {
        userId: subscription.userId,
        stripePaymentId: invoice.payment_intent,
        stripePaymentIntentId: invoice.payment_intent,
        amount: invoice.amount_paid / 100, // Convert from cents
        currency: invoice.currency,
        description: `Subscription payment - ${invoice.subscription}`,
        status: 'succeeded',
        subscriptionId: subscription.id,
        metadata: {
          invoiceId: invoice.id,
          subscriptionId: invoice.subscription
        }
      }
    });

    // Create invoice record
    await db.invoice.create({
      data: {
        userId: subscription.userId,
        stripeInvoiceId: invoice.id,
        subscriptionId: subscription.id,
        amount: invoice.amount_paid / 100,
        currency: invoice.currency,
        status: 'paid',
        hostedInvoiceUrl: invoice.hosted_invoice_url,
        invoicePdf: invoice.invoice_pdf,
        periodStart: invoice.period_start ? new Date(invoice.period_start * 1000) : null,
        periodEnd: invoice.period_end ? new Date(invoice.period_end * 1000) : null,
        paidAt: new Date()
      }
    });

    console.log('Payment and invoice recorded');
  } catch (error) {
    console.error('Error handling invoice payment succeeded:', error);
  }
}

async function handleInvoicePaymentFailed(invoice: any) {
  console.log('Invoice payment failed:', invoice.id);
  
  try {
    const subscription = await db.subscription.findUnique({
      where: { stripeSubscriptionId: invoice.subscription }
    });

    if (!subscription) {
      console.error('Subscription not found for invoice:', invoice.id);
      return;
    }

    // Create failed payment record
    await db.payment.create({
      data: {
        userId: subscription.userId,
        stripePaymentId: invoice.payment_intent || `failed_${invoice.id}`,
        stripePaymentIntentId: invoice.payment_intent,
        amount: invoice.amount_due / 100,
        currency: invoice.currency,
        description: `Failed subscription payment - ${invoice.subscription}`,
        status: 'failed',
        subscriptionId: subscription.id,
        metadata: {
          invoiceId: invoice.id,
          subscriptionId: invoice.subscription,
          failureReason: invoice.last_payment_error?.message
        }
      }
    });

    console.log('Failed payment recorded');
  } catch (error) {
    console.error('Error handling invoice payment failed:', error);
  }
}

async function handlePaymentIntentSucceeded(paymentIntent: any) {
  console.log('Payment intent succeeded:', paymentIntent.id);
  
  try {
    const userId = paymentIntent.metadata?.userId;
    if (!userId) {
      console.error('No userId in payment intent metadata');
      return;
    }

    // Create payment record
    await db.payment.create({
      data: {
        userId,
        stripePaymentId: paymentIntent.id,
        stripePaymentIntentId: paymentIntent.id,
        amount: paymentIntent.amount / 100,
        currency: paymentIntent.currency,
        description: paymentIntent.description || 'One-time payment',
        status: 'succeeded',
        metadata: paymentIntent.metadata
      }
    });

    console.log('Payment recorded');
  } catch (error) {
    console.error('Error handling payment intent succeeded:', error);
  }
}

async function handlePaymentIntentFailed(paymentIntent: any) {
  console.log('Payment intent failed:', paymentIntent.id);
  
  try {
    const userId = paymentIntent.metadata?.userId;
    if (!userId) {
      console.error('No userId in payment intent metadata');
      return;
    }

    // Create failed payment record
    await db.payment.create({
      data: {
        userId,
        stripePaymentId: paymentIntent.id,
        stripePaymentIntentId: paymentIntent.id,
        amount: paymentIntent.amount / 100,
        currency: paymentIntent.currency,
        description: paymentIntent.description || 'Failed payment',
        status: 'failed',
        metadata: {
          ...paymentIntent.metadata,
          failureReason: paymentIntent.last_payment_error?.message
        }
      }
    });

    console.log('Failed payment recorded');
  } catch (error) {
    console.error('Error handling payment intent failed:', error);
  }
}

async function handleCheckoutSessionCompleted(session: any) {
  console.log('Checkout session completed:', session.id);
  
  try {
    const userId = session.metadata?.userId;
    if (!userId) {
      console.error('No userId in checkout session metadata');
      return;
    }

    // Handle subscription checkout
    if (session.mode === 'subscription' && session.subscription) {
      const subscription = await db.subscription.findUnique({
        where: { stripeSubscriptionId: session.subscription }
      });

      if (subscription) {
        console.log('Subscription checkout completed for existing subscription');
      } else {
        console.log('Subscription checkout completed, subscription will be created via webhook');
      }
    }

    // Handle one-time payment checkout
    if (session.mode === 'payment' && session.payment_intent) {
      console.log('One-time payment checkout completed');
    }

  } catch (error) {
    console.error('Error handling checkout session completed:', error);
  }
}

// Helper function to get pricing plan by price ID
async function getPricingPlanByPriceId(priceId: string) {
  const { PRICING_PLANS } = await import('@/lib/pricing');
  return PRICING_PLANS.find(plan => plan.stripePriceId === priceId);
}
