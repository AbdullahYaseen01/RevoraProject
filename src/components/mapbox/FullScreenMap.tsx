"use client"

import { useEffect, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import { MAPBOX_CONFIG } from '@/lib/env'
import MapSearchTools from './MapSearchTools'
import { X, Maximize2 } from 'lucide-react'

interface FullScreenMapProps {
  isOpen: boolean
  onClose: () => void
}

export default function FullScreenMap({ isOpen, onClose }: FullScreenMapProps) {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    if (!isOpen || !mapContainer.current || map.current) return

    console.log('Full-screen map initialization starting...')

    if (!MAPBOX_CONFIG.accessToken) {
      setError('Mapbox access token is required.')
      return
    }

    // Set access token
    mapboxgl.accessToken = MAPBOX_CONFIG.accessToken

    // Create map with full screen dimensions
    const container = mapContainer.current
    container.style.width = '100vw'
    container.style.height = '100vh'

    try {
      map.current = new mapboxgl.Map({
        container: container,
        style: 'mapbox://styles/mapbox/streets-v12',
        center: [-122.4194, 37.7749], // San Francisco
        zoom: 10,
        interactive: true,
        attributionControl: false
      })

      console.log('Full-screen map created:', map.current)

      // Add navigation control
      map.current.addControl(new mapboxgl.NavigationControl(), 'top-right')

      // Add geolocate control
      map.current.addControl(new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true
        },
        trackUserLocation: true,
        showUserHeading: true
      }), 'top-right')

      // Add scale control
      map.current.addControl(new mapboxgl.ScaleControl({
        maxWidth: 100,
        unit: 'metric'
      }), 'bottom-left')

      // Add attribution control
      map.current.addControl(new mapboxgl.AttributionControl({
        compact: true
      }), 'bottom-right')

      // Add fullscreen control
      map.current.addControl(new mapboxgl.FullscreenControl(), 'top-right')

      // Event listeners
      map.current.on('load', () => {
        console.log('Full-screen map loaded successfully!')
        setIsLoaded(true)
      })

      map.current.on('error', (e: any) => {
        console.error('Full-screen map error:', e)
        setError(`Map error: ${e.error?.message || e.message || 'Unknown error'}`)
      })

      // Add click handler for map
      map.current.on('click', (e) => {
        const { lng, lat } = e.lngLat
        
        // Add marker at clicked location
        new mapboxgl.Marker({ color: '#EF4444' })
          .setLngLat([lng, lat])
          .setPopup(new mapboxgl.Popup().setHTML(`
            <div class="p-3">
              <h3 class="font-semibold text-gray-900">Clicked Location</h3>
              <p class="text-sm text-gray-600 mt-1">
                Latitude: ${lat.toFixed(6)}<br/>
                Longitude: ${lng.toFixed(6)}
              </p>
            </div>
          `))
          .addTo(map.current!)
      })

      // Add sample markers
      const sampleLocations = [
        { name: 'Golden Gate Bridge', coords: [-122.4783, 37.8199], color: '#3B82F6' },
        { name: 'Fisherman\'s Wharf', coords: [-122.4098, 37.8080], color: '#10B981' },
        { name: 'Union Square', coords: [-122.4074, 37.7879], color: '#F59E0B' }
      ]

      sampleLocations.forEach(location => {
        new mapboxgl.Marker({ color: location.color })
          .setLngLat(location.coords)
          .setPopup(new mapboxgl.Popup().setHTML(`
            <div class="p-3">
              <h3 class="font-semibold text-gray-900">${location.name}</h3>
              <p class="text-sm text-gray-600 mt-1">San Francisco, CA</p>
            </div>
          `))
          .addTo(map.current!)
      })

    } catch (err: any) {
      console.error('Full-screen map init error:', err)
      setError(`Init error: ${err.message}`)
    }

    // Cleanup
    return () => {
      if (map.current) {
        map.current.remove()
        map.current = null
      }
    }
  }, [isOpen])

  const handleLocationSelect = (location: { lng: number; lat: number; address: string }) => {
    console.log('Location selected:', location)
  }

  const handleSearchResults = (results: any[]) => {
    console.log('Search results:', results)
    
    // Add markers for search results
    if (map.current && results.length > 0) {
      results.forEach((property, index) => {
        if (property.latitude && property.longitude) {
          new mapboxgl.Marker({ color: '#8B5CF6' })
            .setLngLat([property.longitude, property.latitude])
            .setPopup(new mapboxgl.Popup().setHTML(`
              <div class="p-3">
                <h3 class="font-semibold text-gray-900">${property.address || 'Property'}</h3>
                <p class="text-sm text-gray-600 mt-1">
                  ${property.city}, ${property.state}<br/>
                  ${property.beds ? `${property.beds} bed` : ''} ${property.baths ? `${property.baths} bath` : ''}
                  ${property.lastSalePrice ? `<br/>$${property.lastSalePrice.toLocaleString()}` : ''}
                </p>
              </div>
            `))
            .addTo(map.current!)
        }
      })
    }
  }

  if (!isOpen) return null

  if (error) {
    return (
      <div className="fixed inset-0 z-50 bg-red-50 flex items-center justify-center">
        <div className="text-center p-6">
          <div className="text-red-500 text-4xl mb-4">❌</div>
          <h3 className="text-lg font-semibold text-red-900 mb-2">Map Error</h3>
          <p className="text-red-700 text-sm">{error}</p>
          <button
            onClick={onClose}
            className="mt-4 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
          >
            Close
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 bg-white">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-10 bg-white shadow-sm border-b">
        <div className="flex items-center justify-between p-4">
          <div>
            <h1 className="text-xl font-semibold text-gray-900">Full-Screen Map</h1>
            <p className="text-sm text-gray-600">Maximum visibility for detailed exploration</p>
          </div>
          <button
            onClick={onClose}
            className="flex items-center space-x-2 px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <X className="w-4 h-4" />
            <span>Close</span>
          </button>
        </div>
      </div>

      {/* Map Container */}
      <div 
        ref={mapContainer} 
        className="w-full h-full"
        style={{ 
          width: '100vw',
          height: '100vh',
          paddingTop: '80px' // Account for header
        }} 
      />
      
      {/* Search Tools Overlay */}
      {isLoaded && (
        <div style={{ top: '100px' }} className="absolute left-4 z-20">
          <MapSearchTools 
            map={map.current}
            onLocationSelect={handleLocationSelect}
            onSearchResults={handleSearchResults}
          />
        </div>
      )}
      
      {/* Loading State */}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100" style={{ paddingTop: '80px' }}>
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-gray-600 font-medium">Loading full-screen map...</p>
          </div>
        </div>
      )}
      
      {/* Success Indicator */}
      {isLoaded && (
        <div className="absolute top-20 right-4 bg-white px-3 py-2 rounded shadow text-sm text-green-600 font-medium">
          ✅ Full-Screen Map Loaded!
        </div>
      )}
    </div>
  )
}
