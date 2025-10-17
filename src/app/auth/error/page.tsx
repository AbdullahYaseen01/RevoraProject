"use client"

import { useSearchParams } from 'next/navigation'

const messages: Record<string, string> = {
  OAuthAccountNotLinked: 'Please sign in with the same provider you used originally.',
  AccessDenied: 'Access denied.',
  Verification: 'Invalid or expired verification link.',
  InvalidToken: 'The link is invalid or expired.',
  VerificationFailed: 'Verification failed. Please request a new link.',
}

export default function AuthErrorPage() {
  const params = useSearchParams()
  const error = params.get('error') || ''
  const message = messages[error] || 'An unknown error occurred.'

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
      <div className="w-full max-w-md bg-white shadow rounded-xl p-6 text-center">
        <h1 className="text-2xl font-semibold mb-2">Authentication error</h1>
        <p className="text-gray-600">{message}</p>
      </div>
    </div>
  )
}


