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
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold">Complete Your Subscription</h3>
          <p className="text-sm text-gray-600">
            You'll be redirected to Stripe's secure checkout page
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">{plan.name} Plan</CardTitle>
            <CardDescription>{plan.description}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="font-medium">Price</span>
                <span className="text-xl font-bold">
                  ${plan.price}/{plan.interval}
                </span>
              </div>
              <div className="text-sm text-gray-600">
                Billed {plan.interval}ly • Cancel anytime
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-2">
          <h4 className="font-medium">What's included:</h4>
          <ul className="text-sm text-gray-600 space-y-1">
            {plan.features.map((feature, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-green-500 mt-0.5">✓</span>
                {feature}
              </li>
            ))}
          </ul>
        </div>
      </div>

      <div className="flex gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
          className="flex-1"
        >
          Cancel
        </Button>
        <Button
          onClick={handleCheckout}
          disabled={isLoading}
          className="flex-1"
        >
          {isLoading ? (
            <>
              <LoadingSpinner className="w-4 h-4 mr-2" />
              Processing...
            </>
          ) : (
            <>
              <ExternalLink className="w-4 h-4 mr-2" />
              Continue to Checkout
            </>
          )}
        </Button>
      </div>

      <div className="flex items-center justify-center gap-2 text-xs text-gray-500">
        <Lock className="w-3 h-3" />
        <span>Secured by Stripe</span>
      </div>
    </div>
  );
}
