"use client"

import { useSearchParams, useRouter } from 'next/navigation'
import { useState } from 'react'

export default function ResetPasswordPage() {
  const search = useSearchParams()
  const token = search.get('token') || ''
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)

  const submit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirm) {
      setError('Passwords do not match')
      return
    }
    setLoading(true)
    setError('')
    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password })
      })
      if (!res.ok) throw new Error('Failed to reset password')
      setSuccess(true)
      setTimeout(()=> router.push('/auth/signin'), 1500)
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gray-50">
      <div className="w-full max-w-md bg-white shadow-md rounded-xl p-6">
        <h1 className="text-2xl font-semibold mb-2">Reset password</h1>
        {success ? (
          <div className="text-green-600">Password updated. Redirecting…</div>
        ) : (
          <form onSubmit={submit} className="space-y-4">
            <input className="w-full border rounded-md px-3 py-2" type="password" placeholder="New password" value={password} onChange={(e)=>setPassword(e.target.value)} required />
            <input className="w-full border rounded-md px-3 py-2" type="password" placeholder="Confirm new password" value={confirm} onChange={(e)=>setConfirm(e.target.value)} required />
            <button disabled={loading} className="w-full bg-indigo-600 text-white rounded-md py-2 disabled:opacity-50">{loading ? 'Updating…' : 'Update password'}</button>
            {error && <div className="text-sm text-red-600">{error}</div>}
          </form>
        )}
      </div>
    </div>
  )
}


