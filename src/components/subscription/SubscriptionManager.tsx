'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import LoadingSpinner from '@/components/ui/LoadingSpinner';
import { SubscriptionCard } from './SubscriptionCard';
import { PricingPlan, SubscriptionTier, SubscriptionStatus, ApiResponse } from '@/types/stripe';
import { PRICING_PLANS } from '@/lib/pricing';
import { CreditCard, Calendar, AlertCircle, CheckCircle } from 'lucide-react';

interface SubscriptionManagerProps {
  userId: string;
}

interface Subscription {
  id: string;
  tier: SubscriptionTier;
  status: SubscriptionStatus;
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  stripeSubscriptionId?: string;
}

interface Payment {
  id: string;
  amount: number;
  currency: string;
  status: string;
  description?: string;
  createdAt: Date;
}

export function SubscriptionManager({ userId }: SubscriptionManagerProps) {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [actionLoading, setActionLoading] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, [userId]);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      const [subscriptionsRes, paymentsRes] = await Promise.all([
        fetch('/api/subscriptions'),
        fetch('/api/payments?limit=10')
      ]);

      if (!subscriptionsRes.ok || !paymentsRes.ok) {
        throw new Error('Failed to load subscription data');
      }

      const subscriptionsData: ApiResponse<Subscription[]> = await subscriptionsRes.json();
      const paymentsData: ApiResponse<{ payments: Payment[] }> = await paymentsRes.json();

      if (subscriptionsData.success) {
        setSubscriptions(subscriptionsData.data || []);
      }

      if (paymentsData.success) {
        setPayments(paymentsData.data?.payments || []);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load data');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancelSubscription = async (subscriptionId: string) => {
    try {
      setActionLoading(subscriptionId);
      setError(null);

      const response = await fetch(`/api/subscriptions/${subscriptionId}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' }
      });

      const data: ApiResponse = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to cancel subscription');
      }

      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to cancel subscription');
    } finally {
      setActionLoading(null);
    }
  };

  const handleResumeSubscription = async (subscriptionId: string) => {
    try {
      setActionLoading(subscriptionId);
      setError(null);

      const response = await fetch(`/api/subscriptions/${subscriptionId}/resume`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' }
      });

      const data: ApiResponse = await response.json();

      if (!data.success) {
        throw new Error(data.error || 'Failed to resume subscription');
      }

      await loadData();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to resume subscription');
    } finally {
      setActionLoading(null);
    }
  };

  const handleManageSubscription = (subscription: Subscription) => {
    // Open Stripe Customer Portal or redirect to subscription management
    window.open(`/subscription/${subscription.id}`, '_blank');
  };

  const getCurrentSubscription = () => {
    return subscriptions.find(sub => 
      sub.status === SubscriptionStatus.ACTIVE || 
      (sub.status === SubscriptionStatus.CANCELED && sub.cancelAtPeriodEnd)
    );
  };

  const getTierConfig = (tier: SubscriptionTier) => {
    return PRICING_PLANS.find(plan => plan.tier === tier);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <LoadingSpinner />
      </div>
    );
  }

  const currentSubscription = getCurrentSubscription();

  return (
    <div className="space-y-6">
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Current Subscription */}
      {currentSubscription ? (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Current Subscription</h2>
          <SubscriptionCard
            subscription={currentSubscription}
            onManage={() => handleManageSubscription(currentSubscription)}
            onCancel={() => handleCancelSubscription(currentSubscription.id)}
            onResume={() => handleResumeSubscription(currentSubscription.id)}
            isLoading={actionLoading === currentSubscription.id}
          />
        </div>
      ) : (
        <Card>
          <CardContent className="p-8 text-center">
            <div className="space-y-4">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto">
                <CreditCard className="w-8 h-8 text-gray-400" />
              </div>
              <div>
                <h3 className="text-lg font-semibold">No Active Subscription</h3>
                <p className="text-gray-600">You're currently on the free plan</p>
              </div>
              <Button asChild>
                <a href="/pricing">Upgrade Now</a>
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* All Subscriptions */}
      {subscriptions.length > 1 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">All Subscriptions</h2>
          <div className="grid gap-4">
            {subscriptions.map((subscription) => (
              <SubscriptionCard
                key={subscription.id}
                subscription={subscription}
                onManage={() => handleManageSubscription(subscription)}
                onCancel={() => handleCancelSubscription(subscription.id)}
                onResume={() => handleResumeSubscription(subscription.id)}
                isLoading={actionLoading === subscription.id}
              />
            ))}
          </div>
        </div>
      )}

      {/* Recent Payments */}
      {payments.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-2xl font-bold">Recent Payments</h2>
          <Card>
            <CardHeader>
              <CardTitle>Payment History</CardTitle>
              <CardDescription>Your recent payment activity</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {payments.map((payment) => (
                  <div key={payment.id} className="flex items-center justify-between p-3 border rounded-lg">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                        <CreditCard className="w-4 h-4 text-gray-600" />
                      </div>
                      <div>
                        <p className="font-medium">{payment.description || 'Payment'}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(payment.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="font-medium">
                        ${payment.amount.toFixed(2)} {payment.currency.toUpperCase()}
                      </p>
                      <Badge 
                        variant={payment.status === 'succeeded' ? 'default' : 'destructive'}
                        className="text-xs"
                      >
                        {payment.status}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-4 pt-4 border-t">
                <Button variant="outline" asChild>
                  <a href="/payments">View All Payments</a>
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
