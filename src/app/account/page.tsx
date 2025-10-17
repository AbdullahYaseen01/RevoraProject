"use client"

import { useEffect, useState } from 'react'
import { useSession } from 'next-auth/react'

export default function AccountPage() {
  const { data: session } = useSession()
  const [qrSvg, setQrSvg] = useState<string>('')
  const [enabled, setEnabled] = useState<boolean>(!!session?.user?.twoFactorEnabled)
  const [token, setToken] = useState('')
  const [message, setMessage] = useState('')

  const startSetup = async () => {
    setMessage('')
    const res = await fetch('/api/auth/2fa/setup')
    const data = await res.json()
    setQrSvg(data.svg)
  }

  const verify = async () => {
    const res = await fetch('/api/auth/2fa/setup', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ token })
    })
    if (res.ok) {
      setEnabled(true)
      setMessage('Two‑factor authentication enabled')
    } else {
      setMessage('Invalid token')
    }
  }

  const disable = async () => {
    await fetch('/api/auth/2fa/disable', { method: 'POST' })
    setEnabled(false)
    setQrSvg('')
    setMessage('Two‑factor authentication disabled')
  }

  return (
    <div className="max-w-3xl mx-auto p-6">
      <h1 className="text-2xl font-semibold mb-6">Account settings</h1>
      <div className="bg-white rounded-xl shadow p-6 space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-medium">Two‑factor authentication</div>
            <div className="text-sm text-gray-600">Add an extra layer of security to your account.</div>
          </div>
          {enabled ? (
            <button onClick={disable} className="px-3 py-2 bg-red-600 text-white rounded-md">Disable</button>
          ) : (
            <button onClick={startSetup} className="px-3 py-2 bg-indigo-600 text-white rounded-md">Set up</button>
          )}
        </div>
        {qrSvg && !enabled && (
          <div className="space-y-3">
            <div dangerouslySetInnerHTML={{ __html: qrSvg }} />
            <div className="flex gap-2">
              <input className="border rounded-md px-3 py-2" placeholder="Enter 6‑digit code" value={token} onChange={(e)=>setToken(e.target.value)} />
              <button onClick={verify} className="px-3 py-2 bg-indigo-600 text-white rounded-md">Verify</button>
            </div>
          </div>
        )}
        {message && <div className="text-sm text-gray-700">{message}</div>}
      </div>
    </div>
  )
}


