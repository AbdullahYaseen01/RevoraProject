"use client"

import { SessionProvider } from "next-auth/react"
export const runtime = 'nodejs'
import { ReactNode } from "react"

interface Props {
  children: ReactNode
}

export default function AuthSessionProvider({ children }: Props) {
  return <SessionProvider>{children}</SessionProvider>
}
