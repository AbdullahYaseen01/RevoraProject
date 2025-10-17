"use client"

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { formatCurrency, formatPercentage, getRelativeTime } from '@/lib/utils'

interface Affiliate {
  id: string
  businessType: string
  promoCode: string
  referralLink: string
  commissionRate: number
  totalEarnings: number
  isApproved: boolean
  createdAt: string
  user: {
    id: string
    email: string
    createdAt: string
  }
  referrals: Array<{
    id: string
    status: string
    createdAt: string
  }>
  commissions: Array<{
    id: string
    amount: number
    status: string
    createdAt: string
  }>
}

export default function AdminAffiliatesPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [affiliates, setAffiliates] = useState<Affiliate[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'pending' | 'approved'>('all')

  useEffect(() => {
    if (session?.user) {
      fetchAffiliates()
    }
  }, [session])

  const fetchAffiliates = async () => {
    try {
      const response = await fetch('/api/admin/affiliates')
      if (response.ok) {
        const data = await response.json()
        setAffiliates(data)
      }
    } catch (error) {
      console.error('Failed to fetch affiliates:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleApprove = async (affiliateId: string) => {
    try {
      const response = await fetch(`/api/admin/affiliates/${affiliateId}/approve`, {
        method: 'POST'
      })
      
      if (response.ok) {
        fetchAffiliates() // Refresh the list
      }
    } catch (error) {
      console.error('Failed to approve affiliate:', error)
    }
  }

  const handleReject = async (affiliateId: string) => {
    if (!confirm('Are you sure you want to reject this affiliate?')) {
      return
    }

    try {
      const response = await fetch(`/api/admin/affiliates/${affiliateId}/reject`, {
        method: 'POST'
      })
      
      if (response.ok) {
        fetchAffiliates() // Refresh the list
      }
    } catch (error) {
      console.error('Failed to reject affiliate:', error)
    }
  }

  const filteredAffiliates = affiliates.filter(affiliate => {
    if (filter === 'pending') return !affiliate.isApproved
    if (filter === 'approved') return affiliate.isApproved
    return true
  })

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Affiliate Management</h1>
        <p className="text-gray-600">Manage affiliate applications and track performance</p>
      </div>

      {/* Filter Tabs */}
      <div className="mb-6">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            {[
              { id: 'all', name: 'All Affiliates', count: affiliates.length },
              { id: 'pending', name: 'Pending Approval', count: affiliates.filter(a => !a.isApproved).length },
              { id: 'approved', name: 'Approved', count: affiliates.filter(a => a.isApproved).length }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setFilter(tab.id as any)}
                className={`py-2 px-1 border-b-2 font-medium text-sm ${
                  filter === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.name} ({tab.count})
              </button>
            ))}
          </nav>
        </div>
      </div>

      {/* Affiliates Table */}
      <div className="bg-white shadow overflow-hidden sm:rounded-md">
        <ul className="divide-y divide-gray-200">
          {filteredAffiliates.map((affiliate) => (
            <li key={affiliate.id} className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center space-x-3">
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        {affiliate.user.email}
                      </p>
                      <p className="text-sm text-gray-500">
                        {affiliate.businessType} • Joined {getRelativeTime(new Date(affiliate.createdAt))}
                      </p>
                    </div>
                    <div className="flex-shrink-0">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        affiliate.isApproved
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {affiliate.isApproved ? 'Approved' : 'Pending'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="mt-2 grid grid-cols-1 md:grid-cols-4 gap-4 text-sm text-gray-600">
                    <div>
                      <span className="font-medium">Promo Code:</span> {affiliate.promoCode}
                    </div>
                    <div>
                      <span className="font-medium">Referrals:</span> {affiliate.referrals.length}
                    </div>
                    <div>
                      <span className="font-medium">Total Earnings:</span> {formatCurrency(affiliate.totalEarnings)}
                    </div>
                    <div>
                      <span className="font-medium">Commission Rate:</span> {formatPercentage(affiliate.commissionRate)}
                    </div>
                  </div>
                </div>

                <div className="flex-shrink-0 flex space-x-2">
                  {!affiliate.isApproved && (
                    <>
                      <button
                        onClick={() => handleApprove(affiliate.id)}
                        className="inline-flex items-center px-3 py-1 border border-transparent text-sm font-medium rounded-md text-white bg-green-600 hover:bg-green-700"
                      >
                        Approve
                      </button>
                      <button
                        onClick={() => handleReject(affiliate.id)}
                        className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
                      >
                        Reject
                      </button>
                    </>
                  )}
                  <button className="inline-flex items-center px-3 py-1 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                    View Details
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {filteredAffiliates.length === 0 && (
        <div className="text-center py-12">
          <div className="text-gray-400 text-6xl mb-4">👥</div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No affiliates found</h3>
          <p className="text-gray-600">No affiliates match the current filter.</p>
        </div>
      )}
    </div>
  )
}
