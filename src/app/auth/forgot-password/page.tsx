"use client"

import { useState } from 'react'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [sent, setSent] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      })
      if (!res.ok) throw new Error('Failed to send email')
      setSent(true)
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
      <div className="w-full max-w-md bg-white shadow-md rounded-xl p-6">
        <h1 className="text-2xl font-semibold mb-2">Forgot password</h1>
        <p className="text-sm text-gray-600 mb-6">Enter your email and we'll send you a reset link.</p>
        {sent ? (
          <div className="text-green-600">If an account exists, a reset link has been sent.</div>
        ) : (
          <form onSubmit={submit} className="space-y-4">
            <input className="w-full border rounded-md px-3 py-2" type="email" placeholder="you@example.com" value={email} onChange={(e)=>setEmail(e.target.value)} required />
            <button disabled={loading} className="w-full bg-indigo-600 text-white rounded-md py-2 disabled:opacity-50">{loading ? 'Sending…' : 'Send reset link'}</button>
            {error && <div className="text-sm text-red-600">{error}</div>}
          </form>
        )}
      </div>
    </div>
  )
}


