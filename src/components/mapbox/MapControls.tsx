"use client"

import { useState, useEffect } from 'react'
import mapboxgl from 'mapbox-gl'

export interface MapControlsProps {
  map: mapboxgl.Map | null
  className?: string
  showZoom?: boolean
  showCompass?: boolean
  showGeolocate?: boolean
  showFullscreen?: boolean
  showLayerControl?: boolean
  showMeasure?: boolean
  showDraw?: boolean
  onLayerToggle?: (layerId: string, visible: boolean) => void
  onDrawModeChange?: (mode: 'point' | 'line' | 'polygon' | null) => void
}

export default function MapControls({
  map,
  className = '',
  showZoom = true,
  showCompass = true,
  showGeolocate = true,
  showFullscreen = true,
  showLayerControl = true,
  showMeasure = true,
  showDraw = true,
  onLayerToggle,
  onDrawModeChange
}: MapControlsProps) {
  const [isFullscreen, setIsFullscreen] = useState(false)
  const [drawMode, setDrawMode] = useState<'point' | 'line' | 'polygon' | null>(null)
  const [isMeasuring, setIsMeasuring] = useState(false)
  const [measurement, setMeasurement] = useState<{ distance?: number; area?: number }>({})

  // Fullscreen handling
  useEffect(() => {
    const handleFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement)
    }

    document.addEventListener('fullscreenchange', handleFullscreenChange)
    return () => document.removeEventListener('fullscreenchange', handleFullscreenChange)
  }, [])

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen()
    } else {
      document.exitFullscreen()
    }
  }

  const handleDrawModeChange = (mode: 'point' | 'line' | 'polygon' | null) => {
    setDrawMode(mode)
    onDrawModeChange?.(mode)
  }

  const handleMeasureToggle = () => {
    setIsMeasuring(!isMeasuring)
    if (!isMeasuring) {
      // Initialize measurement mode
      setMeasurement({})
    }
  }

  const zoomIn = () => {
    if (map) {
      map.zoomIn()
    }
  }

  const zoomOut = () => {
    if (map) {
      map.zoomOut()
    }
  }

  const resetNorth = () => {
    if (map) {
      map.resetNorth()
    }
  }

  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          if (map) {
            map.flyTo({
              center: [position.coords.longitude, position.coords.latitude],
              zoom: 15
            })
          }
        },
        (error) => {
          console.error('Geolocation error:', error)
        }
      )
    }
  }

  return (
    <div className={`map-controls ${className}`}>
      {/* Zoom Controls */}
      {showZoom && (
        <div className="bg-white rounded-md shadow-md border border-gray-300 overflow-hidden">
          <button
            onClick={zoomIn}
            className="block w-10 h-10 flex items-center justify-center hover:bg-gray-50 border-b border-gray-200"
            title="Zoom in"
          >
            <span className="text-lg font-bold text-gray-600">+</span>
          </button>
          <button
            onClick={zoomOut}
            className="block w-10 h-10 flex items-center justify-center hover:bg-gray-50"
            title="Zoom out"
          >
            <span className="text-lg font-bold text-gray-600">−</span>
          </button>
        </div>
      )}

      {/* Compass */}
      {showCompass && (
        <button
          onClick={resetNorth}
          className="w-10 h-10 bg-white rounded-md shadow-md border border-gray-300 flex items-center justify-center hover:bg-gray-50"
          title="Reset north"
        >
          <span className="text-lg">🧭</span>
        </button>
      )}

      {/* Geolocate */}
      {showGeolocate && (
        <button
          onClick={getCurrentLocation}
          className="w-10 h-10 bg-white rounded-md shadow-md border border-gray-300 flex items-center justify-center hover:bg-gray-50"
          title="Get current location"
        >
          <span className="text-lg">📍</span>
        </button>
      )}

      {/* Fullscreen */}
      {showFullscreen && (
        <button
          onClick={toggleFullscreen}
          className="w-10 h-10 bg-white rounded-md shadow-md border border-gray-300 flex items-center justify-center hover:bg-gray-50"
          title={isFullscreen ? "Exit fullscreen" : "Enter fullscreen"}
        >
          <span className="text-lg">{isFullscreen ? "⛶" : "⛶"}</span>
        </button>
      )}

      {/* Draw Controls */}
      {showDraw && (
        <div className="bg-white rounded-md shadow-md border border-gray-300 overflow-hidden">
          <button
            onClick={() => handleDrawModeChange(drawMode === 'point' ? null : 'point')}
            className={`block w-10 h-10 flex items-center justify-center hover:bg-gray-50 border-b border-gray-200 ${
              drawMode === 'point' ? 'bg-blue-50 text-blue-600' : ''
            }`}
            title="Draw point"
          >
            <span className="text-sm">📍</span>
          </button>
          <button
            onClick={() => handleDrawModeChange(drawMode === 'line' ? null : 'line')}
            className={`block w-10 h-10 flex items-center justify-center hover:bg-gray-50 border-b border-gray-200 ${
              drawMode === 'line' ? 'bg-blue-50 text-blue-600' : ''
            }`}
            title="Draw line"
          >
            <span className="text-sm">📏</span>
          </button>
          <button
            onClick={() => handleDrawModeChange(drawMode === 'polygon' ? null : 'polygon')}
            className={`block w-10 h-10 flex items-center justify-center hover:bg-gray-50 ${
              drawMode === 'polygon' ? 'bg-blue-50 text-blue-600' : ''
            }`}
            title="Draw polygon"
          >
            <span className="text-sm">⬟</span>
          </button>
        </div>
      )}

      {/* Measure Control */}
      {showMeasure && (
        <button
          onClick={handleMeasureToggle}
          className={`w-10 h-10 rounded-md shadow-md border border-gray-300 flex items-center justify-center hover:bg-gray-50 ${
            isMeasuring ? 'bg-blue-50 text-blue-600' : 'bg-white'
          }`}
          title="Measure distance/area"
        >
          <span className="text-lg">📐</span>
        </button>
      )}

      {/* Measurement Display */}
      {isMeasuring && (measurement.distance || measurement.area) && (
        <div className="bg-white rounded-md shadow-md border border-gray-300 p-3 min-w-32">
          <div className="text-sm font-medium text-gray-900 mb-1">Measurement</div>
          {measurement.distance && (
            <div className="text-xs text-gray-600">
              Distance: {measurement.distance.toFixed(2)} m
            </div>
          )}
          {measurement.area && (
            <div className="text-xs text-gray-600">
              Area: {measurement.area.toFixed(2)} m²
            </div>
          )}
        </div>
      )}
    </div>
  )
}

// Layer control component
export interface LayerControlProps {
  map: mapboxgl.Map | null
  layers: Array<{
    id: string
    name: string
    visible: boolean
    type: 'fill' | 'line' | 'circle' | 'symbol'
  }>
  onLayerToggle: (layerId: string, visible: boolean) => void
  className?: string
}

export function LayerControl({ map, layers, onLayerToggle, className = '' }: LayerControlProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleLayerToggle = (layerId: string, visible: boolean) => {
    if (map) {
      map.setLayoutProperty(layerId, 'visibility', visible ? 'visible' : 'none')
    }
    onLayerToggle(layerId, visible)
  }

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-10 h-10 bg-white rounded-md shadow-md border border-gray-300 flex items-center justify-center hover:bg-gray-50"
        title="Layer control"
      >
        <span className="text-lg">📋</span>
      </button>

      {isOpen && (
        <div className="absolute top-full right-0 mt-1 w-48 bg-white rounded-md shadow-lg border border-gray-300 z-50">
          <div className="p-3 border-b border-gray-200">
            <h3 className="text-sm font-medium text-gray-900">Layers</h3>
          </div>
          <div className="max-h-64 overflow-y-auto">
            {layers.map((layer) => (
              <label
                key={layer.id}
                className="flex items-center px-3 py-2 hover:bg-gray-50 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={layer.visible}
                  onChange={(e) => handleLayerToggle(layer.id, e.target.checked)}
                  className="mr-3 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700">{layer.name}</span>
              </label>
            ))}
          </div>
        </div>
      )}

      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}

// Coordinate display component
export interface CoordinateDisplayProps {
  map: mapboxgl.Map | null
  className?: string
}

export function CoordinateDisplay({ map, className = '' }: CoordinateDisplayProps) {
  const [coordinates, setCoordinates] = useState<[number, number] | null>(null)

  useEffect(() => {
    if (!map) return

    const handleMouseMove = (e: mapboxgl.MapMouseEvent) => {
      setCoordinates([e.lngLat.lng, e.lngLat.lat])
    }

    map.on('mousemove', handleMouseMove)

    return () => {
      map.off('mousemove', handleMouseMove)
    }
  }, [map])

  if (!coordinates) return null

  return (
    <div className={`bg-white rounded-md shadow-md border border-gray-300 px-3 py-2 text-xs text-gray-600 ${className}`}>
      <div>Lng: {coordinates[0].toFixed(6)}</div>
      <div>Lat: {coordinates[1].toFixed(6)}</div>
    </div>
  )
}
