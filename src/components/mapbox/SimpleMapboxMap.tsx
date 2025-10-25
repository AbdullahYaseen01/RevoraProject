"use client"

import { useEffect, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import { MAPBOX_CONFIG } from '@/lib/env'
import 'mapbox-gl/dist/mapbox-gl.css'

export default function SimpleMapboxMap() {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!mapContainer.current || map.current) return

    console.log('Simple Mapbox initialization starting...')
    console.log('Access token:', MAPBOX_CONFIG.accessToken ? 'Present' : 'Missing')
    console.log('Token length:', MAPBOX_CONFIG.accessToken?.length)

    if (!MAPBOX_CONFIG.accessToken) {
      setError('Mapbox access token is required.')
      return
    }

    try {
      mapboxgl.accessToken = MAPBOX_CONFIG.accessToken
      console.log('Mapbox access token set')

      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [-122.4194, 37.7749], // San Francisco
        zoom: 10,
        interactive: true
      })

      console.log('Mapbox map instance created:', map.current)

      const mapInstance = map.current

      mapInstance.on('load', () => {
        console.log('Mapbox map loaded successfully!')
        setIsLoaded(true)
      })

      mapInstance.on('error', (e: any) => {
        console.error('Mapbox error:', e)
        setError(`Map error: ${e.error?.message || e.message || 'Unknown error'}`)
      })

      mapInstance.on('style.error', (e: any) => {
        console.error('Map style error:', e)
        setError(`Style error: ${e.error?.message || e.message || 'Unknown style error'}`)
      })

      return () => {
        if (mapInstance) {
          mapInstance.remove()
        }
      }
    } catch (err: any) {
      console.error('Failed to initialize map:', err)
      setError(`Failed to initialize map: ${err.message}`)
    }
  }, [])

  if (error) {
    return (
      <div className="flex items-center justify-center bg-red-50 h-96 w-full">
        <div className="text-center p-6 max-w-md">
          <div className="text-red-500 text-4xl mb-4">❌</div>
          <h3 className="text-lg font-semibold text-red-900 mb-2">Map Error</h3>
          <p className="text-red-700 mb-4">{error}</p>
          <div className="text-sm text-red-600 bg-red-50 p-3 rounded">
            <strong>Debug Info:</strong><br/>
            Token: {MAPBOX_CONFIG.accessToken ? 'Present' : 'Missing'}<br/>
            Token Length: {MAPBOX_CONFIG.accessToken?.length || 0}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-full h-96">
      <div ref={mapContainer} className="w-full h-full" />
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-gray-600">Loading map...</p>
          </div>
        </div>
      )}
    </div>
  )
}
