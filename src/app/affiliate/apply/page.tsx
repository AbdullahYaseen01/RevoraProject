"use client"

import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'

export default function AffiliateApplyPage() {
  const { data: session } = useSession()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    businessType: '',
    instagram: '',
    tiktok: '',
    youtube: '',
    website: '',
    otherPlatforms: '',
    audienceSize: '',
    experience: '',
    whyJoin: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!session?.user) return

    setLoading(true)
    try {
      const response = await fetch('/api/affiliate/apply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        router.push('/affiliate/dashboard')
      } else {
        const error = await response.json()
        console.error('Application failed:', error)
      }
    } catch (error) {
      console.error('Application error:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  if (!session) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900">Sign In Required</h2>
            <p className="mt-2 text-gray-600">Please sign in to apply for the affiliate program.</p>
            <a
              href="/auth/signin"
              className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
            >
              Sign In
            </a>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg rounded-lg">
          <div className="px-6 py-8">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Join Our Affiliate Program</h1>
              <p className="text-lg text-gray-600">
                Earn 25% recurring commissions on every subscription you refer
              </p>
            </div>

            {/* Benefits Section */}
            <div className="bg-blue-50 rounded-lg p-6 mb-8">
              <h2 className="text-xl font-semibold text-blue-900 mb-4">Why Join Our Affiliate Program?</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex items-start space-x-3">
                  <span className="text-blue-600 text-xl">💰</span>
                  <div>
                    <h3 className="font-medium text-blue-900">25% Recurring Commissions</h3>
                    <p className="text-sm text-blue-700">Earn on every monthly subscription</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-blue-600 text-xl">🔄</span>
                  <div>
                    <h3 className="font-medium text-blue-900">Recurring Revenue</h3>
                    <p className="text-sm text-blue-700">Commissions continue as long as they stay subscribed</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-blue-600 text-xl">📊</span>
                  <div>
                    <h3 className="font-medium text-blue-900">Real-time Tracking</h3>
                    <p className="text-sm text-blue-700">Monitor your referrals and earnings</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <span className="text-blue-600 text-xl">🛠️</span>
                  <div>
                    <h3 className="font-medium text-blue-900">Marketing Tools</h3>
                    <p className="text-sm text-blue-700">Banners, links, and promotional materials</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Application Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label htmlFor="businessType" className="block text-sm font-medium text-gray-700 mb-2">
                  Business Type *
                </label>
                <select
                  id="businessType"
                  name="businessType"
                  required
                  value={formData.businessType}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select your business type</option>
                  <option value="influencer">Influencer/Content Creator</option>
                  <option value="blogger">Blogger</option>
                  <option value="youtuber">YouTuber</option>
                  <option value="podcaster">Podcaster</option>
                  <option value="real_estate_agent">Real Estate Agent</option>
                  <option value="investor">Real Estate Investor</option>
                  <option value="marketing_agency">Marketing Agency</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="instagram" className="block text-sm font-medium text-gray-700 mb-2">
                    Instagram Handle
                  </label>
                  <input
                    type="text"
                    id="instagram"
                    name="instagram"
                    value={formData.instagram}
                    onChange={handleChange}
                    placeholder="@yourhandle"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="tiktok" className="block text-sm font-medium text-gray-700 mb-2">
                    TikTok Handle
                  </label>
                  <input
                    type="text"
                    id="tiktok"
                    name="tiktok"
                    value={formData.tiktok}
                    onChange={handleChange}
                    placeholder="@yourhandle"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="youtube" className="block text-sm font-medium text-gray-700 mb-2">
                    YouTube Channel
                  </label>
                  <input
                    type="text"
                    id="youtube"
                    name="youtube"
                    value={formData.youtube}
                    onChange={handleChange}
                    placeholder="Channel name or URL"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label htmlFor="website" className="block text-sm font-medium text-gray-700 mb-2">
                    Website/Blog
                  </label>
                  <input
                    type="url"
                    id="website"
                    name="website"
                    value={formData.website}
                    onChange={handleChange}
                    placeholder="https://yourwebsite.com"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="otherPlatforms" className="block text-sm font-medium text-gray-700 mb-2">
                  Other Platforms
                </label>
                <input
                  type="text"
                  id="otherPlatforms"
                  name="otherPlatforms"
                  value={formData.otherPlatforms}
                  onChange={handleChange}
                  placeholder="Twitter, LinkedIn, Facebook, etc."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label htmlFor="audienceSize" className="block text-sm font-medium text-gray-700 mb-2">
                  Audience Size *
                </label>
                <select
                  id="audienceSize"
                  name="audienceSize"
                  required
                  value={formData.audienceSize}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select audience size</option>
                  <option value="under_1k">Under 1,000</option>
                  <option value="1k_10k">1,000 - 10,000</option>
                  <option value="10k_50k">10,000 - 50,000</option>
                  <option value="50k_100k">50,000 - 100,000</option>
                  <option value="100k_500k">100,000 - 500,000</option>
                  <option value="500k_1m">500,000 - 1,000,000</option>
                  <option value="over_1m">Over 1,000,000</option>
                </select>
              </div>

              <div>
                <label htmlFor="experience" className="block text-sm font-medium text-gray-700 mb-2">
                  Affiliate Marketing Experience *
                </label>
                <select
                  id="experience"
                  name="experience"
                  required
                  value={formData.experience}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select experience level</option>
                  <option value="beginner">Beginner (0-6 months)</option>
                  <option value="intermediate">Intermediate (6 months - 2 years)</option>
                  <option value="advanced">Advanced (2+ years)</option>
                </select>
              </div>

              <div>
                <label htmlFor="whyJoin" className="block text-sm font-medium text-gray-700 mb-2">
                  Why do you want to join our affiliate program? *
                </label>
                <textarea
                  id="whyJoin"
                  name="whyJoin"
                  required
                  rows={4}
                  value={formData.whyJoin}
                  onChange={handleChange}
                  placeholder="Tell us about your audience and how you plan to promote our platform..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center">
                <input
                  id="terms"
                  name="terms"
                  type="checkbox"
                  required
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="terms" className="ml-2 block text-sm text-gray-900">
                  I agree to the{' '}
                  <a href="/terms" className="text-blue-600 hover:text-blue-500">
                    Terms of Service
                  </a>{' '}
                  and{' '}
                  <a href="/privacy" className="text-blue-600 hover:text-blue-500">
                    Privacy Policy
                  </a>
                </label>
              </div>

              <div>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Submitting Application...' : 'Submit Application'}
                </button>
              </div>
      </form>
          </div>
        </div>
      </div>
    </div>
  )
}