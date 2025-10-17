import { prisma } from './db'
import { AffiliateService } from './affiliate'

export interface PayoutRequest {
  affiliateId: string
  amount: number
  commissions: string[] // Commission IDs to include in payout
}

export interface PayoutResult {
  success: boolean
  payoutId?: string
  error?: string
}

export class CommissionPaymentService {
  /**
   * Process monthly commission payouts
   */
  static async processMonthlyPayouts() {
    try {
      // Get all pending commissions
      const pendingCommissions = await AffiliateService.getPendingCommissions()
      
      // Group by affiliate
      const affiliateCommissions = pendingCommissions.reduce((acc, commission) => {
        if (!acc[commission.affiliateId]) {
          acc[commission.affiliateId] = []
        }
        acc[commission.affiliateId].push(commission)
        return acc
      }, {} as Record<string, typeof pendingCommissions>)

      const results = []

      // Process each affiliate's commissions
      for (const [affiliateId, commissions] of Object.entries(affiliateCommissions)) {
        const totalAmount = commissions.reduce((sum, c) => sum + c.amount, 0)
        
        // Only process if total amount is above minimum threshold ($10)
        if (totalAmount >= 10) {
          const result = await this.processAffiliatePayout(affiliateId, totalAmount, commissions.map(c => c.id))
          results.push(result)
        }
      }

      return results
    } catch (error) {
      console.error('Monthly payout processing error:', error)
      throw error
    }
  }

  /**
   * Process payout for a specific affiliate
   */
  static async processAffiliatePayout(
    affiliateId: string, 
    amount: number, 
    commissionIds: string[]
  ): Promise<PayoutResult> {
    try {
      // Get affiliate profile
      const affiliate = await prisma.affiliateProfile.findUnique({
        where: { id: affiliateId },
        include: { user: true }
      })

      if (!affiliate) {
        return { success: false, error: 'Affiliate not found' }
      }

      // Check if affiliate has bank account connected
      if (!affiliate.bankAccountId) {
        return { success: false, error: 'No bank account connected' }
      }

      // Here you would integrate with Stripe Connect or your payment processor
      // For now, we'll simulate the payment
      const payoutId = `payout_${Date.now()}_${affiliateId}`

      // Mark commissions as paid
      await prisma.commission.updateMany({
        where: {
          id: { in: commissionIds }
        },
        data: {
          status: 'paid',
          paymentDate: new Date(),
          stripePayoutId: payoutId
        }
      })

      // Log the payout (you might want to create a Payout model)
      console.log(`Processed payout: ${payoutId} for affiliate ${affiliateId}, amount: $${amount}`)

      return { success: true, payoutId }
    } catch (error) {
      console.error('Affiliate payout error:', error)
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }

  /**
   * Get payout history for an affiliate
   */
  static async getPayoutHistory(affiliateId: string) {
    return await prisma.commission.findMany({
      where: {
        affiliateId,
        status: 'paid',
        stripePayoutId: { not: null }
      },
      orderBy: { paymentDate: 'desc' },
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
        }
      }
    })
  }

  /**
   * Calculate total pending payout for an affiliate
   */
  static async getPendingPayoutAmount(affiliateId: string): Promise<number> {
    const pendingCommissions = await prisma.commission.findMany({
      where: {
        affiliateId,
        status: 'pending'
      }
    })

    return pendingCommissions.reduce((sum, commission) => sum + commission.amount, 0)
  }

  /**
   * Request manual payout (for affiliates)
   */
  static async requestManualPayout(affiliateId: string): Promise<PayoutResult> {
    try {
      const pendingAmount = await this.getPendingPayoutAmount(affiliateId)
      
      if (pendingAmount < 10) {
        return { 
          success: false, 
          error: `Minimum payout amount is $10. You have $${pendingAmount.toFixed(2)} pending.` 
        }
      }

      const pendingCommissions = await prisma.commission.findMany({
        where: {
          affiliateId,
          status: 'pending'
        }
      })

      return await this.processAffiliatePayout(
        affiliateId, 
        pendingAmount, 
        pendingCommissions.map(c => c.id)
      )
    } catch (error) {
      console.error('Manual payout request error:', error)
      return { success: false, error: error instanceof Error ? error.message : 'Unknown error' }
    }
  }

  /**
   * Get payout statistics
   */
  static async getPayoutStats() {
    const [totalPaid, totalPending, totalAffiliates] = await Promise.all([
      prisma.commission.aggregate({
        where: { status: 'paid' },
        _sum: { amount: true }
      }),
      prisma.commission.aggregate({
        where: { status: 'pending' },
        _sum: { amount: true }
      }),
      prisma.affiliateProfile.count({
        where: { isApproved: true }
      })
    ])

    return {
      totalPaid: totalPaid._sum.amount || 0,
      totalPending: totalPending._sum.amount || 0,
      totalAffiliates,
      averagePayout: totalAffiliates > 0 ? (totalPaid._sum.amount || 0) / totalAffiliates : 0
    }
  }

  /**
   * Schedule monthly payouts (to be called by a cron job)
   */
  static async scheduleMonthlyPayouts() {
    console.log('Starting monthly commission payouts...')
    
    try {
      const results = await this.processMonthlyPayouts()
      const successful = results.filter(r => r.success).length
      const failed = results.filter(r => !r.success).length
      
      console.log(`Monthly payouts completed: ${successful} successful, ${failed} failed`)
      
      return {
        success: true,
        processed: results.length,
        successful,
        failed,
        results
      }
    } catch (error) {
      console.error('Monthly payout scheduling error:', error)
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      }
    }
  }
}
