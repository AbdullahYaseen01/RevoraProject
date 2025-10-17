"use client"

import { useEffect, useState } from 'react'

export default function DebugEnvPage() {
  const [envVars, setEnvVars] = useState<any>({})

  useEffect(() => {
    // Check environment variables
    setEnvVars({
      MAPBOX_API_KEY: process.env.MAPBOX_API_KEY ? 'SET' : 'NOT SET',
      NODE_ENV: process.env.NODE_ENV,
      // Note: Only NEXT_PUBLIC_ vars are available on client side
    })
  }, [])

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Environment Variables Debug</h1>
      <div className="space-y-2">
        <div><strong>MAPBOX_API_KEY:</strong> {envVars.MAPBOX_API_KEY}</div>
        <div><strong>NODE_ENV:</strong> {envVars.NODE_ENV}</div>
      </div>
      
      <div className="mt-8">
        <h2 className="text-xl font-bold mb-4">Server-side Check</h2>
        <p className="text-gray-600">
          Since MAPBOX_API_KEY is not prefixed with NEXT_PUBLIC_, it's only available on the server side.
          The map components should work, but let's verify the server can access it.
        </p>
      </div>
    </div>
  )
}
