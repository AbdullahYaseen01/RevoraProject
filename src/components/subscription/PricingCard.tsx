'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { PricingPlan } from '@/types/stripe';
import { Check, Star } from 'lucide-react';

interface PricingCardProps {
  plan: PricingPlan;
  currentTier?: string;
  onSelect: (plan: PricingPlan) => void;
  isLoading?: boolean;
}

export function PricingCard({ plan, currentTier, onSelect, isLoading = false }: PricingCardProps) {
  const isCurrentPlan = currentTier === plan.tier;
  const isPopular = plan.popular;

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <Card className={`relative ${isPopular ? 'border-blue-500 shadow-lg' : ''} ${isCurrentPlan ? 'border-green-500' : ''} transition-base`}>
      {isPopular && (
        <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
          <Badge className="bg-blue-500 text-white px-3 py-1">
            <Star className="w-3 h-3 mr-1" />
            Most Popular
          </Badge>
        </div>
      )}
      
      {isCurrentPlan && (
        <div className="absolute -top-3 right-4">
          <Badge className="bg-green-500 text-white px-3 py-1">
            Current Plan
          </Badge>
        </div>
      )}

      <CardHeader className="text-center pb-4">
        <CardTitle className="text-2xl">{plan.name}</CardTitle>
        <CardDescription className="text-base text-slate-600">{plan.description}</CardDescription>
        <div className="mt-4">
          <span className="text-4xl font-bold text-slate-900">{formatPrice(plan.price)}</span>
          <span className="text-gray-600 ml-2">/{plan.interval}</span>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        <ul className="space-y-3">
          {plan.features.map((feature, index) => (
            <li key={index} className="flex items-start gap-3">
              <Check className="w-5 h-5 text-green-500 mt-0.5 flex-shrink-0" />
              <span className="text-sm text-slate-700">{feature}</span>
            </li>
          ))}
        </ul>

        <Button
          className={`w-full ${isPopular ? 'bg-blue-600 hover:bg-blue-700' : ''}`}
          variant={isCurrentPlan ? 'outline' : 'default'}
          onClick={() => onSelect(plan)}
          disabled={isCurrentPlan || isLoading}
        >
          {isCurrentPlan ? 'Current Plan' : `Choose ${plan.name}`}
        </Button>
      </CardContent>
    </Card>
  );
}
