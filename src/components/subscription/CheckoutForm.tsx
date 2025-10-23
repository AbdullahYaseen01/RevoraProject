'use client';

import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { PricingPlan, ApiResponse } from '@/types/stripe';
import { CreditCard, Lock, AlertCircle, ExternalLink } from 'lucide-react';

interface CheckoutFormProps {
  plan: PricingPlan;
  onSuccess: () => void;
  onCancel: () => void;
}

export function CheckoutForm({ plan, onSuccess, onCancel }: CheckoutFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheckout = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Create checkout session
      const response = await fetch('/api/subscriptions/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          priceId: plan.stripePriceId,
          successUrl: `${window.location.origin}/dashboard?subscription=success`,
          cancelUrl: `${window.location.origin}/pricing?subscription=canceled`
        })
      });

      const data: ApiResponse<{ sessionId: string; url: string }> = await response.json();

      if (!data.success || !data.data) {
        throw new Error(data.error || 'Failed to create checkout session');
      }

      // Redirect to Stripe Checkout
      window.location.href = data.data.url;
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 bg-white rounded-lg p-6 shadow-lg">
      {error && (
        <Alert variant="destructive" className="border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800 font-medium">{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-6">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Complete Your Subscription</h2>
          <p className="text-base text-gray-700 font-medium">
            You'll be redirected to Stripe's secure checkout page
          </p>
        </div>

        <Card className="border-2 border-gray-200 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-t-lg">
            <CardTitle className="text-xl font-bold text-gray-900">{plan.name} Plan</CardTitle>
            <CardDescription className="text-base text-gray-700 font-medium">{plan.description}</CardDescription>
          </CardHeader>
          <CardContent className="p-6">
            <div className="space-y-4">
              <div className="flex justify-between items-center bg-gray-50 p-4 rounded-lg">
                <span className="text-lg font-semibold text-gray-900">Price</span>
                <span className="text-3xl font-bold text-blue-600">
                  ${plan.price}/{plan.interval}
                </span>
              </div>
              <div className="text-base text-gray-700 font-medium text-center">
                Billed {plan.interval}ly • Cancel anytime
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-3">
          <h4 className="text-lg font-bold text-gray-900">What's included:</h4>
          <ul className="text-base text-gray-800 space-y-2">
            {plan.features.map((feature, index) => (
              <li key={index} className="flex items-start gap-3 bg-green-50 p-3 rounded-lg">
                <span className="text-green-600 text-lg font-bold mt-0.5">✓</span>
                <span className="font-medium">{feature}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="flex gap-4 pt-4">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
          className="flex-1 h-12 text-base font-semibold border-2 border-gray-300 text-gray-700 hover:bg-gray-50 hover:border-gray-400"
        >
          Cancel
        </Button>
        <Button
          onClick={handleCheckout}
          disabled={isLoading}
          className="flex-1 h-12 text-base font-bold bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl"
        >
          {isLoading ? (
            <>
              <LoadingSpinner className="w-5 h-5 mr-2" />
              Processing...
            </>
          ) : (
            <>
              <ExternalLink className="w-5 h-5 mr-2" />
              Continue to Checkout
            </>
          )}
        </Button>
      </div>

      <div className="flex items-center justify-center gap-2 text-sm text-gray-600 font-medium bg-gray-50 p-3 rounded-lg">
        <Lock className="w-4 h-4 text-blue-600" />
        <span>Secured by Stripe</span>
      </div>
    </div>
  );
}
