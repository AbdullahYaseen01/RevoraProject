"use client"

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import Link from 'next/link'

export default function AffiliateProgramPage() {
  const { data: session } = useSession()
  const [stats, setStats] = useState({
    totalAffiliates: 0,
    totalCommissions: 0,
    totalReferrals: 0
  })

  useEffect(() => {
    fetchStats()
  }, [])

  const fetchStats = async () => {
    try {
      const response = await fetch('/api/affiliate/public-stats')
      if (response.ok) {
        const data = await response.json()
        setStats(data)
      }
    } catch (error) {
      console.error('Failed to fetch stats:', error)
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-24">
          <div className="text-center">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              Affiliate Program
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-blue-100">
              Earn 25% recurring commissions on every subscription you refer
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                href="/affiliate/apply"
                className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-md text-blue-600 bg-white hover:bg-gray-50 transition-colors"
              >
                Join Now - It's Free
              </Link>
              <Link
                href="/affiliate/dashboard"
                className="inline-flex items-center px-8 py-4 border-2 border-white text-lg font-medium rounded-md text-white hover:bg-white hover:text-blue-600 transition-colors"
              >
                Affiliate Dashboard
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Join Our Growing Community
            </h2>
            <p className="text-lg text-gray-600">
              Over {stats.totalAffiliates} affiliates have earned ${stats.totalCommissions.toLocaleString()} in commissions
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">
                {stats.totalAffiliates}+
              </div>
              <div className="text-lg text-gray-600">Active Affiliates</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-green-600 mb-2">
                ${stats.totalCommissions.toLocaleString()}
              </div>
              <div className="text-lg text-gray-600">Total Commissions Paid</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-600 mb-2">
                {stats.totalReferrals}+
              </div>
              <div className="text-lg text-gray-600">Successful Referrals</div>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why Choose Our Affiliate Program?
            </h2>
            <p className="text-lg text-gray-600">
              We offer the most competitive commission structure in the real estate industry
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <div className="text-4xl mb-4">💰</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">25% Recurring Commissions</h3>
              <p className="text-gray-600">
                Earn 25% on every monthly subscription from your referrals, for as long as they stay subscribed.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <div className="text-4xl mb-4">🔄</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Recurring Revenue</h3>
              <p className="text-gray-600">
                Build a sustainable income stream with monthly recurring commissions that grow over time.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <div className="text-4xl mb-4">📊</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Real-time Tracking</h3>
              <p className="text-gray-600">
                Monitor your referrals, earnings, and performance with our comprehensive dashboard.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <div className="text-4xl mb-4">🛠️</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Marketing Tools</h3>
              <p className="text-gray-600">
                Access banners, social media posts, email templates, and other promotional materials.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <div className="text-4xl mb-4">⚡</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Fast Payouts</h3>
              <p className="text-gray-600">
                Get paid monthly with automatic payouts to your bank account or PayPal.
              </p>
            </div>

            <div className="bg-white rounded-lg shadow-lg p-8 text-center">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">High Converting</h3>
              <p className="text-gray-600">
                Our platform has a high conversion rate, making it easier to earn commissions.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              How It Works
            </h2>
            <p className="text-lg text-gray-600">
              Get started in just 3 simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                1
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Apply to Join</h3>
              <p className="text-gray-600">
                Fill out our simple application form and tell us about your audience and marketing experience.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                2
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Get Approved</h3>
              <p className="text-gray-600">
                We review your application and approve qualified affiliates within 24-48 hours.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center text-2xl font-bold mx-auto mb-6">
                3
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">Start Earning</h3>
              <p className="text-gray-600">
                Share your referral links and start earning 25% recurring commissions on every signup.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Commission Structure */}
      <div className="py-16 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Commission Structure
            </h2>
            <p className="text-lg text-gray-600">
              Transparent and competitive commission rates
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Commission Rates</h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-gray-600">Basic Plan ($29/month)</span>
                    <span className="font-semibold text-green-600">$7.25/month</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-gray-600">Pro Plan ($49/month)</span>
                    <span className="font-semibold text-green-600">$12.25/month</span>
                  </div>
                  <div className="flex justify-between items-center py-2 border-b border-gray-200">
                    <span className="text-gray-600">Enterprise Plan ($99/month)</span>
                    <span className="font-semibold text-green-600">$24.75/month</span>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-4">Payment Terms</h3>
                <div className="space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="text-green-600 text-xl">✓</div>
                    <div>
                      <div className="font-medium text-gray-900">Monthly Payouts</div>
                      <div className="text-sm text-gray-600">Commissions paid on the 1st of each month</div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="text-green-600 text-xl">✓</div>
                    <div>
                      <div className="font-medium text-gray-900">$10 Minimum</div>
                      <div className="text-sm text-gray-600">Minimum payout threshold</div>
                    </div>
                  </div>
                  <div className="flex items-start space-x-3">
                    <div className="text-green-600 text-xl">✓</div>
                    <div>
                      <div className="font-medium text-gray-900">Multiple Methods</div>
                      <div className="text-sm text-gray-600">Bank transfer, PayPal, or Stripe</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="py-16 bg-blue-600 text-white">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Ready to Start Earning?
          </h2>
          <p className="text-xl mb-8 text-blue-100">
            Join our affiliate program today and start building your recurring income stream.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/affiliate/apply"
              className="inline-flex items-center px-8 py-4 border border-transparent text-lg font-medium rounded-md text-blue-600 bg-white hover:bg-gray-50 transition-colors"
            >
              Apply Now
            </Link>
            <Link
              href="/contact"
              className="inline-flex items-center px-8 py-4 border-2 border-white text-lg font-medium rounded-md text-white hover:bg-white hover:text-blue-600 transition-colors"
            >
              Contact Us
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
