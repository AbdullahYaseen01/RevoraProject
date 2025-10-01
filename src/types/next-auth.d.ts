import NextAuth from "next-auth"
import { UserRole, SubscriptionTier } from "@prisma/client"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      email: string
      name: string
      role: UserRole
      subscriptionTier: SubscriptionTier
      phone?: string
      isEmailVerified: boolean
      isPhoneVerified: boolean
      isCashBuyer?: boolean
      isVerified?: boolean
    }
  }

  interface User {
    role: UserRole
    subscriptionTier: SubscriptionTier
    phone?: string
    isEmailVerified: boolean
    isPhoneVerified: boolean
    isCashBuyer?: boolean
    isVerified?: boolean
  }
}
