import Stripe from 'stripe';
import { 
  SubscriptionTier, 
  SubscriptionStatus, 
  PaymentStatus,
  CreateSubscriptionRequest,
  UpdateSubscriptionRequest,
  SubscriptionResponse,
  PaymentResponse,
  StripeError
} from '@/types/stripe';
import { PRICING_PLANS, getPricingPlanByTier, getPricingPlanByPriceId } from '@/lib/pricing'

// Initialize Stripe with fallback for build time
const stripe = process.env.STRIPE_SECRET_KEY 
  ? new Stripe(process.env.STRIPE_SECRET_KEY, {
      apiVersion: '2025-08-27.basil',
      typescript: true,
    })
  : null;

// PRICING_PLANS now lives in '@/lib/pricing' to keep this module server-safe

// Customer Management
export class StripeCustomerService {
  // Create a new customer
  static async createCustomer(email: string, name?: string, metadata?: Record<string, string>): Promise<Stripe.Customer> {
    if (!stripe) {
      throw new Error('Stripe is not configured. Please set STRIPE_SECRET_KEY environment variable.');
    }
    try {
      const customer = await stripe.customers.create({
        email,
        name,
        metadata: {
          ...metadata,
          created_via: 'website'
        }
      });
      return customer;
    } catch (error) {
      throw new Error(`Failed to create customer: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Get customer by ID
  static async getCustomer(customerId: string): Promise<Stripe.Customer> {
    if (!stripe) {
      throw new Error('Stripe is not configured. Please set STRIPE_SECRET_KEY environment variable.');
    }
    try {
      const customer = await stripe.customers.retrieve(customerId);
      if (customer.deleted) {
        throw new Error('Customer has been deleted');
      }
      return customer as Stripe.Customer;
    } catch (error) {
      throw new Error(`Failed to retrieve customer: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Update customer
  static async updateCustomer(
    customerId: string, 
    updates: {
      email?: string;
      name?: string;
      phone?: string;
      metadata?: Record<string, string>;
    }
  ): Promise<Stripe.Customer> {
    if (!stripe) {
      throw new Error('Stripe is not configured. Please set STRIPE_SECRET_KEY environment variable.');
    }
    try {
      const customer = await stripe.customers.update(customerId, updates);
      return customer;
    } catch (error) {
      throw new Error(`Failed to update customer: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Get customer's payment methods
  static async getPaymentMethods(customerId: string): Promise<Stripe.PaymentMethod[]> {
    if (!stripe) {
      throw new Error('Stripe is not configured. Please set STRIPE_SECRET_KEY environment variable.');
    }
    try {
      const paymentMethods = await stripe.paymentMethods.list({
        customer: customerId,
        type: 'card'
      });
      return paymentMethods.data;
    } catch (error) {
      throw new Error(`Failed to retrieve payment methods: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

// Subscription Management
export class StripeSubscriptionService {
  // Create a new subscription
  static async createSubscription(request: CreateSubscriptionRequest): Promise<SubscriptionResponse> {
    if (!stripe) {
      throw new Error('Stripe is not configured. Please set STRIPE_SECRET_KEY environment variable.');
    }
    try {
      const { priceId, customerId, paymentMethodId, trialPeriodDays, metadata } = request;

      // Create customer if not provided
      let customer: Stripe.Customer;
      if (customerId) {
        customer = await StripeCustomerService.getCustomer(customerId);
      } else {
        throw new Error('Customer ID is required');
      }

      // Attach payment method if provided
      if (paymentMethodId) {
        await stripe.paymentMethods.attach(paymentMethodId, {
          customer: customer.id,
        });

        // Set as default payment method
        await stripe.customers.update(customer.id, {
          invoice_settings: {
            default_payment_method: paymentMethodId,
          },
        });
      }

      // Create subscription
      const subscription = await stripe.subscriptions.create({
        customer: customer.id,
        items: [{ price: priceId }],
        trial_period_days: trialPeriodDays,
        metadata: metadata || {},
        expand: ['latest_invoice.payment_intent'],
      });

      const pricingPlan = getPricingPlanByPriceId(priceId);
      if (!pricingPlan) {
        throw new Error('Invalid price ID');
      }

      const sub: any = subscription as any
      return {
        subscription: {
          id: sub.id,
          status: sub.status as SubscriptionStatus,
          currentPeriodStart: new Date((sub.current_period_start ?? Date.now()/1000) * 1000),
          currentPeriodEnd: new Date((sub.current_period_end ?? Date.now()/1000) * 1000),
          cancelAtPeriodEnd: sub.cancel_at_period_end,
          tier: pricingPlan.tier
        },
        customer: {
          id: customer.id,
          email: customer.email!
        },
        price: {
          id: priceId,
          amount: pricingPlan.price * 100, // Convert to cents
          currency: pricingPlan.currency,
          interval: pricingPlan.interval
        }
      };
    } catch (error) {
      throw new Error(`Failed to create subscription: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Get subscription by ID
  static async getSubscription(subscriptionId: string): Promise<Stripe.Subscription> {
    if (!stripe) {
      throw new Error('Stripe is not configured. Please set STRIPE_SECRET_KEY environment variable.');
    }
    try {
      const subscription = await stripe.subscriptions.retrieve(subscriptionId);
      return subscription;
    } catch (error) {
      throw new Error(`Failed to retrieve subscription: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Update subscription
  static async updateSubscription(request: UpdateSubscriptionRequest): Promise<Stripe.Subscription> {
    if (!stripe) {
      throw new Error('Stripe is not configured. Please set STRIPE_SECRET_KEY environment variable.');
    }
    try {
      const { subscriptionId, priceId, quantity, prorationBehavior, metadata } = request;

      const updateData: Stripe.SubscriptionUpdateParams = {
        metadata: metadata || {}
      };

      if (priceId) {
        const subscription = await this.getSubscription(subscriptionId);
        const currentItem = subscription.items.data[0];
        
        updateData.items = [{
          id: currentItem.id,
          price: priceId,
          quantity: quantity || 1
        }];
        
        if (prorationBehavior) {
          updateData.proration_behavior = prorationBehavior;
        }
      }

      const updatedSubscription = await stripe.subscriptions.update(subscriptionId, updateData);
      return updatedSubscription;
    } catch (error) {
      throw new Error(`Failed to update subscription: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Cancel subscription
  static async cancelSubscription(subscriptionId: string, cancelAtPeriodEnd: boolean = true): Promise<Stripe.Subscription> {
    if (!stripe) {
      throw new Error('Stripe is not configured. Please set STRIPE_SECRET_KEY environment variable.');
    }
    try {
      const subscription = await stripe.subscriptions.update(subscriptionId, {
        cancel_at_period_end: cancelAtPeriodEnd
      });

      if (!cancelAtPeriodEnd) {
        await stripe.subscriptions.cancel(subscriptionId);
      }

      return subscription;
    } catch (error) {
      throw new Error(`Failed to cancel subscription: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Resume subscription
  static async resumeSubscription(subscriptionId: string): Promise<Stripe.Subscription> {
    if (!stripe) {
      throw new Error('Stripe is not configured. Please set STRIPE_SECRET_KEY environment variable.');
    }
    try {
      const subscription = await stripe.subscriptions.update(subscriptionId, {
        cancel_at_period_end: false
      });
      return subscription;
    } catch (error) {
      throw new Error(`Failed to resume subscription: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Get customer's subscriptions
  static async getCustomerSubscriptions(customerId: string): Promise<Stripe.Subscription[]> {
    if (!stripe) {
      throw new Error('Stripe is not configured. Please set STRIPE_SECRET_KEY environment variable.');
    }
    try {
      const subscriptions = await stripe.subscriptions.list({
        customer: customerId,
        status: 'all'
      });
      return subscriptions.data;
    } catch (error) {
      throw new Error(`Failed to retrieve customer subscriptions: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

// Payment Management
export class StripePaymentService {
  // Create payment intent
  static async createPaymentIntent(
    amount: number,
    currency: string = 'usd',
    customerId?: string,
    metadata?: Record<string, string>
  ): Promise<PaymentResponse> {
    if (!stripe) {
      throw new Error('Stripe is not configured. Please set STRIPE_SECRET_KEY environment variable.');
    }
    try {
      const paymentIntent = await stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency,
        customer: customerId,
        metadata: metadata || {},
        automatic_payment_methods: {
          enabled: true,
        },
      });

      return {
        paymentIntent: {
          id: paymentIntent.id,
          clientSecret: paymentIntent.client_secret!,
          status: paymentIntent.status as PaymentStatus
        },
        amount,
        currency
      };
    } catch (error) {
      throw new Error(`Failed to create payment intent: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Get payment intent
  static async getPaymentIntent(paymentIntentId: string): Promise<Stripe.PaymentIntent> {
    if (!stripe) {
      throw new Error('Stripe is not configured. Please set STRIPE_SECRET_KEY environment variable.');
    }
    try {
      const paymentIntent = await stripe.paymentIntents.retrieve(paymentIntentId);
      return paymentIntent;
    } catch (error) {
      throw new Error(`Failed to retrieve payment intent: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Confirm payment intent
  static async confirmPaymentIntent(
    paymentIntentId: string,
    paymentMethodId?: string
  ): Promise<Stripe.PaymentIntent> {
    if (!stripe) {
      throw new Error('Stripe is not configured. Please set STRIPE_SECRET_KEY environment variable.');
    }
    try {
      const confirmData: Stripe.PaymentIntentConfirmParams = {};
      
      if (paymentMethodId) {
        confirmData.payment_method = paymentMethodId;
      }

      const paymentIntent = await stripe.paymentIntents.confirm(paymentIntentId, confirmData);
      return paymentIntent;
    } catch (error) {
      throw new Error(`Failed to confirm payment intent: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

// Checkout Session Management
export class StripeCheckoutService {
  // Create checkout session for subscription
  static async createCheckoutSession(
    priceId: string,
    successUrl: string,
    cancelUrl: string,
    customerId?: string,
    metadata?: Record<string, string>
  ): Promise<Stripe.Checkout.Session> {
    if (!stripe) {
      throw new Error('Stripe is not configured. Please set STRIPE_SECRET_KEY environment variable.');
    }
    try {
      const session = await stripe.checkout.sessions.create({
        customer: customerId,
        payment_method_types: ['card'],
        line_items: [
          {
            price: priceId,
            quantity: 1,
          },
        ],
        mode: 'subscription',
        success_url: successUrl,
        cancel_url: cancelUrl,
        metadata: metadata || {},
        allow_promotion_codes: true,
        billing_address_collection: 'required',
        subscription_data: {
          metadata: metadata || {}
        }
      });

      return session;
    } catch (error) {
      throw new Error(`Failed to create checkout session: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  // Create checkout session for one-time payment
  static async createOneTimePaymentSession(
    amount: number,
    successUrl: string,
    cancelUrl: string,
    currency: string = 'usd',
    customerId?: string,
    metadata?: Record<string, string>
  ): Promise<Stripe.Checkout.Session> {
    if (!stripe) {
      throw new Error('Stripe is not configured. Please set STRIPE_SECRET_KEY environment variable.');
    }
    try {
      const session = await stripe.checkout.sessions.create({
        customer: customerId,
        payment_method_types: ['card'],
        line_items: [
          {
            price_data: {
              currency,
              product_data: {
                name: 'One-time Payment',
              },
              unit_amount: Math.round(amount * 100), // Convert to cents
            },
            quantity: 1,
          },
        ],
        mode: 'payment',
        success_url: successUrl,
        cancel_url: cancelUrl,
        metadata: metadata || {}
      });

      return session;
    } catch (error) {
      throw new Error(`Failed to create checkout session: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

// Webhook handling
export class StripeWebhookService {
  // Verify webhook signature
  static verifyWebhookSignature(payload: string, signature: string): Stripe.Event {
    if (!stripe) {
      throw new Error('Stripe is not configured. Please set STRIPE_SECRET_KEY environment variable.');
    }
    try {
      const event = stripe.webhooks.constructEvent(
        payload,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET!
      );
      return event;
    } catch (error) {
      throw new Error(`Webhook signature verification failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }
}

// Utility functions
export function formatStripeError(error: any): StripeError {
  if (error.type && error.code) {
    return {
      name: 'StripeError',
      message: error.message || 'An error occurred with Stripe',
      type: error.type,
      code: error.code,
      param: error.param,
      decline_code: error.decline_code,
      payment_intent: error.payment_intent,
      payment_method: error.payment_method,
      setup_intent: error.setup_intent,
      source: error.source
    };
  }
  
  return {
    name: 'StripeError',
    message: error.message || 'An unknown error occurred'
  };
}

export default stripe;
