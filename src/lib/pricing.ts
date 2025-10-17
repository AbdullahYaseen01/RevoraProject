import { SubscriptionTier } from '@/types/stripe'

export type PricingPlan = {
  id: string
  name: string
  description: string
  price: number
  currency: string
  interval: 'month' | 'year'
  features: string[]
  stripePriceId: string
  tier: SubscriptionTier
  popular?: boolean
}

export const PRICING_PLANS: PricingPlan[] = [
  {
    id: 'starter',
    name: 'Starter',
    description: 'Perfect for individual property seekers',
    price: 29,
    currency: 'usd',
    interval: 'month',
    features: [
      'Up to 100 property searches per month',
      'Basic property analysis',
      'Email support',
      'Standard property data'
    ],
    stripePriceId: process.env.STRIPE_PRICE_ID_STARTER || 'price_starter_monthly',
    tier: SubscriptionTier.STARTER
  },
  {
    id: 'pro',
    name: 'Pro',
    description: 'Ideal for real estate professionals',
    price: 79,
    currency: 'usd',
    interval: 'month',
    features: [
      'Unlimited property searches',
      'Advanced property analysis',
      'Priority support',
      'Enhanced property data',
      'Export capabilities',
      'API access'
    ],
    stripePriceId: process.env.STRIPE_PRICE_ID_PRO || 'price_pro_monthly',
    tier: SubscriptionTier.PRO,
    popular: true
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    description: 'For teams and large organizations',
    price: 199,
    currency: 'usd',
    interval: 'month',
    features: [
      'Everything in Pro',
      'Team collaboration tools',
      'Custom integrations',
      'Dedicated account manager',
      'Custom reporting',
      'White-label options'
    ],
    stripePriceId: process.env.STRIPE_PRICE_ID_ENTERPRISE || 'price_enterprise_monthly',
    tier: SubscriptionTier.ENTERPRISE
  }
]

export function getPricingPlanByTier(tier: SubscriptionTier) {
  return PRICING_PLANS.find(p => p.tier === tier)
}

export function getPricingPlanByPriceId(priceId: string) {
  return PRICING_PLANS.find(p => p.stripePriceId === priceId)
}


