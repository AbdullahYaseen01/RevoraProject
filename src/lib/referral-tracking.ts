import { AffiliateService } from './affiliate'

export class ReferralTracking {
  /**
   * Extract referral code from URL
   */
  static extractReferralCode(url: string): string | null {
    const urlObj = new URL(url)
    const refParam = urlObj.searchParams.get('ref')
    return refParam
  }

  /**
   * Store referral code in cookies/localStorage
   */
  static storeReferralCode(referralCode: string) {
    if (typeof window !== 'undefined') {
      // Store in localStorage for persistence
      localStorage.setItem('referral_code', referralCode)
      
      // Store in sessionStorage for current session
      sessionStorage.setItem('referral_code', referralCode)
      
      // Set cookie for server-side access
      document.cookie = `referral_code=${referralCode}; path=/; max-age=${30 * 24 * 60 * 60}` // 30 days
    }
  }

  /**
   * Get stored referral code
   */
  static getStoredReferralCode(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('referral_code') || sessionStorage.getItem('referral_code')
    }
    return null
  }

  /**
   * Clear stored referral code
   */
  static clearReferralCode() {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('referral_code')
      sessionStorage.removeItem('referral_code')
      document.cookie = 'referral_code=; path=/; expires=Thu, 01 Jan 1970 00:00:01 GMT'
    }
  }

  /**
   * Track referral when user signs up
   */
  static async trackUserSignup(userId: string) {
    const referralCode = this.getStoredReferralCode()
    
    if (referralCode) {
      try {
        await fetch('/api/affiliate/track', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            referralCode,
            userId
          })
        })
        
        // Clear the referral code after successful tracking
        this.clearReferralCode()
      } catch (error) {
        console.error('Failed to track referral:', error)
      }
    }
  }

  /**
   * Convert referral when user subscribes
   */
  static async convertReferral(userId: string, subscriptionId: string, subscriptionAmount: number) {
    try {
      await fetch('/api/affiliate/convert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId,
          subscriptionId,
          subscriptionAmount
        })
      })
    } catch (error) {
      console.error('Failed to convert referral:', error)
    }
  }

  /**
   * Generate referral URL with tracking
   */
  static generateReferralUrl(baseUrl: string, referralCode: string): string {
    const url = new URL(baseUrl)
    url.searchParams.set('ref', referralCode)
    return url.toString()
  }

  /**
   * Check if current URL has referral code
   */
  static hasReferralCode(): boolean {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search)
      return urlParams.has('ref')
    }
    return false
  }

  /**
   * Initialize referral tracking on page load
   */
  static init() {
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search)
      const referralCode = urlParams.get('ref')
      
      if (referralCode) {
        this.storeReferralCode(referralCode)
        
        // Clean up URL (remove ref parameter)
        const newUrl = new URL(window.location.href)
        newUrl.searchParams.delete('ref')
        window.history.replaceState({}, document.title, newUrl.toString())
      }
    }
  }
}
