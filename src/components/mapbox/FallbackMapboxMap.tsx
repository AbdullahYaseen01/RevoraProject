"use client"

import { useEffect, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import { MAPBOX_CONFIG } from '@/lib/env'
import 'mapbox-gl/dist/mapbox-gl.css'

export default function FallbackMapboxMap() {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!mapContainer.current || map.current) return

    console.log('Fallback Mapbox initialization starting...')
    console.log('Access token present:', !!MAPBOX_CONFIG.accessToken)
    console.log('Token length:', MAPBOX_CONFIG.accessToken?.length)

    if (!MAPBOX_CONFIG.accessToken) {
      setError('Mapbox access token is required.')
      return
    }

    // Wait for container to be visible
    const checkContainer = () => {
      if (!mapContainer.current) return false
      
      const rect = mapContainer.current.getBoundingClientRect()
      console.log('Container rect:', rect)
      
      if (rect.width > 0 && rect.height > 0) {
        return true
      }
      return false
    }

    const initMap = () => {
      if (!mapContainer.current || map.current) return

      try {
        mapboxgl.accessToken = MAPBOX_CONFIG.accessToken
        
        map.current = new mapboxgl.Map({
          container: mapContainer.current,
          style: 'mapbox://styles/mapbox/streets-v12',
          center: [-122.4194, 37.7749],
          zoom: 10
        })

        console.log('Fallback map created:', map.current)

        map.current.on('load', () => {
          console.log('Fallback map loaded!')
          setIsLoaded(true)
        })

        map.current.on('error', (e: any) => {
          console.error('Fallback map error:', e)
          setError(`Map error: ${e.error?.message || e.message || 'Unknown error'}`)
        })

      } catch (err: any) {
        console.error('Fallback map init error:', err)
        setError(`Init error: ${err.message}`)
      }
    }

    if (checkContainer()) {
      initMap()
    } else {
      // Wait a bit for container to be ready
      const timer = setTimeout(() => {
        if (checkContainer()) {
          initMap()
        } else {
          setError('Map container not ready')
        }
      }, 100)
      
      return () => clearTimeout(timer)
    }

    return () => {
      if (map.current) {
        map.current.remove()
        map.current = null
      }
    }
  }, [])

  if (error) {
    return (
      <div className="flex items-center justify-center bg-red-50 h-96 w-full rounded-lg">
        <div className="text-center p-6">
          <div className="text-red-500 text-4xl mb-4">❌</div>
          <h3 className="text-lg font-semibold text-red-900 mb-2">Map Error</h3>
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-full h-96 bg-gray-100 rounded-lg overflow-hidden">
      <div 
        ref={mapContainer} 
        className="w-full h-full" 
        style={{ 
          minHeight: '384px',
          width: '100%',
          height: '100%'
        }} 
      />
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-gray-600">Loading fallback map...</p>
          </div>
        </div>
      )}
    </div>
  )
}
