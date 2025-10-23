"use client"

import { useState, useEffect, useRef, useCallback } from 'react'
import MapboxMap from './MapboxMap'
import MapboxMarker from './MapboxMarker'
import MapboxPopup from './MapboxPopup'
import MapboxClustering, { ClusterPoint } from './MapboxClustering'
import MapStyleSelector from './MapStyleSelector'
import GeocodingSearch from './GeocodingSearch'
import MapControls, { LayerControl, CoordinateDisplay } from './MapControls'
import { MAP_STYLES, MAP_THEMES, getDefaultStyle, getDefaultTheme } from '@/lib/mapbox-styles'
import { GeocodingResult } from '@/lib/mapbox'
import mapboxgl from 'mapbox-gl'

export interface Property {
  id: string
  address: string
  city: string
  state: string
  zipCode: string
  latitude?: number
  longitude?: number
  beds?: number
  baths?: number
  squareFeet?: number
  lastSalePrice?: number
  propertyType?: string
  yearBuilt?: number
  imageUrl?: string
}

export interface PropertyMapboxMapProps {
  properties?: Property[]
  center?: [number, number]
  zoom?: number
  className?: string
  onPropertyClick?: (property: Property) => void
  onMapClick?: (coordinates: [number, number]) => void
  onBoundsChange?: (bounds: mapboxgl.LngLatBounds) => void
  showClustering?: boolean
  showSearch?: boolean
  showControls?: boolean
  showStyleSelector?: boolean
  showCoordinateDisplay?: boolean
  maxZoom?: number
  minZoom?: number
}

export default function PropertyMapboxMap({
  properties = [],
  center = [-122.4194, 37.7749],
  zoom = 10,
  className = '',
  onPropertyClick,
  onMapClick,
  onBoundsChange,
  showClustering = true,
  showSearch = true,
  showControls = true,
  showStyleSelector = true,
  showCoordinateDisplay = true,
  maxZoom = 18,
  minZoom = 5
}: PropertyMapboxMapProps) {
  const [map, setMap] = useState<mapboxgl.Map | null>(null)
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)
  const [currentStyle, setCurrentStyle] = useState(getDefaultStyle().id)
  const [currentTheme, setCurrentTheme] = useState(getDefaultTheme().id)
  const [searchResults, setSearchResults] = useState<GeocodingResult[]>([])
  const [isMapLoaded, setIsMapLoaded] = useState(false)
  const [drawMode, setDrawMode] = useState<'point' | 'line' | 'polygon' | null>(null)
  const [layers, setLayers] = useState([
    { id: 'properties', name: 'Properties', visible: true, type: 'circle' as const },
    { id: 'clusters', name: 'Clusters', visible: true, type: 'circle' as const }
  ])

  // Convert properties to cluster points
  const clusterPoints: ClusterPoint[] = (properties || [])
    .filter(p => p.latitude && p.longitude)
    .map(p => ({
      id: p.id,
      coordinates: [p.longitude!, p.latitude!],
      properties: {
        address: p.address,
        city: p.city,
        state: p.state,
        zipCode: p.zipCode,
        beds: p.beds,
        baths: p.baths,
        squareFeet: p.squareFeet,
        lastSalePrice: p.lastSalePrice,
        propertyType: p.propertyType,
        yearBuilt: p.yearBuilt,
        imageUrl: p.imageUrl
      }
    }))

  // Handle map load
  const handleMapLoad = useCallback((mapInstance: mapboxgl.Map) => {
    setMap(mapInstance)
    setIsMapLoaded(true)
  }, [])

  // Handle map click
  const handleMapClick = useCallback((e: mapboxgl.MapMouseEvent) => {
    onMapClick?.([e.lngLat.lng, e.lngLat.lat])
    setSelectedProperty(null)
  }, [onMapClick])

  // Handle property click
  const handlePropertyClick = useCallback((property: Property) => {
    setSelectedProperty(property)
    onPropertyClick?.(property)
  }, [onPropertyClick])

  // Handle cluster click
  const handleClusterClick = useCallback((cluster: any) => {
    console.log('Cluster clicked:', cluster)
  }, [])

  // Handle point click from clustering
  const handlePointClick = useCallback((point: ClusterPoint) => {
    const property = properties.find(p => p.id === point.id)
    if (property) {
      handlePropertyClick(property)
    }
  }, [properties, handlePropertyClick])

  // Handle geocoding search
  const handleGeocodingResult = useCallback((result: GeocodingResult) => {
    if (map) {
      map.flyTo({
        center: result.center,
        zoom: 15
      })
    }
    setSearchResults([result])
  }, [map])

  // Handle style change
  const handleStyleChange = useCallback((styleId: string) => {
    setCurrentStyle(styleId)
  }, [])

  // Handle theme change
  const handleThemeChange = useCallback((themeId: string) => {
    setCurrentTheme(themeId)
  }, [])

  // Handle layer toggle
  const handleLayerToggle = useCallback((layerId: string, visible: boolean) => {
    setLayers(prev => prev.map(layer => 
      layer.id === layerId ? { ...layer, visible } : layer
    ))
  }, [])

  // Handle draw mode change
  const handleDrawModeChange = useCallback((mode: 'point' | 'line' | 'polygon' | null) => {
    setDrawMode(mode)
  }, [])

  // Get current theme
  const currentThemeConfig = MAP_THEMES.find(t => t.id === currentTheme) || getDefaultTheme()

  // Create property popup content
  const createPropertyPopupContent = (property: Property) => {
    return `
      <div class="property-popup p-4 max-w-sm">
        ${property.imageUrl ? `
          <img src="${property.imageUrl}" alt="${property.address}" class="w-full h-32 object-cover rounded mb-3" />
        ` : ''}
        <h3 class="font-semibold text-gray-900 mb-2">${property.address}</h3>
        <p class="text-sm text-gray-600 mb-2">${property.city}, ${property.state} ${property.zipCode}</p>
        <div class="grid grid-cols-2 gap-2 text-sm text-gray-700 mb-3">
          <div>Beds: ${property.beds || 'N/A'}</div>
          <div>Baths: ${property.baths || 'N/A'}</div>
          <div>Sq Ft: ${property.squareFeet?.toLocaleString() || 'N/A'}</div>
          <div>Year: ${property.yearBuilt || 'N/A'}</div>
        </div>
        ${property.lastSalePrice ? `
          <div class="text-lg font-bold text-green-600 mb-3">
            $${property.lastSalePrice.toLocaleString()}
          </div>
        ` : ''}
        ${property.propertyType ? `
          <div class="inline-block bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs mb-3">
            ${property.propertyType}
          </div>
        ` : ''}
        <button class="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 text-sm">
          View Details
        </button>
      </div>
    `
  }

  return (
    <div className={`relative ${className}`}>
      {/* Map */}
      <MapboxMap
        center={center}
        zoom={zoom}
        style={MAP_STYLES.find(s => s.id === currentStyle)?.style || getDefaultStyle().style}
        onMapLoad={handleMapLoad}
        onMapClick={handleMapClick}
        maxZoom={maxZoom}
        minZoom={minZoom}
        className="w-full h-full"
      >
        {/* Clustering */}
        {showClustering && isMapLoaded && map && (
          <MapboxClustering
            map={map}
            points={clusterPoints}
            onClusterClick={handleClusterClick}
            onPointClick={handlePointClick}
          />
        )}

        {/* Individual markers (when not clustering) */}
        {!showClustering && isMapLoaded && map && properties
          .filter(p => p.latitude && p.longitude)
          .map(property => (
            <MapboxMarker
              key={property.id}
              map={map}
              coordinates={[property.longitude!, property.latitude!]}
              color={currentThemeConfig.markerColors.default}
              onClick={() => handlePropertyClick(property)}
              popup={createPropertyPopupContent(property)}
            />
          ))}

        {/* Selected property popup */}
        {selectedProperty && isMapLoaded && map && selectedProperty.latitude && selectedProperty.longitude && (
          <MapboxPopup
            map={map}
            coordinates={[selectedProperty.longitude, selectedProperty.latitude]}
            content={createPropertyPopupContent(selectedProperty)}
            options={{
              closeButton: true,
              closeOnClick: true,
              className: 'property-popup'
            }}
            onClose={() => setSelectedProperty(null)}
          />
        )}
      </MapboxMap>

      {/* Search */}
      {showSearch && (
        <div className="absolute top-4 left-4 z-10 w-80">
          <GeocodingSearch
            onResultSelect={handleGeocodingResult}
            placeholder="Search for properties..."
            limit={5}
            types={['address', 'poi', 'neighborhood', 'locality']}
          />
        </div>
      )}

      {/* Style Selector */}
      {showStyleSelector && (
        <div className="absolute top-4 right-4 z-10">
          <MapStyleSelector
            currentStyle={currentStyle}
            currentTheme={currentTheme}
            onStyleChange={handleStyleChange}
            onThemeChange={handleThemeChange}
          />
        </div>
      )}


      {/* Coordinate Display */}
      {showCoordinateDisplay && (
        <div className="absolute bottom-4 left-4 z-10">
          <CoordinateDisplay map={map} />
        </div>
      )}

      {/* Draw Mode Indicator */}
      {drawMode && (
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-20">
          <div className="bg-blue-600 text-white px-4 py-2 rounded-md shadow-lg">
            <span className="text-sm font-medium">
              Draw Mode: {drawMode.charAt(0).toUpperCase() + drawMode.slice(1)}
            </span>
            <button
              onClick={() => setDrawMode(null)}
              className="ml-2 text-blue-200 hover:text-white"
            >
              ✕
            </button>
          </div>
        </div>
      )}

      {/* Properties Count */}
      <div className="absolute top-4 left-1/2 transform -translate-x-1/2 z-10">
        <div className="bg-white rounded-lg shadow-lg border border-gray-200 px-4 py-3">
          <span className="text-sm font-semibold text-gray-900">
            {properties.length} Properties
          </span>
        </div>
      </div>
    </div>
  )
}
