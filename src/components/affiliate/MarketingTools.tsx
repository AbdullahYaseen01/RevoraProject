"use client"

import { useState, useEffect } from 'react'
import { useSession } from 'next-auth/react'

interface AffiliateProfile {
  promoCode: string
  referralLink: string
}

export default function MarketingTools() {
  const { data: session } = useSession()
  const [profile, setProfile] = useState<AffiliateProfile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (session?.user) {
      fetchProfile()
    }
  }, [session])

  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/affiliate/profile')
      if (response.ok) {
        const data = await response.json()
        setProfile(data)
      }
    } catch (error) {
      console.error('Failed to fetch profile:', error)
    } finally {
      setLoading(false)
    }
  }

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    // You could add a toast notification here
  }

  const generateBannerCode = (size: string) => {
    const bannerUrl = `${process.env.NEXT_PUBLIC_APP_URL}/api/affiliate/banner/${size}?ref=${profile?.referralLink.split('ref=')[1]}`
    return `<a href="${profile?.referralLink}" target="_blank"><img src="${bannerUrl}" alt="Real Estate Investment Platform" /></a>`
  }

  const generateSocialPost = (platform: string) => {
    const messages = {
      instagram: `🏠 Discover the best real estate investment opportunities! 

Join thousands of investors finding profitable properties with our advanced search and analysis tools.

Use my code: ${profile?.promoCode}
Get started: ${profile?.referralLink}

#RealEstate #Investment #PropertySearch #PassiveIncome`,

      twitter: `🏠 Find profitable real estate investments with advanced search tools!

Join thousands of investors discovering great deals.

Use code: ${profile?.promoCode}
${profile?.referralLink}

#RealEstate #Investment #PropertySearch`,

      facebook: `🏠 Looking for profitable real estate investments?

Our platform helps you find and analyze properties with advanced search tools and market data.

Join thousands of successful investors today!

Use my referral code: ${profile?.promoCode}
Get started: ${profile?.referralLink}

#RealEstate #Investment #PropertySearch #PassiveIncome`,

      linkedin: `🏠 Professional Real Estate Investment Platform

Discover profitable investment opportunities with our comprehensive property search and analysis tools.

Features:
✅ Advanced property search
✅ Market analysis
✅ Investment calculations
✅ Professional networking

Use my referral code: ${profile?.promoCode}
Learn more: ${profile?.referralLink}

#RealEstate #Investment #PropertySearch #ProfessionalNetworking`
    }

    return messages[platform as keyof typeof messages] || ''
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!profile) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">No affiliate profile found.</p>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Banner Ads */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Banner Ads</h3>
        <p className="text-gray-600 mb-6">
          Use these banner ads on your website or blog. They automatically include your referral link.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">728x90 Leaderboard</h4>
            <div className="bg-gray-100 rounded p-2 mb-3 text-center">
              <div className="bg-blue-600 text-white text-xs py-1 px-2 rounded inline-block">
                728x90 Banner Preview
              </div>
            </div>
            <div className="space-y-2">
              <button
                onClick={() => copyToClipboard(generateBannerCode('728x90'))}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
              >
                Copy HTML Code
              </button>
              <a
                href={`/api/affiliate/banner/728x90?ref=${profile.referralLink.split('ref=')[1]}`}
                target="_blank"
                className="block w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-sm text-center"
              >
                Download Image
              </a>
            </div>
          </div>

          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">300x250 Medium Rectangle</h4>
            <div className="bg-gray-100 rounded p-2 mb-3 text-center">
              <div className="bg-blue-600 text-white text-xs py-1 px-2 rounded inline-block">
                300x250 Banner Preview
              </div>
            </div>
            <div className="space-y-2">
              <button
                onClick={() => copyToClipboard(generateBannerCode('300x250'))}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
              >
                Copy HTML Code
              </button>
              <a
                href={`/api/affiliate/banner/300x250?ref=${profile.referralLink.split('ref=')[1]}`}
                target="_blank"
                className="block w-full px-4 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 text-sm text-center"
              >
                Download Image
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Social Media Posts */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Social Media Posts</h3>
        <p className="text-gray-600 mb-6">
          Pre-written posts for different social media platforms. Customize them to match your style.
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            { platform: 'instagram', name: 'Instagram', icon: '📷' },
            { platform: 'twitter', name: 'Twitter', icon: '🐦' },
            { platform: 'facebook', name: 'Facebook', icon: '👥' },
            { platform: 'linkedin', name: 'LinkedIn', icon: '💼' }
          ].map((social) => (
            <div key={social.platform} className="border border-gray-200 rounded-lg p-4">
              <div className="flex items-center mb-3">
                <span className="text-2xl mr-2">{social.icon}</span>
                <h4 className="font-medium text-gray-900">{social.name}</h4>
              </div>
              <div className="bg-gray-50 rounded p-3 mb-3 text-sm text-gray-700 max-h-32 overflow-y-auto">
                {generateSocialPost(social.platform)}
              </div>
              <button
                onClick={() => copyToClipboard(generateSocialPost(social.platform))}
                className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
              >
                Copy Post
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Email Templates */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Email Templates</h3>
        <p className="text-gray-600 mb-6">
          Professional email templates for reaching out to your network.
        </p>
        
        <div className="space-y-4">
          <div className="border border-gray-200 rounded-lg p-4">
            <h4 className="font-medium text-gray-900 mb-2">Professional Introduction</h4>
            <div className="bg-gray-50 rounded p-3 mb-3 text-sm text-gray-700">
              Subject: Discover Profitable Real Estate Investment Opportunities

              Hi [Name],

              I hope this email finds you well. I wanted to share an excellent real estate investment platform that I've been using to find profitable properties.

              This platform offers:
              • Advanced property search with detailed filters
              • Market analysis and investment calculations
              • Access to off-market deals
              • Professional networking opportunities

              I've been able to identify several great investment opportunities through their platform, and I think you might find it valuable too.

              You can get started with my referral code: {profile.promoCode}
              Sign up here: {profile.referralLink}

              Let me know if you have any questions!

              Best regards,
              [Your Name]
            </div>
            <button
              onClick={() => copyToClipboard(`Subject: Discover Profitable Real Estate Investment Opportunities

Hi [Name],

I hope this email finds you well. I wanted to share an excellent real estate investment platform that I've been using to find profitable properties.

This platform offers:
• Advanced property search with detailed filters
• Market analysis and investment calculations
• Access to off-market deals
• Professional networking opportunities

I've been able to identify several great investment opportunities through their platform, and I think you might find it valuable too.

You can get started with my referral code: ${profile.promoCode}
Sign up here: ${profile.referralLink}

Let me know if you have any questions!

Best regards,
[Your Name]`)}
              className="w-full px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
            >
              Copy Email Template
            </button>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">Quick Links</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Your Referral Link</p>
              <p className="text-sm text-gray-600 truncate">{profile.referralLink}</p>
            </div>
            <button
              onClick={() => copyToClipboard(profile.referralLink)}
              className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
            >
              Copy
            </button>
          </div>
          
          <div className="flex items-center justify-between p-3 border border-gray-200 rounded-lg">
            <div>
              <p className="font-medium text-gray-900">Your Promo Code</p>
              <p className="text-sm text-gray-600 font-mono">{profile.promoCode}</p>
            </div>
            <button
              onClick={() => copyToClipboard(profile.promoCode)}
              className="px-3 py-1 bg-blue-600 text-white rounded text-sm hover:bg-blue-700"
            >
              Copy
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
