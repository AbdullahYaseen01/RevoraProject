import { NextAuthOptions } from "next-auth"
import CredentialsProvider from "next-auth/providers/credentials"
import GoogleProvider from "next-auth/providers/google"
import GitHubProvider from "next-auth/providers/github"
import DiscordProvider from "next-auth/providers/discord"
import { PrismaAdapter } from "@next-auth/prisma-adapter"
import { prisma } from "./db"
import bcrypt from "bcryptjs"
import { UserRole } from "@prisma/client"
import { sendVerificationEmail } from "./email"

export const authOptions: NextAuthOptions = {
  secret: process.env.NEXTAUTH_SECRET,
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
    }),
    GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    }),
    DiscordProvider({
      clientId: process.env.DISCORD_CLIENT_ID!,
      clientSecret: process.env.DISCORD_CLIENT_SECRET!,
    }),
    CredentialsProvider({
      id: "credentials",
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        twoFactorCode: { label: "2FA Code", type: "text", optional: true }
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

        // Check if account is locked
        if (user.lockedUntil && user.lockedUntil > new Date()) {
          throw new Error("Account is temporarily locked due to too many failed login attempts")
        }

        if (!user.password) {
          return null
        }

        const isPasswordValid = await bcrypt.compare(
          credentials.password,
          user.password
        )

        if (!isPasswordValid) {
          // Increment login attempts
          await prisma.user.update({
            where: { id: user.id },
            data: {
              loginAttempts: user.loginAttempts + 1,
              lockedUntil: user.loginAttempts >= 4 ? new Date(Date.now() + 15 * 60 * 1000) : null // Lock for 15 minutes after 5 attempts
            }
          })
          return null
        }

        // Check 2FA if enabled
        if (user.twoFactorEnabled) {
          if (!credentials.twoFactorCode) {
            throw new Error("2FA_REQUIRED")
          }
          
          const speakeasy = require('speakeasy')
          const verified = speakeasy.totp.verify({
            secret: user.twoFactorSecret!,
            encoding: 'base32',
            token: credentials.twoFactorCode,
            window: 2
          })

          if (!verified) {
            return null
          }
        }

        // Reset login attempts on successful login
        await prisma.user.update({
          where: { id: user.id },
          data: {
            loginAttempts: 0,
            lockedUntil: null,
            lastLoginAt: new Date()
          }
        })

        return {
          id: user.id,
          email: user.email,
          role: user.role,
          subscriptionTier: user.subscriptionTier,
          name: user.profile?.legalName || user.email,
          phone: user.phone ?? undefined,
          isEmailVerified: user.isEmailVerified,
          isPhoneVerified: user.isPhoneVerified,
          isCashBuyer: !!user.cashBuyerProfile,
          isVerified: user.cashBuyerProfile?.verificationStatus === 'VERIFIED',
          twoFactorEnabled: user.twoFactorEnabled
        } as any
      }
    })
  ],
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      // Handle OAuth sign-ins
      if (account?.provider !== "credentials") {
        const existingUser = await prisma.user.findUnique({
          where: { email: user.email! }
        })

        if (!existingUser) {
          // Create new user for OAuth
          await prisma.user.create({
            data: {
              email: user.email!,
              emailVerified: new Date(),
              isEmailVerified: true,
              role: "PROPERTY_SEEKER"
            }
          })
        }
      }
      return true
    },
    async jwt({ token, user, account }) {
      if (user) {
        token.role = user.role
        token.subscriptionTier = user.subscriptionTier
        token.phone = user.phone
        token.isEmailVerified = user.isEmailVerified
        token.isPhoneVerified = user.isPhoneVerified
        token.isCashBuyer = user.isCashBuyer
        token.isVerified = user.isVerified
        token.twoFactorEnabled = user.twoFactorEnabled
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
        session.user.twoFactorEnabled = token.twoFactorEnabled as boolean
      }
      return session
    },
  },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  events: {
    async signIn({ user, account, profile, isNewUser }) {
      // Log successful sign-in
      await prisma.loginAttempt.create({
        data: {
          email: user.email!,
          ipAddress: "unknown", // You can get this from request headers
          success: true,
          reason: "successful_login"
        }
      })
    },
    async signOut({ session, token }) {
      // Clean up session data if needed
    }
  }
}
