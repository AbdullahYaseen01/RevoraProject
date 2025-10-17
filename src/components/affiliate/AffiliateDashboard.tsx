"use client"

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { formatCurrency, formatPercentage, getRelativeTime } from '@/lib/utils'

interface AffiliateStats {
  totalEarnings: number
  pendingEarnings: number
  paidEarnings: number
  totalReferrals: number
  convertedReferrals: number
  conversionRate: number
  monthlyEarnings: number
  lifetimeEarnings: number
}

interface Commission {
  id: string
  amount: number
  rate: number
  status: string
  createdAt: string
  paymentDate?: string
  referral?: {
    referredUser: {
      email: string
    }
  }
  subscription?: {
    tier: string
    status: string
  }
}

interface AffiliateProfile {
  id: string
  promoCode: string
  referralLink: string
  commissionRate: number
  totalEarnings: number
  isApproved: boolean
  createdAt: string
}

export default function AffiliateDashboard() {
  const { data: session } = useSession()
  const [stats, setStats] = useState<AffiliateStats | null>(null)
  const [commissions, setCommissions] = useState<Commission[]>([])
  const [profile, setProfile] = useState<AffiliateProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'overview' | 'commissions' | 'referrals' | 'tools'>('overview')

  useEffect(() => {
    if (session?.user) {
      fetchAffiliateData()
    }
  }, [session])

  const fetchAffiliateData = async () => {
    try {
      const [statsRes, commissionsRes, profileRes] = await Promise.all([
        fetch('/api/affiliate/stats'),
        fetch('/api/affiliate/commissions'),
        fetch('/api/affiliate/profile')
      ])

      if (statsRes.ok) {
        const statsData = await statsRes.json()
        setStats(statsData)
      }

      if (commissionsRes.ok) {
        const commissionsData = await commissionsRes.json()
        setCommissions(commissionsData)
      }

      if (profileRes.ok) {
        const profileData = await profileRes.json()
        setProfile(profileData)
      }
    } catch (error) {
      console.error('Failed to fetch affiliate data:', error)
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    // You could add a toast notification here
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Affiliate Program</h1>
          <p className="text-gray-600 mb-8">Join our affiliate program and earn 25% recurring commissions!</p>
          <a
            href="/affiliate/apply"
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
          >
            Apply to Become an Affiliate
          </a>
        </div>
      </div>
    )
  }

  if (!profile.isApproved) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-6">
          <div className="flex">
            <div className="flex-shrink-0">
              <span className="text-yellow-400 text-2xl">⏳</span>
            </div>
            <div className="ml-3">
              <h3 className="text-lg font-medium text-yellow-800">Application Under Review</h3>
              <div className="mt-2 text-sm text-yellow-700">
                <p>Your affiliate application is currently under review. We'll notify you once it's approved.</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Affiliate Dashboard</h1>
        <p className="text-gray-600">Track your earnings and manage your referrals</p>
      </div>

      {/* Stats Cards */}
      {stats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-2xl">💰</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Earnings</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {formatCurrency(stats.totalEarnings)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-2xl">⏳</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Pending Earnings</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {formatCurrency(stats.pendingEarnings)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-2xl">👥</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Referrals</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {stats.totalReferrals}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <span className="text-2xl">📈</span>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Conversion Rate</p>
                <p className="text-2xl font-semibold text-gray-900">
                  {formatPercentage(stats.conversionRate / 100)}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Tabs */}
      <div className="bg-white rounded-lg shadow">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8 px-6">
            {[
              { id: 'overview', name: 'Overview', icon: '📊' },
              { id: 'commissions', name: 'Commissions', icon: '💰' },
              { id: 'referrals', name: 'Referrals', icon: '👥' },
              { id: 'tools', name: 'Marketing Tools', icon: '🛠️' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 px-1 border-b-2 font-medium text-sm ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.name}
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Referral Link */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Your Referral Link</h3>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={profile.referralLink}
                      readOnly
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-white text-sm"
                    />
                    <button
                      onClick={() => copyToClipboard(profile.referralLink)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                    >
                      Copy
                    </button>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    Share this link to earn commissions on every signup and subscription
                  </p>
                </div>

                {/* Promo Code */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-medium text-gray-900 mb-4">Your Promo Code</h3>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={profile.promoCode}
                      readOnly
                      className="flex-1 px-3 py-2 border border-gray-300 rounded-md bg-white text-sm font-mono"
                    />
                    <button
                      onClick={() => copyToClipboard(profile.promoCode)}
                      className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
                    >
                      Copy
                    </button>
                  </div>
                  <p className="text-sm text-gray-600 mt-2">
                    Use this code for special promotions and tracking
                  </p>
                </div>
              </div>

              {/* Commission Rate */}
              <div className="bg-blue-50 rounded-lg p-6">
                <h3 className="text-lg font-medium text-blue-900 mb-2">Commission Structure</h3>
                <p className="text-blue-800">
                  You earn <strong>{formatPercentage(profile.commissionRate)}</strong> recurring commission on every subscription from your referrals.
                </p>
                <p className="text-sm text-blue-700 mt-2">
                  Commissions are paid monthly and include both initial signups and recurring subscriptions.
                </p>
              </div>
            </div>
          )}

          {/* Commissions Tab */}
          {activeTab === 'commissions' && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Commission History</h3>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Date
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Referral
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Amount
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Status
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {commissions.map((commission) => (
                      <tr key={commission.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {getRelativeTime(new Date(commission.createdAt))}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {commission.referral?.referredUser.email || 'N/A'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          {formatCurrency(commission.amount)}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                            commission.status === 'paid' 
                              ? 'bg-green-100 text-green-800'
                              : commission.status === 'pending'
                              ? 'bg-yellow-100 text-yellow-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {commission.status}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Referrals Tab */}
          {activeTab === 'referrals' && (
            <div>
              <h3 className="text-lg font-medium text-gray-900 mb-4">Your Referrals</h3>
              <p className="text-gray-600 mb-4">
                Track the users you've referred and their conversion status.
              </p>
              {/* Referrals table would go here */}
            </div>
          )}

          {/* Marketing Tools Tab */}
          {activeTab === 'tools' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900">Marketing Tools</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="font-medium text-gray-900 mb-2">Banner Ads</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Use these banner ads on your website or social media
                  </p>
                  <div className="space-y-2">
                    <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm">
                      Download 728x90 Banner
                    </button>
                    <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm">
                      Download 300x250 Banner
                    </button>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-lg p-6">
                  <h4 className="font-medium text-gray-900 mb-2">Social Media Posts</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Pre-written posts for different social platforms
                  </p>
                  <div className="space-y-2">
                    <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm">
                      Copy Instagram Post
                    </button>
                    <button className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm">
                      Copy Twitter Post
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
