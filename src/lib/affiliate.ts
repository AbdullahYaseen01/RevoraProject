import { prisma } from './db'
import { generateReferralCode, generatePromoCode } from './utils'

export interface AffiliateStats {
  totalEarnings: number
  pendingEarnings: number
  paidEarnings: number
  totalReferrals: number
  convertedReferrals: number
  conversionRate: number
  monthlyEarnings: number
  lifetimeEarnings: number
}

export interface CommissionCalculation {
  baseAmount: number
  commissionRate: number
  commissionAmount: number
  isRecurring: boolean
}

export class AffiliateService {
  /**
   * Create a new affiliate profile
   */
  static async createAffiliateProfile(userId: string, data: {
    businessType: string
    socialMedia: any
  }) {
    const promoCode = generatePromoCode()
    const referralCode = generateReferralCode()
    const referralLink = `${process.env.NEXT_PUBLIC_APP_URL}/signup?ref=${referralCode}`

    return await prisma.affiliateProfile.create({
      data: {
        userId,
        businessType: data.businessType,
        socialMedia: data.socialMedia,
        promoCode,
        referralLink,
        commissionRate: 0.25, // 25%
        totalEarnings: 0,
        isApproved: false
      }
    })
  }

  /**
   * Get affiliate profile by user ID
   */
  static async getAffiliateProfile(userId: string) {
    return await prisma.affiliateProfile.findUnique({
      where: { userId },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            role: true
          }
        },
        referrals: {
          include: {
            referredUser: {
              select: {
                id: true,
                email: true,
                createdAt: true
              }
            }
          }
        },
        commissions: {
          orderBy: { createdAt: 'desc' }
        }
      }
    })
  }

  /**
   * Get affiliate statistics
   */
  static async getAffiliateStats(affiliateId: string): Promise<AffiliateStats> {
    const [referrals, commissions, monthlyCommissions] = await Promise.all([
      prisma.referral.findMany({
        where: { affiliateId }
      }),
      prisma.commission.findMany({
        where: { affiliateId }
      }),
      prisma.commission.findMany({
        where: {
          affiliateId,
          createdAt: {
            gte: new Date(new Date().getFullYear(), new Date().getMonth(), 1)
          }
        }
      })
    ])

    const totalReferrals = referrals.length
    const convertedReferrals = referrals.filter(r => r.status === 'converted').length
    const conversionRate = totalReferrals > 0 ? (convertedReferrals / totalReferrals) * 100 : 0

    const totalEarnings = commissions.reduce((sum, c) => sum + c.amount, 0)
    const pendingEarnings = commissions
      .filter(c => c.status === 'pending')
      .reduce((sum, c) => sum + c.amount, 0)
    const paidEarnings = commissions
      .filter(c => c.status === 'paid')
      .reduce((sum, c) => sum + c.amount, 0)
    const monthlyEarnings = monthlyCommissions.reduce((sum, c) => sum + c.amount, 0)

    return {
      totalEarnings,
      pendingEarnings,
      paidEarnings,
      totalReferrals,
      convertedReferrals,
      conversionRate,
      monthlyEarnings,
      lifetimeEarnings: totalEarnings
    }
  }

  /**
   * Track a referral
   */
  static async trackReferral(referralCode: string, userId: string) {
    // Find affiliate by referral code
    const affiliate = await prisma.affiliateProfile.findFirst({
      where: {
        referralLink: {
          contains: referralCode
        }
      }
    })

    if (!affiliate) {
      throw new Error('Invalid referral code')
    }

    // Check if user already has a referral
    const existingReferral = await prisma.referral.findUnique({
      where: { referredUserId: userId }
    })

    if (existingReferral) {
      return existingReferral
    }

    // Create new referral
    return await prisma.referral.create({
      data: {
        affiliateId: affiliate.id,
        referredUserId: userId,
        referralCode,
        status: 'pending'
      }
    })
  }

  /**
   * Convert a referral (when user subscribes)
   */
  static async convertReferral(userId: string, subscriptionId: string, subscriptionAmount: number) {
    const referral = await prisma.referral.findUnique({
      where: { referredUserId: userId },
      include: { affiliate: true }
    })

    if (!referral) {
      return null
    }

    // Update referral status
    await prisma.referral.update({
      where: { id: referral.id },
      data: {
        status: 'converted',
        conversionDate: new Date()
      }
    })

    // Calculate commission
    const commissionAmount = subscriptionAmount * referral.affiliate.commissionRate

    // Create commission record
    const commission = await prisma.commission.create({
      data: {
        affiliateId: referral.affiliateId,
        referralId: referral.id,
        subscriptionId,
        amount: commissionAmount,
        rate: referral.affiliate.commissionRate,
        status: 'pending'
      }
    })

    // Update affiliate total earnings
    await prisma.affiliateProfile.update({
      where: { id: referral.affiliateId },
      data: {
        totalEarnings: {
          increment: commissionAmount
        }
      }
    })

    return commission
  }

  /**
   * Process recurring commission (monthly)
   */
  static async processRecurringCommission(subscriptionId: string, amount: number) {
    const subscription = await prisma.subscription.findUnique({
      where: { id: subscriptionId },
      include: {
        user: {
          include: {
            referral: {
              include: {
                affiliate: true
              }
            }
          }
        }
      }
    })

    if (!subscription?.user?.referral) {
      return null
    }

    const referral = subscription.user.referral
    const commissionAmount = amount * referral.affiliate.commissionRate

    // Create recurring commission
    const commission = await prisma.commission.create({
      data: {
        affiliateId: referral.affiliateId,
        referralId: referral.id,
        subscriptionId,
        amount: commissionAmount,
        rate: referral.affiliate.commissionRate,
        status: 'pending'
      }
    })

    // Update affiliate total earnings
    await prisma.affiliateProfile.update({
      where: { id: referral.affiliateId },
      data: {
        totalEarnings: {
          increment: commissionAmount
        }
      }
    })

    return commission
  }

  /**
   * Calculate commission for a given amount
   */
  static calculateCommission(amount: number, rate: number = 0.25): CommissionCalculation {
    return {
      baseAmount: amount,
      commissionRate: rate,
      commissionAmount: amount * rate,
      isRecurring: true
    }
  }

  /**
   * Get all affiliates (admin function)
   */
  static async getAllAffiliates() {
    return await prisma.affiliateProfile.findMany({
      include: {
        user: {
          select: {
            id: true,
            email: true,
            createdAt: true
          }
        },
        referrals: true,
        commissions: true
      },
      orderBy: { createdAt: 'desc' }
    })
  }

  /**
   * Approve affiliate
   */
  static async approveAffiliate(affiliateId: string) {
    return await prisma.affiliateProfile.update({
      where: { id: affiliateId },
      data: { isApproved: true }
    })
  }

  /**
   * Reject affiliate
   */
  static async rejectAffiliate(affiliateId: string) {
    return await prisma.affiliateProfile.delete({
      where: { id: affiliateId }
    })
  }

  /**
   * Get pending commissions for payout
   */
  static async getPendingCommissions(affiliateId?: string) {
    const where = affiliateId ? { affiliateId, status: 'pending' } : { status: 'pending' }
    
    return await prisma.commission.findMany({
      where,
      include: {
        affiliate: {
          include: {
            user: {
              select: {
                id: true,
                email: true
              }
            }
          }
        },
        referral: {
          include: {
            referredUser: {
              select: {
                id: true,
                email: true
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'asc' }
    })
  }

  /**
   * Mark commission as paid
   */
  static async markCommissionPaid(commissionId: string, stripePayoutId: string) {
    return await prisma.commission.update({
      where: { id: commissionId },
      data: {
        status: 'paid',
        paymentDate: new Date(),
        stripePayoutId
      }
    })
  }

  /**
   * Get commission history for affiliate
   */
  static async getCommissionHistory(affiliateId: string, limit: number = 50) {
    return await prisma.commission.findMany({
      where: { affiliateId },
      include: {
        referral: {
          include: {
            referredUser: {
              select: {
                id: true,
                email: true
              }
            }
          }
        },
        subscription: {
          select: {
            id: true,
            tier: true,
            status: true
          }
        }
      },
      orderBy: { createdAt: 'desc' },
      take: limit
    })
  }
}
