"use client"

import { useState, useEffect } from 'react'
import { MAPBOX_CONFIG } from '@/lib/env'

export default function MapboxStatus() {
  const [status, setStatus] = useState<{
    hasToken: boolean
    tokenLength: number
    serverStatus: 'loading' | 'success' | 'error'
    error?: string
  }>({
    hasToken: false,
    tokenLength: 0,
    serverStatus: 'loading'
  })

  useEffect(() => {
    // Check client-side token
    const hasToken = !!MAPBOX_CONFIG.accessToken
    const tokenLength = MAPBOX_CONFIG.accessToken.length

    setStatus(prev => ({
      ...prev,
      hasToken,
      tokenLength
    }))

    // Check server-side token
    fetch('/api/mapbox/config')
      .then(res => res.json())
      .then(data => {
        setStatus(prev => ({
          ...prev,
          serverStatus: data.hasToken ? 'success' : 'error',
          error: data.error
        }))
      })
      .catch(err => {
        setStatus(prev => ({
          ...prev,
          serverStatus: 'error',
          error: err.message
        }))
      })
  }, [])

  if (status.hasToken && status.serverStatus === 'success') {
    return (
      <div className="bg-green-50 border border-green-200 rounded-md p-3 mb-4">
        <div className="flex items-center">
          <span className="text-green-600 mr-2">✅</span>
          <span className="text-green-800 font-medium">Mapbox is configured correctly</span>
        </div>
        <div className="text-sm text-green-700 mt-1">
          Token length: {status.tokenLength} characters
        </div>
      </div>
    )
  }

  return (
    <div className="bg-red-50 border border-red-200 rounded-md p-3 mb-4">
      <div className="flex items-center">
        <span className="text-red-600 mr-2">❌</span>
        <span className="text-red-800 font-medium">Mapbox configuration issue</span>
      </div>
      <div className="text-sm text-red-700 mt-1">
        {!status.hasToken && (
          <div>Client-side token missing. Add NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN to .env.local</div>
        )}
        {status.serverStatus === 'error' && (
          <div>Server-side token issue: {status.error}</div>
        )}
        {status.serverStatus === 'loading' && (
          <div>Checking server configuration...</div>
        )}
      </div>
      <div className="text-xs text-red-600 mt-2">
        <strong>Required environment variables:</strong><br/>
        MAPBOX_API_KEY=your_token_here<br/>
        NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=your_token_here
      </div>
    </div>
  )
}
