import { Stripe } from 'stripe';

// Subscription tier definitions
export enum SubscriptionTier {
  STARTER = 'STARTER',
  PRO = 'PRO',
  ENTERPRISE = 'ENTERPRISE'
}

// Subscription status definitions
export enum SubscriptionStatus {
  ACTIVE = 'active',
  CANCELED = 'canceled',
  PAST_DUE = 'past_due',
  UNPAID = 'unpaid',
  INCOMPLETE = 'incomplete',
  INCOMPLETE_EXPIRED = 'incomplete_expired',
  TRIALING = 'trialing',
  PAUSED = 'paused'
}

// Payment status definitions
export enum PaymentStatus {
  SUCCEEDED = 'succeeded',
  FAILED = 'failed',
  PENDING = 'pending',
  CANCELED = 'canceled',
  REQUIRES_ACTION = 'requires_action'
}

// Stripe customer data
export interface StripeCustomer {
  id: string;
  email: string;
  name?: string;
  phone?: string;
  address?: Stripe.Address;
  created: number;
  metadata?: Record<string, string>;
}

// Subscription data from Stripe
export interface StripeSubscription {
  id: string;
  customer: string;
  status: SubscriptionStatus;
  current_period_start: number;
  current_period_end: number;
  cancel_at_period_end: boolean;
  canceled_at?: number;
  trial_start?: number;
  trial_end?: number;
  items: {
    data: Array<{
      id: string;
      price: {
        id: string;
        unit_amount: number;
        currency: string;
        recurring?: {
          interval: 'month' | 'year';
          interval_count: number;
        };
      };
      quantity: number;
    }>;
  };
  metadata?: Record<string, string>;
}

// Payment intent data
export interface StripePaymentIntent {
  id: string;
  amount: number;
  currency: string;
  status: PaymentStatus;
  client_secret: string;
  description?: string;
  metadata?: Record<string, string>;
}

// Webhook event types
export enum StripeWebhookEventType {
  CUSTOMER_CREATED = 'customer.created',
  CUSTOMER_UPDATED = 'customer.updated',
  CUSTOMER_DELETED = 'customer.deleted',
  SUBSCRIPTION_CREATED = 'customer.subscription.created',
  SUBSCRIPTION_UPDATED = 'customer.subscription.updated',
  SUBSCRIPTION_DELETED = 'customer.subscription.deleted',
  INVOICE_PAYMENT_SUCCEEDED = 'invoice.payment_succeeded',
  INVOICE_PAYMENT_FAILED = 'invoice.payment_failed',
  PAYMENT_INTENT_SUCCEEDED = 'payment_intent.succeeded',
  PAYMENT_INTENT_FAILED = 'payment_intent.payment_failed',
  CHECKOUT_SESSION_COMPLETED = 'checkout.session.completed'
}

// Pricing plan configuration
export interface PricingPlan {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  interval: 'month' | 'year';
  features: string[];
  stripePriceId: string;
  tier: SubscriptionTier;
  popular?: boolean;
}

// Subscription creation request
export interface CreateSubscriptionRequest {
  priceId: string;
  customerId?: string;
  paymentMethodId?: string;
  trialPeriodDays?: number;
  metadata?: Record<string, string>;
}

// Subscription update request
export interface UpdateSubscriptionRequest {
  subscriptionId: string;
  priceId?: string;
  quantity?: number;
  prorationBehavior?: 'create_prorations' | 'none' | 'always_invoice';
  metadata?: Record<string, string>;
}

// Payment method data
export interface PaymentMethodData {
  id: string;
  type: string;
  card?: {
    brand: string;
    last4: string;
    exp_month: number;
    exp_year: number;
  };
  billing_details: {
    name?: string;
    email?: string;
    phone?: string;
    address?: Stripe.Address;
  };
}

// API response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

// Subscription management response
export interface SubscriptionResponse {
  subscription: {
    id: string;
    status: SubscriptionStatus;
    currentPeriodStart: Date;
    currentPeriodEnd: Date;
    cancelAtPeriodEnd: boolean;
    tier: SubscriptionTier;
  };
  customer: {
    id: string;
    email: string;
  };
  price: {
    id: string;
    amount: number;
    currency: string;
    interval: string;
  };
}

// Payment response
export interface PaymentResponse {
  paymentIntent: {
    id: string;
    clientSecret: string;
    status: PaymentStatus;
  };
  amount: number;
  currency: string;
}

// Webhook event data
export interface WebhookEventData {
  id: string;
  object: string;
  type: StripeWebhookEventType;
  data: {
    object: any;
  };
  created: number;
  livemode: boolean;
  pending_webhooks: number;
  request?: {
    id: string;
    idempotency_key?: string;
  };
}

// Error types
export interface StripeError extends Error {
  type?: string;
  code?: string;
  param?: string;
  decline_code?: string;
  payment_intent?: Stripe.PaymentIntent;
  payment_method?: Stripe.PaymentMethod;
  setup_intent?: Stripe.SetupIntent;
  source?: Stripe.Source;
}
