'use client';

import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { PricingCard } from '@/components/subscription/PricingCard';
import { CheckoutForm } from '@/components/subscription/CheckoutForm';
import { PRICING_PLANS } from '@/lib/pricing';
import { PricingPlan, SubscriptionTier } from '@/types/stripe';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CheckCircle, Star, Zap } from 'lucide-react';

export default function PricingPage() {
  const { data: session, status } = useSession();
  const [selectedPlan, setSelectedPlan] = useState<PricingPlan | null>(null);
  const [currentTier, setCurrentTier] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (session?.user?.id) {
      loadCurrentSubscription();
    }
  }, [session]);

  const loadCurrentSubscription = async () => {
    try {
      const response = await fetch('/api/subscriptions');
      const data = await response.json();
      
      if (data.success && data.data?.length > 0) {
        const activeSubscription = data.data.find((sub: any) => 
          sub.status === 'active' || (sub.status === 'canceled' && sub.cancelAtPeriodEnd)
        );
        if (activeSubscription) {
          setCurrentTier(activeSubscription.tier);
        }
      }
    } catch (error) {
      console.error('Failed to load current subscription:', error);
    }
  };

  const handlePlanSelect = (plan: PricingPlan) => {
    if (!session) {
      // Redirect to sign in
      window.location.href = '/auth/signin';
      return;
    }

    if (currentTier === plan.tier) {
      return; // Already on this plan
    }

    setSelectedPlan(plan);
  };

  const handleCheckoutSuccess = () => {
    setSelectedPlan(null);
    loadCurrentSubscription();
    // Redirect to dashboard with success message
    window.location.href = '/dashboard?subscription=success';
  };

  const handleCheckoutCancel = () => {
    setSelectedPlan(null);
  };

  if (status === 'loading') {
  return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
    </div>
    );
}

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 sm:text-5xl">
              Choose Your Plan
            </h1>
            <p className="mt-4 text-xl text-gray-600">
              Get access to powerful real estate tools and data
            </p>
            {currentTier && (
              <div className="mt-4">
                <Badge variant="outline" className="text-sm">
                  <CheckCircle className="w-4 h-4 mr-1" />
                  Currently on {currentTier} plan
                </Badge>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Pricing Cards */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {PRICING_PLANS.map((plan) => (
            <PricingCard
              key={plan.id}
              plan={plan}
              currentTier={currentTier || undefined}
              onSelect={handlePlanSelect}
              isLoading={isLoading}
            />
          ))}
        </div>

        {/* Features Comparison */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Compare Features
          </h2>
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-4 text-left text-sm font-medium text-gray-900">
                      Features
                    </th>
                    {PRICING_PLANS.map((plan) => (
                      <th key={plan.id} className="px-6 py-4 text-center text-sm font-medium text-gray-900">
                        {plan.name}
                        {plan.popular && (
                          <Star className="w-4 h-4 inline ml-1 text-blue-500" />
                        )}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-900">Property Searches</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-500">100/month</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-500">Unlimited</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-500">Unlimited</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-900">Property Analysis</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-500">Basic</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-500">Advanced</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-500">Advanced</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-900">Support</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-500">Email</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-500">Priority</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-500">Dedicated</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-900">API Access</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-500">-</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-500">✓</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-500">✓</td>
                  </tr>
                  <tr>
                    <td className="px-6 py-4 text-sm text-gray-900">Team Collaboration</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-500">-</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-500">-</td>
                    <td className="px-6 py-4 text-center text-sm text-gray-500">✓</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* FAQ Section */}
        <div className="mt-16">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Frequently Asked Questions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Card>
              <CardHeader>
                <CardTitle>Can I change plans anytime?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Yes, you can upgrade or downgrade your plan at any time. Changes will be prorated and take effect immediately.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>What payment methods do you accept?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  We accept all major credit cards (Visa, MasterCard, American Express) and bank transfers through Stripe.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Is there a free trial?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Yes, all paid plans come with a 14-day free trial. No credit card required to start.
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Can I cancel anytime?</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Absolutely. You can cancel your subscription at any time. You'll continue to have access until the end of your billing period.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Checkout Modal */}
      {selectedPlan && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold">Complete Your Subscription</h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCheckoutCancel}
                >
                  ×
                </Button>
              </div>
              <CheckoutForm
                plan={selectedPlan}
                onSuccess={handleCheckoutSuccess}
                onCancel={handleCheckoutCancel}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


