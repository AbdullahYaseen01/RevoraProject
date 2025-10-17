"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import DashboardNav from "@/components/dashboard/nav"
import StatsCards from "@/components/dashboard/stats-cards"
import RecentActivity from "@/components/dashboard/recent-activity"
import QuickActions from "@/components/dashboard/quick-actions"
import PropertyPreview from "@/components/dashboard/property-preview"
import QuickSearch from "@/components/property-search/QuickSearch"
import { SubscriptionCard } from "@/components/subscription/SubscriptionCard"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CreditCard, Settings, AlertCircle } from "lucide-react"
import { useState, useEffect } from "react"
import { SubscriptionTier, SubscriptionStatus } from "@/types/stripe"

export default function Dashboard() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [subscription, setSubscription] = useState<any>(null)
  const [isLoadingSubscription, setIsLoadingSubscription] = useState(true)

  useEffect(() => {
    if (status === "loading") return

    if (!session) {
      router.push("/auth/signin")
      return
    }

    // Load subscription data
    loadSubscription()
  }, [session, status, router])

  const loadSubscription = async () => {
    try {
      setIsLoadingSubscription(true)
      const response = await fetch('/api/subscriptions')
      const data = await response.json()
      
      if (data.success && data.data?.length > 0) {
        const activeSubscription = data.data.find((sub: any) => 
          sub.status === 'active' || (sub.status === 'canceled' && sub.cancelAtPeriodEnd)
        )
        setSubscription(activeSubscription)
      }
    } catch (error) {
      console.error('Failed to load subscription:', error)
    } finally {
      setIsLoadingSubscription(false)
    }
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNav />

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Welcome back, {session.user.name}
            </h1>
            <p className="text-gray-600">
              Here's what's happening with your real estate investments today.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
            <div className="lg:col-span-3">
              <StatsCards />

              <div className="mt-6">
                <RecentActivity />
              </div>
            </div>

            <div className="space-y-6">
              <QuickSearch />
              <QuickActions />
              <PropertyPreview />
              
              {/* Subscription Status */}
              {isLoadingSubscription ? (
                <Card>
                  <CardContent className="p-6">
                    <div className="animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                    </div>
                  </CardContent>
                </Card>
              ) : subscription ? (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="w-5 h-5" />
                      Subscription Status
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Current Plan</span>
                        <Badge variant="outline">{subscription.tier}</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">Status</span>
                        <Badge 
                          variant={subscription.status === 'active' ? 'default' : 'destructive'}
                        >
                          {subscription.status}
                        </Badge>
                      </div>
                      {subscription.cancelAtPeriodEnd && (
                        <div className="flex items-center gap-2 p-2 bg-yellow-50 border border-yellow-200 rounded">
                          <AlertCircle className="w-4 h-4 text-yellow-600" />
                          <span className="text-sm text-yellow-800">
                            Subscription will cancel on {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
                          </span>
                        </div>
                      )}
                      <Button variant="outline" size="sm" asChild className="w-full">
                        <a href="/subscription">
                          <Settings className="w-4 h-4 mr-2" />
                          Manage Subscription
                        </a>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <CreditCard className="w-5 h-5" />
                      No Active Subscription
                    </CardTitle>
                    <CardDescription>
                      You're currently on the free plan
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button asChild className="w-full">
                      <a href="/pricing">
                        <CreditCard className="w-4 h-4 mr-2" />
                        Upgrade Now
                      </a>
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
