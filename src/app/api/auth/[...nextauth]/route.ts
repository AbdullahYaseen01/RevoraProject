import NextAuth from "next-auth"
import { authOptions } from "@/lib/auth"

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST }

// Ensure Node runtime for NextAuth to avoid edge-related 500s during dev
export const runtime = 'nodejs'