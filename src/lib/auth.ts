import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "./db"
import bcrypt from "bcryptjs"
import { UserRole } from "@prisma/client"

export const authOptions: NextAuthOptions = {
  // Remove adapter for now - we'll add it back when needed
  providers: [
    CredentialsProvider({
      id: "credentials",
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const user = await prisma.user.findUnique({
          where: {
            email: credentials.email
          },
          include: {
            profile: true,
            cashBuyerProfile: true,
            subscription: true
          }
        })

        if (!user) {
          return null
        }

        if (!user.password) {
          return null
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        )

        if (!isPasswordValid) {
          return null
        }

        return {
          id: user.id,
          email: user.email,
          role: user.role,
          subscriptionTier: user.subscriptionTier,
          name: user.profile?.legalName || user.email,
          phone: user.phone,
          isEmailVerified: user.isEmailVerified,
          isPhoneVerified: user.isPhoneVerified,
          isCashBuyer: !!user.cashBuyerProfile,
          isVerified: user.cashBuyerProfile?.verificationStatus === 'VERIFIED'
        }
      }
    })
  ],
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role
        token.subscriptionTier = user.subscriptionTier
        token.phone = user.phone
        token.isEmailVerified = user.isEmailVerified
        token.isPhoneVerified = user.isPhoneVerified
        token.isCashBuyer = user.isCashBuyer
        token.isVerified = user.isVerified
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub as string
        session.user.role = token.role as UserRole
        session.user.subscriptionTier = token.subscriptionTier
        session.user.phone = token.phone
        session.user.isEmailVerified = token.isEmailVerified as boolean
        session.user.isPhoneVerified = token.isPhoneVerified as boolean
        session.user.isCashBuyer = token.isCashBuyer as boolean
        session.user.isVerified = token.isVerified as boolean
      }
      return session
    },
  },
  pages: {
    signIn: "/auth/signin",
    signUp: "/auth/signup",
  },
}
