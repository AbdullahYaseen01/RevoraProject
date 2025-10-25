"use client"

import { useState, useRef, useEffect, useCallback, useMemo } from 'react'
import { Search, MapPin, Filter, Layers, Navigation } from 'lucide-react'
import mapboxgl from 'mapbox-gl'

interface MapSearchToolsProps {
  map?: mapboxgl.Map | null
  onLocationSelect?: (location: { lng: number; lat: number; address: string }) => void
  onSearchResults?: (results: any[]) => void
}

export default function MapSearchTools({ map, onLocationSelect, onSearchResults }: MapSearchToolsProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [searchResults, setSearchResults] = useState<any[]>([])
  const [showResults, setShowResults] = useState(false)
  const [isSearching, setIsSearching] = useState(false)
  const [isSearchingProperties, setIsSearchingProperties] = useState(false)
  const [currentLocation, setCurrentLocation] = useState<{ lng: number; lat: number } | null>(null)
  const searchInputRef = useRef<HTMLInputElement>(null)

  // Debounced geocoding search function
  const searchLocation = useCallback(async (query: string) => {
    if (!query.trim()) return

    setIsSearching(true)
    try {
      const response = await fetch(
        `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN}&limit=5&types=place,locality,neighborhood,address,poi`
      )
      
      if (response.ok) {
        const data = await response.json()
        setSearchResults(data.features || [])
        setShowResults(true)
      }
    } catch (error) {
      console.error('Geocoding error:', error)
    } finally {
      setIsSearching(false)
    }
  }, [])

  // Debounced search handler
  const debouncedSearch = useMemo(() => {
    let timeoutId: NodeJS.Timeout
    return (query: string) => {
      clearTimeout(timeoutId)
      timeoutId = setTimeout(() => {
        searchLocation(query)
      }, 300) // 300ms debounce
    }
  }, [searchLocation])

  // Handle search input with debouncing
  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    searchLocation(searchQuery)
  }

  // Handle input change with debouncing
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setSearchQuery(value)
    if (value.trim()) {
      debouncedSearch(value)
    } else {
      setShowResults(false)
      setSearchResults([])
    }
  }

  // Handle result selection
  const handleResultSelect = (result: any) => {
    const [lng, lat] = result.center
    const address = result.place_name

    // Update map view
    if (map) {
      map.flyTo({
        center: [lng, lat],
        zoom: 15,
        essential: true
      })

      // Add marker
      new mapboxgl.Marker({ color: '#3B82F6' })
        .setLngLat([lng, lat])
        .setPopup(new mapboxgl.Popup().setHTML(`<div class="p-2"><strong>${address}</strong></div>`))
        .addTo(map)
    }

    // Call callback
    onLocationSelect?.({ lng, lat, address })

    // Clear search
    setSearchQuery('')
    setShowResults(false)
    setSearchResults([])
  }

  // Get current location
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by this browser.')
      return
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { longitude, latitude } = position.coords
        setCurrentLocation({ lng: longitude, lat: latitude })

        if (map) {
          map.flyTo({
            center: [longitude, latitude],
            zoom: 15,
            essential: true
          })

          new mapboxgl.Marker({ color: '#10B981' })
            .setLngLat([longitude, latitude])
            .setPopup(new mapboxgl.Popup().setHTML('<div class="p-2"><strong>Your Location</strong></div>'))
            .addTo(map)
        }
      },
      (error) => {
        console.error('Geolocation error:', error)
        alert('Unable to retrieve your location.')
      }
    )
  }

  // Property search function
  const searchProperties = async () => {
    if (!map) return
    
    console.log('Searching for properties...')
    setIsSearchingProperties(true)
    
    try {
      // Get current map center and bounds
      const center = map.getCenter()
      const bounds = map.getBounds()
      
      console.log('Map center:', center.lng, center.lat)
      console.log('Map bounds:', bounds.getNorth(), bounds.getSouth(), bounds.getEast(), bounds.getWest())
      
      // Use map bounds for search or fallback to center
      const searchParams: any = {
        searchMode: 'rentcast',
        limit: 50,
        sortBy: 'lastSaleDate',
        sortOrder: 'desc',
        page: 1
      }
      
      // Try to search within map bounds first
      if (bounds) {
        searchParams.bounds = {
          north: bounds.getNorth(),
          south: bounds.getSouth(),
          east: bounds.getEast(),
          west: bounds.getWest()
        }
      } else {
        // Fallback to center coordinates
        searchParams.latitude = center.lat
        searchParams.longitude = center.lng
        searchParams.radius = 10 // 10 mile radius
      }
      
      const response = await fetch('/api/properties/map-search', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify(searchParams)
      })

      console.log('Property search response status:', response.status)

      if (response.ok) {
        const data = await response.json()
        console.log('Property search results:', data)
        
        if (data.data && data.data.length > 0) {
          onSearchResults?.(data.data)
          
          // Show success message
          const successDiv = document.createElement('div')
          successDiv.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow z-50'
          successDiv.textContent = `Found ${data.data.length} properties!`
          document.body.appendChild(successDiv)
          
          setTimeout(() => {
            document.body.removeChild(successDiv)
          }, 3000)
        } else {
          // Show no results message
          const noResultsDiv = document.createElement('div')
          noResultsDiv.className = 'fixed top-4 right-4 bg-yellow-500 text-white px-4 py-2 rounded shadow z-50'
          noResultsDiv.textContent = 'No properties found in this area'
          document.body.appendChild(noResultsDiv)
          
          setTimeout(() => {
            document.body.removeChild(noResultsDiv)
          }, 3000)
        }
      } else {
        const errorData = await response.text()
        console.error('Property search failed:', response.status, errorData)
        
        // Show error message
        const errorDiv = document.createElement('div')
        errorDiv.className = 'fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded shadow z-50'
        errorDiv.textContent = `Search failed: ${response.status}`
        document.body.appendChild(errorDiv)
        
        setTimeout(() => {
          document.body.removeChild(errorDiv)
        }, 3000)
      }
    } catch (error) {
      console.error('Property search error:', error)
      
      // Show error message
      const errorDiv = document.createElement('div')
      errorDiv.className = 'fixed top-4 right-4 bg-red-500 text-white px-4 py-2 rounded shadow z-50'
      errorDiv.textContent = 'Network error - please try again'
      document.body.appendChild(errorDiv)
      
      setTimeout(() => {
        document.body.removeChild(errorDiv)
      }, 3000)
    } finally {
      setIsSearchingProperties(false)
    }
  }

  // Clear all markers
  const clearMarkers = () => {
    if (!map) return
    
    // Remove all markers (this is a simple approach)
    const markers = document.querySelectorAll('.mapboxgl-marker')
    markers.forEach(marker => marker.remove())
  }

  return (
    <div className="absolute top-4 left-4 z-10 bg-white rounded-lg shadow-lg p-4 min-w-[300px]">
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="mb-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={handleInputChange}
            placeholder="Search for places, addresses..."
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          {isSearching && (
            <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
            </div>
          )}
        </div>
      </form>

      {/* Search Results */}
      {showResults && searchResults.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-60 overflow-y-auto z-20">
          {searchResults.map((result, index) => (
            <button
              key={index}
              onClick={() => handleResultSelect(result)}
              className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
            >
              <div className="flex items-start space-x-3">
                <MapPin className="w-4 h-4 text-blue-500 mt-0.5 flex-shrink-0" />
                <div>
                  <div className="font-medium text-gray-900 text-sm">
                    {result.text}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {result.place_name}
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* Map Tools */}
      <div className="space-y-2">
        <div className="flex space-x-2">
          <button
            onClick={getCurrentLocation}
            className="flex items-center space-x-2 px-3 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm"
          >
            <Navigation className="w-4 h-4" />
            <span>My Location</span>
          </button>
          
          <button
            onClick={searchProperties}
            disabled={isSearchingProperties}
            className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSearchingProperties ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                <span>Searching...</span>
              </>
            ) : (
              <>
                <Filter className="w-4 h-4" />
                <span>Find Properties</span>
              </>
            )}
          </button>
        </div>

        <div className="flex space-x-2">
          <button
            onClick={clearMarkers}
            className="flex items-center space-x-2 px-3 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-sm"
          >
            <Layers className="w-4 h-4" />
            <span>Clear Markers</span>
          </button>
        </div>
      </div>

      {/* Quick Location Buttons */}
      <div className="mt-4 pt-4 border-t border-gray-200">
        <div className="text-xs text-gray-600 mb-2 font-medium">Quick Locations:</div>
        <div className="grid grid-cols-2 gap-2">
          {[
            { name: 'San Francisco', coords: [-122.4194, 37.7749] },
            { name: 'New York', coords: [-74.006, 40.7128] },
            { name: 'Los Angeles', coords: [-118.2437, 34.0522] },
            { name: 'Chicago', coords: [-87.6298, 41.8781] }
          ].map((location, index) => (
            <button
              key={index}
              onClick={() => {
                if (map) {
                  map.flyTo({
                    center: location.coords,
                    zoom: 12,
                    essential: true,
                    duration: 1500
                  })
                  
                  // Add a marker for the selected location
                  new mapboxgl.Marker({ color: '#3B82F6' })
                    .setLngLat(location.coords)
                    .setPopup(new mapboxgl.Popup().setHTML(`
                      <div class="p-2">
                        <h3 class="font-semibold text-gray-900">${location.name}</h3>
                        <p class="text-sm text-gray-600">Quick Location</p>
                      </div>
                    `))
                    .addTo(map)
                }
              }}
              className="px-3 py-2 text-xs font-medium bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-lg transition-all duration-200 hover:shadow-sm hover:scale-105"
            >
              {location.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
