"use client"

import { useEffect } from 'react'
import { useRouter } from 'next/router'
import { ReferralTracking } from '@/lib/referral-tracking'

export default function ReferralTracker() {
  const router = useRouter()

  useEffect(() => {
    // Initialize referral tracking
    ReferralTracking.init()
  }, [])

  return null // This component doesn't render anything
}
