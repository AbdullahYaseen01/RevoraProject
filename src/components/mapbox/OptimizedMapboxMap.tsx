"use client"

import { useEffect, useRef, useState, useCallback, useMemo } from 'react'
import mapboxgl from 'mapbox-gl'
import { MAPBOX_CONFIG } from '@/lib/env'
import MapSearchTools from './MapSearchTools'
import FullScreenMap from './FullScreenMap'
import { Maximize2 } from 'lucide-react'

export default function OptimizedMapboxMap() {
  const mapContainer = useRef<HTMLDivElement>(null)
  const map = useRef<mapboxgl.Map | null>(null)
  const [isLoaded, setIsLoaded] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [isFullScreen, setIsFullScreen] = useState(false)
  const markersRef = useRef<mapboxgl.Marker[]>([])

  // Performance optimizations
  const mapConfig = useMemo(() => ({
    style: 'mapbox://styles/mapbox/streets-v12',
    center: [-122.4194, 37.7749] as [number, number],
    zoom: 10,
    pitch: 0,
    bearing: 0,
    // Performance settings
    renderWorldCopies: false,
    maxZoom: 18,
    minZoom: 1,
    // Smooth interactions
    scrollZoom: {
      around: 'center'
    },
    boxZoom: true,
    dragRotate: true,
    dragPan: true,
    keyboard: true,
    doubleClickZoom: true,
    touchZoomRotate: true,
    // Performance optimizations
    antialias: true,
    preserveDrawingBuffer: false,
    refreshExpiredTiles: false,
    maxTileCacheSize: 50,
    localIdeographFontFamily: false
  }), [])

  // Debounced marker management
  const clearMarkersDebounced = useCallback(() => {
    markersRef.current.forEach(marker => marker.remove())
    markersRef.current = []
  }, [])

  const addMarkerDebounced = useCallback((lngLat: [number, number], options: any) => {
    if (!map.current) return null
    
    const marker = new mapboxgl.Marker(options)
      .setLngLat(lngLat)
      .addTo(map.current)
    
    markersRef.current.push(marker)
    return marker
  }, [])

  // Optimized map initialization
  useEffect(() => {
    if (!mapContainer.current || map.current) return

    console.log('Optimized Mapbox initialization starting...')

    if (!MAPBOX_CONFIG.accessToken) {
      setError('Mapbox access token is required.')
      return
    }

    // Set access token
    mapboxgl.accessToken = MAPBOX_CONFIG.accessToken

    // Create map with optimized settings
    const container = mapContainer.current
    container.style.width = '100%'
    container.style.height = '100%'
    container.style.minHeight = '600px'

    try {
      map.current = new mapboxgl.Map({
        container: container,
        ...mapConfig
      })

      console.log('Optimized map created:', map.current)

      // Add controls with performance considerations
      const navControl = new mapboxgl.NavigationControl({
        visualizePitch: true,
        showZoom: true,
        showCompass: true
      })
      map.current.addControl(navControl, 'top-right')

      // Optimized geolocate control
      const geolocateControl = new mapboxgl.GeolocateControl({
        positionOptions: {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000
        },
        trackUserLocation: true,
        showUserHeading: true,
        showAccuracyCircle: false // Disable for better performance
      })
      map.current.addControl(geolocateControl, 'top-right')

      // Lightweight scale control
      map.current.addControl(new mapboxgl.ScaleControl({
        maxWidth: 80,
        unit: 'metric'
      }), 'bottom-left')

      // Compact attribution
      map.current.addControl(new mapboxgl.AttributionControl({
        compact: true,
        customAttribution: '© Mapbox © OpenStreetMap'
      }), 'bottom-right')

      // Fullscreen control
      map.current.addControl(new mapboxgl.FullscreenControl(), 'top-right')

      // Optimized event listeners
      map.current.on('load', () => {
        console.log('Optimized map loaded successfully!')
        setIsLoaded(true)
        
        // Add sample markers after load
        setTimeout(() => {
          if (map.current) {
            const sampleLocations = [
              { name: 'Golden Gate Bridge', coords: [-122.4783, 37.8199] as [number, number], color: '#3B82F6' },
              { name: 'Fisherman\'s Wharf', coords: [-122.4098, 37.8080] as [number, number], color: '#10B981' },
              { name: 'Union Square', coords: [-122.4074, 37.7879] as [number, number], color: '#F59E0B' }
            ]

            sampleLocations.forEach(location => {
              const marker = addMarkerDebounced(location.coords, { color: location.color })
              if (marker) {
                marker.setPopup(new mapboxgl.Popup({ 
                  offset: 25,
                  closeButton: true,
                  closeOnClick: false
                }).setHTML(`
                  <div class="p-3">
                    <h3 class="font-semibold text-gray-900">${location.name}</h3>
                    <p class="text-sm text-gray-600 mt-1">San Francisco, CA</p>
                  </div>
                `))
              }
            })
          }
        }, 100) // Small delay to ensure map is fully ready
      })

      map.current.on('error', (e: any) => {
        console.error('Optimized map error:', e)
        setError(`Map error: ${e.error?.message || e.message || 'Unknown error'}`)
      })

      // Optimized click handler with throttling
      let clickTimeout: NodeJS.Timeout
      map.current.on('click', (e) => {
        clearTimeout(clickTimeout)
        clickTimeout = setTimeout(() => {
          const { lng, lat } = e.lngLat
          
          const marker = addMarkerDebounced([lng, lat], { color: '#EF4444' })
          if (marker) {
            marker.setPopup(new mapboxgl.Popup({ 
              offset: 25,
              closeButton: true,
              closeOnClick: false
            }).setHTML(`
              <div class="p-3">
                <h3 class="font-semibold text-gray-900">Clicked Location</h3>
                <p class="text-sm text-gray-600 mt-1">
                  Latitude: ${lat.toFixed(6)}<br/>
                  Longitude: ${lng.toFixed(6)}
                </p>
              </div>
            `))
          }
        }, 50) // Throttle clicks to prevent spam
      })

      // Performance monitoring
      map.current.on('render', () => {
        // Optional: Add performance monitoring here
      })

      // Optimize for mobile
      if (window.innerWidth < 768) {
        map.current.setRenderWorldCopies(false)
      }

    } catch (err: any) {
      console.error('Optimized map init error:', err)
      setError(`Init error: ${err.message}`)
    }

    // Cleanup
    return () => {
      clearMarkersDebounced()
      if (map.current) {
        map.current.remove()
        map.current = null
      }
    }
  }, [mapConfig, addMarkerDebounced, clearMarkersDebounced])

  // Optimized handlers
  const handleLocationSelect = useCallback((location: { lng: number; lat: number; address: string }) => {
    console.log('Location selected:', location)
    
    if (map.current) {
      map.current.flyTo({
        center: [location.lng, location.lat],
        zoom: 15,
        essential: true,
        duration: 1000 // Smooth animation
      })

      const marker = addMarkerDebounced([location.lng, location.lat], { color: '#3B82F6' })
      if (marker) {
        marker.setPopup(new mapboxgl.Popup({ 
          offset: 25,
          closeButton: true,
          closeOnClick: false
        }).setHTML(`
          <div class="p-3">
            <h3 class="font-semibold text-gray-900">${location.address}</h3>
            <p class="text-sm text-gray-600 mt-1">Selected Location</p>
          </div>
        `))
      }
    }
  }, [addMarkerDebounced])

  const handleSearchResults = useCallback((results: any[]) => {
    console.log('Search results:', results)
    setSearchResults(results)
    
    // Clear existing property markers
    const propertyMarkers = markersRef.current.filter(marker => 
      marker.getElement()?.style.backgroundColor === 'rgb(139, 92, 246)'
    )
    propertyMarkers.forEach(marker => marker.remove())
    markersRef.current = markersRef.current.filter(marker => 
      marker.getElement()?.style.backgroundColor !== 'rgb(139, 92, 246)'
    )
    
    // Add markers for search results with throttling
    if (map.current && results.length > 0) {
      results.forEach((property, index) => {
        if (property.latitude && property.longitude) {
          setTimeout(() => {
            const marker = addMarkerDebounced([property.longitude, property.latitude], { color: '#8B5CF6' })
            if (marker) {
              marker.setPopup(new mapboxgl.Popup({ 
                offset: 25,
                closeButton: true,
                closeOnClick: false
              }).setHTML(`
                <div class="p-3">
                  <h3 class="font-semibold text-gray-900">${property.address || 'Property'}</h3>
                  <p class="text-sm text-gray-600 mt-1">
                    ${property.city}, ${property.state}<br/>
                    ${property.beds ? `${property.beds} bed` : ''} ${property.baths ? `${property.baths} bath` : ''}
                    ${property.lastSalePrice ? `<br/>$${property.lastSalePrice.toLocaleString()}` : ''}
                  </p>
                </div>
              `))
            }
          }, index * 10) // Stagger marker creation for smoothness
        }
      })
    }
  }, [addMarkerDebounced])

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
            <p className="text-gray-600 font-medium">Loading optimized map...</p>
            <p className="text-xs text-gray-500 mt-1">Enhanced performance & smoothness!</p>
          </div>
        </div>
      )}
      
      {/* Success Indicator */}
      {isLoaded && (
        <div className="absolute top-2 right-2 bg-white px-2 py-1 rounded shadow text-xs text-green-600 font-medium">
          ⚡ Optimized Map Loaded!
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
          Click map to add markers • Smooth & fast interactions
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
