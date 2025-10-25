import { NextRequest, NextResponse } from "next/server"
import bcrypt from "bcryptjs"
import { prisma } from "@/lib/db"
import { Prisma } from "@prisma/client"

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, phone, password, firstName, lastName, role } = body

    // Validate input
    if (!email || !password || !firstName || !lastName || !role) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      )
    }

    // Check database connection
    if (!prisma) {
      console.error("Database connection not available")
      return NextResponse.json(
        { error: "Database connection failed" },
        { status: 500 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: "User with this email already exists" },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user with profile
    const user = await prisma.$transaction(async (tx) => {
      const newUser = await tx.user.create({
        data: {
          email,
          phone,
          password: hashedPassword,
          role: role as any,
          subscriptionTier: "STARTER",
        }
      })

      // Create user profile
      const userProfile = await tx.userProfile.create({
        data: {
          userId: newUser.id,
          legalName: `${firstName} ${lastName}`,
          mailingAddress: "",
          marketsOfInterest: "[]",
          contactPreferences: "[]",
        }
      })

      // Create cash buyer profile if applicable
      if (role === "CASH_BUYER") {
        await tx.cashBuyerProfile.create({
          data: {
            userId: newUser.id,
            investmentCriteria: {},
            verificationStatus: "PENDING",
          }
        })
      }

      // Create affiliate profile if applicable
      if (role === "AFFILIATE") {
        const promoCode = `AFF${Math.random().toString(36).substring(2, 8).toUpperCase()}`
        await tx.affiliateProfile.create({
          data: {
            userId: newUser.id,
            businessType: "",
            socialMedia: {},
            promoCode,
            referralLink: `/ref/${promoCode}`,
            commissionRate: 0.25,
          }
        })
      }

      return newUser
    })

    return NextResponse.json({
      success: true,
      message: "Account created successfully"
    })

  } catch (error) {
    console.error("Registration error:", error)

    // More detailed error logging
    if (error instanceof Prisma.PrismaClientKnownRequestError) {
      console.error("Prisma error code:", error.code)
      console.error("Prisma error message:", error.message)
      
      if (error.code === "P2002") {
        return NextResponse.json(
          { error: "User with this email already exists" },
          { status: 400 }
        )
      }
    }

    // Check for connection errors
    if (error instanceof Prisma.PrismaClientInitializationError) {
      console.error("Database initialization error:", error.message)
      return NextResponse.json(
        { error: "Database connection failed. Please try again later." },
        { status: 500 }
      )
    }

    // Generic error response with more details in logs
    console.error("Full error object:", JSON.stringify(error, null, 2))
    
    return NextResponse.json(
      { error: "An error occurred during registration" },
      { status: 500 }
    )
  }
}
