"use client"

import { useEffect, useRef, useState } from 'react'
import mapboxgl from 'mapbox-gl'
import { MAPBOX_CONFIG } from '@/lib/env'
import MapSearchTools from './MapSearchTools'
import FullScreenMap from './FullScreenMap'
import { Maximize2 } from 'lucide-react'

export default function EnhancedMapboxMap() {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isFullScreen, setIsFullScreen] = useState(false)

  useEffect(() => {
    if (!mapContainer.current || map.current) return

    console.log('Enhanced Mapbox initialization starting...')
    console.log('Token present:', !!MAPBOX_CONFIG.accessToken)

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

      console.log('Enhanced map created:', map.current)

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
        console.log('Enhanced map loaded successfully!')
        setIsLoaded(true)
      })

      map.current.on('error', (e: any) => {
        console.error('Enhanced map error:', e)
        setError(`Map error: ${e.error?.message || e.message || 'Unknown error'}`)
      })

      map.current.on('style.error', (e: any) => {
        console.error('Enhanced map style error:', e)
        setError(`Style error: ${e.error?.message || e.message || 'Unknown style error'}`)
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

      // Add some sample markers
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
      console.error('Enhanced map init error:', err)
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

  const handleLocationSelect = (location: { lng: number; lat: number; address: string }) => {
    console.log('Location selected:', location)
    // You can add additional logic here
  }

  const handleSearchResults = (results: any[]) => {
    console.log('Search results:', results)
    setSearchResults(results)
    
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

  if (error) {
    return (
      <div className="flex items-center justify-center bg-red-50 h-96 w-full rounded-lg border-2 border-red-200">
        <div className="text-center p-6">
          <div className="text-red-500 text-4xl mb-4">❌</div>
          <h3 className="text-lg font-semibold text-red-900 mb-2">Map Error</h3>
          <p className="text-red-700 text-sm">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="relative w-full h-[600px] bg-gray-100 rounded-lg overflow-hidden border-2 border-gray-200">
      <div 
        ref={mapContainer} 
        className="w-full h-full"
        style={{ 
          width: '100%',
          height: '100%',
          minHeight: '600px'
        }} 
      />
      
      {/* Search Tools Overlay */}
      {isLoaded && (
        <MapSearchTools 
          map={map.current}
          onLocationSelect={handleLocationSelect}
          onSearchResults={handleSearchResults}
        />
      )}
      
      {/* Loading State */}
      {!isLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-gray-100">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-gray-600 font-medium">Loading enhanced map...</p>
            <p className="text-xs text-gray-500 mt-1">With search tools and markers!</p>
          </div>
        </div>
      )}
      
      {/* Success Indicator */}
      {isLoaded && (
        <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded shadow text-xs text-green-600 font-medium">
          ✅ Enhanced Map Loaded!
        </div>
      )}

      {/* Full-Screen Button */}
      {isLoaded && (
        <button
          onClick={() => setIsFullScreen(true)}
          className="absolute top-2 right-20 bg-blue-600 text-white px-3 py-1 rounded shadow hover:bg-blue-700 transition-colors text-xs font-medium flex items-center space-x-1"
        >
          <Maximize2 className="w-3 h-3" />
          <span>Full Screen</span>
        </button>
      )}

      {/* Map Controls Info */}
      {isLoaded && (
        <div className="absolute bottom-2 left-2 bg-white px-2 py-1 rounded shadow text-xs text-gray-600">
          Click map to add markers • Use search tools on the left
        </div>
      )}

      {/* Full-Screen Map Modal */}
      <FullScreenMap 
        isOpen={isFullScreen} 
        onClose={() => setIsFullScreen(false)} 
      />
    </div>
  )
}
