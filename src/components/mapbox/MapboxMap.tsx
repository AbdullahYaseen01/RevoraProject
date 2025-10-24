"use client"

import { useEffect, useRef, useState, useCallback } from 'react'
import mapboxgl from 'mapbox-gl'
import { MAPBOX_CONFIG } from '@/lib/env'
import 'mapbox-gl/dist/mapbox-gl.css'

export interface MapboxMapProps {
  center?: [number, number]
  zoom?: number
  style?: string
  className?: string
  onMapLoad?: (map: mapboxgl.Map) => void
  onMapClick?: (e: mapboxgl.MapMouseEvent) => void
  onMapMove?: (e: mapboxgl.MapMouseEvent) => void
  children?: React.ReactNode
  interactive?: boolean
  showNavigationControl?: boolean
  showFullscreenControl?: boolean
  showScaleControl?: boolean
  showGeolocateControl?: boolean
  showAttributionControl?: boolean
  maxZoom?: number
  minZoom?: number
  maxBounds?: mapboxgl.LngLatBoundsLike
  pitch?: number
  bearing?: number
  antialias?: boolean
  preserveDrawingBuffer?: boolean
  failIfMajorPerformanceCaveat?: boolean
}

export default function MapboxMap({
  center = [-122.4194, 37.7749],
  zoom = 10,
  style = MAPBOX_CONFIG.style,
  className = '',
  onMapLoad,
  onMapClick,
  onMapMove,
  children,
  interactive = true,
  showNavigationControl = true,
  showFullscreenControl = true,
  showScaleControl = true,
  showGeolocateControl = true,
  showAttributionControl = true,
  maxZoom = 22,
  minZoom = 0,
  maxBounds,
  pitch = 0,
  bearing = 0,
  antialias = false,
  preserveDrawingBuffer = false,
  failIfMajorPerformanceCaveat = false
}: MapboxMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Normalize center input: ensure [lng, lat] and valid ranges
  const normalizedCenter: [number, number] = (() => {
    let [a, b] = center
    // If provided as [lat, lng], swap
    if (Math.abs(a) <= 90 && Math.abs(b) > 90) {
      ;[a, b] = [b, a]
    }
    // Clamp latitude into [-90, 90]
    const lng = isFinite(a) ? a : -122.4194
    const lat = isFinite(b) ? Math.max(-90, Math.min(90, b)) : 37.7749
    return [lng, lat]
  })()

  // Initialize map
  useEffect(() => {
    if (!mapContainer.current || map.current) return

    console.log('Mapbox initialization starting...')
    console.log('Access token:', MAPBOX_CONFIG.accessToken ? 'Present' : 'Missing')
    console.log('Map container:', mapContainer.current)
    console.log('Style:', style)

    if (!MAPBOX_CONFIG.accessToken) {
      setError('Mapbox access token is required. Please set NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN or MAPBOX_API_KEY in your environment variables.')
      return
    }

    try {
      mapboxgl.accessToken = MAPBOX_CONFIG.accessToken
      console.log('Mapbox access token set')

      map.current = new mapboxgl.Map({
        container: mapContainer.current,
        style,
        center: normalizedCenter,
        zoom,
        interactive,
        maxZoom,
        minZoom,
        maxBounds,
        pitch,
        bearing,
        antialias,
        preserveDrawingBuffer,
        failIfMajorPerformanceCaveat
      })
      
      console.log('Mapbox map instance created:', map.current)

      const mapInstance = map.current

      // Check container dimensions
      const containerRect = mapContainer.current.getBoundingClientRect()
      console.log('Container dimensions:', containerRect)
      console.log('Container computed styles:', {
        width: window.getComputedStyle(mapContainer.current).width,
        height: window.getComputedStyle(mapContainer.current).height
      })

      // Add controls
      if (showNavigationControl) {
        mapInstance.addControl(new mapboxgl.NavigationControl(), 'top-right')
      }

      if (showFullscreenControl) {
        mapInstance.addControl(new mapboxgl.FullscreenControl(), 'top-right')
      }

      if (showScaleControl) {
        mapInstance.addControl(new mapboxgl.ScaleControl(), 'bottom-left')
      }

      if (showGeolocateControl) {
        mapInstance.addControl(new mapboxgl.GeolocateControl({
          positionOptions: {
            enableHighAccuracy: true
          },
          trackUserLocation: true,
          showUserHeading: true
        }), 'top-right')
      }

      if (showAttributionControl) {
        mapInstance.addControl(new mapboxgl.AttributionControl({
          compact: true
        }), 'bottom-right')
      }

      // Event listeners
      mapInstance.on('load', () => {
        console.log('Mapbox map loaded successfully!')
        setIsLoaded(true)
        onMapLoad?.(mapInstance)
      })

      // Handle style loading errors
      mapInstance.on('style.load', () => {
        console.log('Map style loaded successfully')
      })

      mapInstance.on('style.error', (e: any) => {
        console.error('Map style error:', e)
        if (e.error && e.error.status === 401) {
          setError('Invalid Mapbox API key. Please get a valid API key from https://account.mapbox.com/access-tokens/ and update your .env file.')
        }
      })

      //@ts-ignore
      mapInstance.on('error', (e: any) => {
        console.error('Mapbox error:', e)
        
        // Check for 401 errors in different possible locations
        const is401Error = (
          (e.error && e.error.message && e.error.message.includes('401')) ||
          (e.error && e.error.status === 401) ||
          (e.status === 401) ||
          (e.message && e.message.includes('401')) ||
          (e.type === 'error' && e.error && e.error.status === 401)
        )
        
        if (is401Error) {
          setError('Invalid Mapbox API key. Please get a valid API key from https://account.mapbox.com/access-tokens/ and update your .env file.')
        } else {
          setError('Failed to load map. Please check your Mapbox configuration.')
        }
      })

      if (onMapClick) {
        mapInstance.on('click', onMapClick)
      }

      if (onMapMove) {
        mapInstance.on('mousemove', onMapMove)
      }

      // Cleanup
      return () => {
        if (mapInstance) {
          mapInstance.remove()
        }
      }
    } catch (err) {
      console.error('Failed to initialize map:', err)
      setError('Failed to initialize map. Please check your Mapbox configuration.')
    }
  }, [
    style,
    normalizedCenter,
    zoom,
    interactive,
    maxZoom,
    minZoom,
    maxBounds,
    pitch,
    bearing,
    antialias,
    preserveDrawingBuffer,
    failIfMajorPerformanceCaveat,
    showNavigationControl,
    showFullscreenControl,
    showScaleControl,
    showGeolocateControl,
    showAttributionControl,
    onMapLoad,
    onMapClick,
    onMapMove
  ])

  // Update map center and zoom
  useEffect(() => {
    if (map.current && isLoaded) {
      map.current.setCenter(normalizedCenter)
      map.current.setZoom(zoom)
    }
  }, [normalizedCenter, zoom, isLoaded])

  // Update map style
  useEffect(() => {
    if (map.current && isLoaded) {
      map.current.setStyle(style)
    }
  }, [style, isLoaded])

  // Expose map instance
  const getMap = useCallback(() => map.current, [])

  if (error) {
    return (
      <div className={`flex items-center justify-center bg-gray-100 ${className}`}>
        <div className="text-center p-6 max-w-md">
          <div className="text-red-500 text-4xl mb-4">🗺️</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Map Loading Error</h3>
          <p className="text-gray-700 mb-4">{error}</p>
          <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded">
            <strong>Quick Fix:</strong><br/>
            1. Go to <a href="https://account.mapbox.com/access-tokens/" target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Mapbox Access Tokens</a><br/>
            2. Copy your public token (starts with pk.)<br/>
            3. Update MAPBOX_API_KEY and NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN in your .env file<br/>
            4. Restart the development server
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`relative ${className}`}>
      <div ref={mapContainer} className="w-full h-full" />
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-gray-600">Loading map...</p>
          </div>
        </div>
      )}
      {isLoaded && children && (
        <div className="absolute inset-0 pointer-events-none">
          <div className="pointer-events-auto">
            {children}
          </div>
        </div>
      )}
    </div>
  )
}

// Export map instance getter hook
export function useMapboxMap() {
  const [map, setMap] = useState<mapboxgl.Map | null>(null)
  
  const setMapInstance = useCallback((mapInstance: mapboxgl.Map | null) => {
    setMap(mapInstance)
  }, [])

  return { map, setMapInstance }
}
