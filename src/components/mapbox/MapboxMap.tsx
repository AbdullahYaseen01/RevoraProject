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

    if (!MAPBOX_CONFIG.accessToken) {
      setError('Mapbox access token is required. Please set NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN or MAPBOX_API_KEY in your environment variables.')
      return
    }

    try {
      mapboxgl.accessToken = MAPBOX_CONFIG.accessToken

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

      const mapInstance = map.current

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
        setIsLoaded(true)
        onMapLoad?.(mapInstance)
      })

      //@ts-ignore
      mapInstance.on('error', (e) => {
        console.error('Mapbox error:', e)
        setError('Failed to load map. Please check your Mapbox configuration.')
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
        <div className="text-center p-4">
          <div className="text-red-500 text-lg mb-2">⚠️</div>
          <p className="text-gray-700">{error}</p>
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
