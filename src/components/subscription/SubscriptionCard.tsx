'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { SubscriptionTier, SubscriptionStatus } from '@/types/stripe';
import { Calendar, CreditCard, Settings, AlertCircle } from 'lucide-react';

interface SubscriptionCardProps {
  subscription: {
    id: string;
    tier: SubscriptionTier;
    status: SubscriptionStatus;
    currentPeriodStart: Date;
    currentPeriodEnd: Date;
    cancelAtPeriodEnd: boolean;
    stripeSubscriptionId?: string;
  };
  onManage: () => void;
  onCancel: () => void;
  onResume: () => void;
  isLoading?: boolean;
}

const tierConfig = {
  [SubscriptionTier.STARTER]: {
    name: 'Starter',
    color: 'bg-gray-100 text-gray-800',
    description: 'Perfect for individual property seekers'
  },
  [SubscriptionTier.PRO]: {
    name: 'Pro',
    color: 'bg-blue-100 text-blue-800',
    description: 'Ideal for real estate professionals'
  },
  [SubscriptionTier.ENTERPRISE]: {
    name: 'Enterprise',
    color: 'bg-purple-100 text-purple-800',
    description: 'For teams and large organizations'
  }
};

const statusConfig = {
  [SubscriptionStatus.ACTIVE]: {
    label: 'Active',
    color: 'bg-green-100 text-green-800',
    icon: null
  },
  [SubscriptionStatus.CANCELED]: {
    label: 'Canceled',
    color: 'bg-red-100 text-red-800',
    icon: AlertCircle
  },
  [SubscriptionStatus.PAST_DUE]: {
    label: 'Past Due',
    color: 'bg-yellow-100 text-yellow-800',
    icon: AlertCircle
  },
  [SubscriptionStatus.UNPAID]: {
    label: 'Unpaid',
    color: 'bg-red-100 text-red-800',
    icon: AlertCircle
  },
  [SubscriptionStatus.INCOMPLETE]: {
    label: 'Incomplete',
    color: 'bg-yellow-100 text-yellow-800',
    icon: AlertCircle
  },
  [SubscriptionStatus.INCOMPLETE_EXPIRED]: {
    label: 'Expired',
    color: 'bg-red-100 text-red-800',
    icon: AlertCircle
  },
  [SubscriptionStatus.TRIALING]: {
    label: 'Trial',
    color: 'bg-blue-100 text-blue-800',
    icon: null
  },
  [SubscriptionStatus.PAUSED]: {
    label: 'Paused',
    color: 'bg-gray-100 text-gray-800',
    icon: null
  }
};

export function SubscriptionCard({ 
  subscription, 
  onManage, 
  onCancel, 
  onResume, 
  isLoading = false 
}: SubscriptionCardProps) {
  const tier = tierConfig[subscription.tier];
  const status = statusConfig[subscription.status];
  const StatusIcon = status.icon;

  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    }).format(new Date(date));
  };

  const getActionButtons = () => {
    if (subscription.status === SubscriptionStatus.ACTIVE) {
      return (
        <div className="flex gap-2">
          <Button variant="outline" onClick={onManage} disabled={isLoading}>
            <Settings className="w-4 h-4 mr-2" />
            Manage
          </Button>
          <Button variant="destructive" onClick={onCancel} disabled={isLoading}>
            Cancel
          </Button>
        </div>
      );
    }

    if (subscription.status === SubscriptionStatus.CANCELED && subscription.cancelAtPeriodEnd) {
      return (
        <div className="flex gap-2">
          <Button variant="outline" onClick={onResume} disabled={isLoading}>
            Resume
          </Button>
          <Button variant="outline" onClick={onManage} disabled={isLoading}>
            <Settings className="w-4 h-4 mr-2" />
            Manage
          </Button>
        </div>
      );
    }

    return (
      <Button variant="outline" onClick={onManage} disabled={isLoading}>
        <Settings className="w-4 h-4 mr-2" />
        Manage
      </Button>
    );
  };

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              {tier.name} Plan
              <Badge className={tier.color}>
                {tier.name}
              </Badge>
            </CardTitle>
            <CardDescription>{tier.description}</CardDescription>
          </div>
          <div className="flex items-center gap-2">
            {StatusIcon && <StatusIcon className="w-4 h-4" />}
            <Badge className={status.color}>
              {status.label}
            </Badge>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4 text-gray-500" />
            <div>
              <p className="text-gray-500">Current Period</p>
              <p className="font-medium">
                {formatDate(subscription.currentPeriodStart)} - {formatDate(subscription.currentPeriodEnd)}
              </p>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <CreditCard className="w-4 h-4 text-gray-500" />
            <div>
              <p className="text-gray-500">Status</p>
              <p className="font-medium">
                {subscription.cancelAtPeriodEnd ? 'Cancels at period end' : 'Renews automatically'}
              </p>
            </div>
          </div>
        </div>

        {subscription.cancelAtPeriodEnd && (
          <div className="p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
            <div className="flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-yellow-600" />
              <p className="text-sm text-yellow-800">
                Your subscription will be canceled on {formatDate(subscription.currentPeriodEnd)}.
                You'll continue to have access until then.
              </p>
            </div>
          </div>
        )}

        <div className="pt-4 border-t">
          {getActionButtons()}
        </div>
      </CardContent>
    </Card>
  );
}
