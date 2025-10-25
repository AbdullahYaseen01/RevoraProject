"use client"

import { useEffect, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import { MAPBOX_CONFIG } from '@/lib/env'

export default function CustomMapboxMap() {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!mapContainer.current || map.current) return

    console.log('Custom Mapbox initialization starting...')
    console.log('Token present:', !!MAPBOX_CONFIG.accessToken)
    console.log('Token length:', MAPBOX_CONFIG.accessToken?.length)

    if (!MAPBOX_CONFIG.accessToken) {
      setError('Mapbox access token is required.')
      return
    }

    // Set access token
    mapboxgl.accessToken = MAPBOX_CONFIG.accessToken

    // Create map with explicit dimensions
    const container = mapContainer.current
    container.style.width = '100%'
    container.style.height = '100%'
    container.style.minHeight = '400px'

    try {
      map.current = new mapboxgl.Map({
        container: container,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [-122.4194, 37.7749], // San Francisco
        zoom: 10,
        interactive: true,
        attributionControl: false
      })

      console.log('Custom map created:', map.current)

      // Add navigation control
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right')

      // Add attribution control
      map.current.addControl(new mapboxgl.AttributionControl({
        compact: true
      }), 'bottom-right')

      // Event listeners
      map.current.on('load', () => {
        console.log('Custom map loaded successfully!')
        setIsLoaded(true)
      })

      map.current.on('error', (e: any) => {
        console.error('Custom map error:', e)
        setError(`Map error: ${e.error?.message || e.message || 'Unknown error'}`)
      })

      map.current.on('style.error', (e: any) => {
        console.error('Custom map style error:', e)
        setError(`Style error: ${e.error?.message || e.message || 'Unknown style error'}`)
      })

      // Add a marker to test
      new mapboxgl.Marker()
        .setLngLat([-122.4194, 37.7749])
        .addTo(map.current)

    } catch (err: any) {
      console.error('Custom map init error:', err)
      setError(`Init error: ${err.message}`)
    }

    // Cleanup
    return () => {
      if (map.current) {
        map.current.remove()
        map.current = null
      }
    }
  }, [])

  if (error) {
    return (
      <div className="flex items-center justify-center bg-red-50 h-96 w-full rounded-lg border-2 border-red-200">
        <div className="text-center p-6">
          <div className="text-red-500 text-4xl mb-4">❌</div>
          <h3 className="text-lg font-semibold text-red-900 mb-2">Map Error</h3>
          <p className="text-red-700 text-sm">{error}</p>
          <div className="mt-4 text-xs text-red-600 bg-red-100 p-2 rounded">
            <strong>Debug Info:</strong><br/>
            Token: {MAPBOX_CONFIG.accessToken ? 'Present' : 'Missing'}<br/>
            Length: {MAPBOX_CONFIG.accessToken?.length || 0}
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-full h-96 bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-200">
      <div 
        ref={mapContainer} 
        className="w-full h-full"
        style={{ 
          width: '100%',
          height: '100%',
          minHeight: '384px'
        }} 
      />
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-gray-600 font-medium">Loading custom map...</p>
            <p className="text-xs text-gray-500 mt-1">This should work!</p>
          </div>
        </div>
      )}
      {isLoaded && (
        <div className="absolute top-2 left-2 bg-white px-2 py-1 rounded shadow text-xs text-green-600 font-medium">
          ✅ Map Loaded Successfully!
        </div>
      )}
    </div>
  )
}
