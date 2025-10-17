"use client"

import { useState } from 'react'
import PropertyMapboxMap from '@/components/mapbox/PropertyMapboxMap'
import MapboxStatus from '@/components/mapbox/MapboxStatus'
import { GeocodingResult } from '@/lib/mapbox'

// Sample property data for demonstration
const sampleProperties = [
  {
    id: '1',
    address: '123 Main St',
    city: 'San Francisco',
    state: 'CA',
    zipCode: '94102',
    latitude: 37.7749,
    longitude: -122.4194,
    beds: 3,
    baths: 2,
    squareFeet: 1500,
    lastSalePrice: 850000,
    propertyType: 'Single Family',
    yearBuilt: 1995,
    imageUrl: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400'
  },
  {
    id: '2',
    address: '456 Market St',
    city: 'San Francisco',
    state: 'CA',
    zipCode: '94103',
    latitude: 37.7849,
    longitude: -122.4094,
    beds: 2,
    baths: 1,
    squareFeet: 1200,
    lastSalePrice: 750000,
    propertyType: 'Condo',
    yearBuilt: 2010,
    imageUrl: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=400'
  },
  {
    id: '3',
    address: '789 Valencia St',
    city: 'San Francisco',
    state: 'CA',
    zipCode: '94110',
    latitude: 37.7649,
    longitude: -122.4294,
    beds: 4,
    baths: 3,
    squareFeet: 2000,
    lastSalePrice: 1200000,
    propertyType: 'Townhouse',
    yearBuilt: 2005,
    imageUrl: 'https://images.unsplash.com/photo-1568605114967-8130f3a36994?w=400'
  }
]

export default function MapboxDemoPage() {
  const [selectedProperty, setSelectedProperty] = useState<any>(null)
  const [searchResult, setSearchResult] = useState<GeocodingResult | null>(null)

  const handlePropertyClick = (property: any) => {
    setSelectedProperty(property)
    console.log('Property clicked:', property)
  }

  const handleMapClick = (coordinates: [number, number]) => {
    console.log('Map clicked at:', coordinates)
    setSelectedProperty(null)
  }

  const handleGeocodingResult = (result: GeocodingResult) => {
    setSearchResult(result)
    console.log('Geocoding result:', result)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Mapbox Integration Demo</h1>
          <p className="text-gray-600">
            Comprehensive demonstration of Mapbox features including interactive maps, geocoding, clustering, and custom styles.
          </p>
        </div>

        {/* Mapbox Status Check */}
        <MapboxStatus />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Map Section */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <div className="h-[600px] w-full">
                <PropertyMapboxMap
                  properties={sampleProperties}
                  center={[-122.4194, 37.7749]}
                  zoom={12}
                  onPropertyClick={handlePropertyClick}
                  onMapClick={handleMapClick}
                  showClustering={true}
                  showSearch={true}
                  showControls={true}
                  showStyleSelector={true}
                  showCoordinateDisplay={true}
                  className="w-full h-full"
                />
              </div>
            </div>
          </div>

          {/* Info Panel */}
          <div className="space-y-6">
            {/* Selected Property */}
            {selectedProperty && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Selected Property</h3>
                <div className="space-y-3">
                  <div>
                    <span className="font-medium text-gray-700">Address:</span>
                    <span className="ml-2 text-gray-900">{selectedProperty.address}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">City:</span>
                    <span className="ml-2 text-gray-900">{selectedProperty.city}, {selectedProperty.state}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Price:</span>
                    <span className="ml-2 text-green-600 font-semibold">
                      ${selectedProperty.lastSalePrice?.toLocaleString()}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Details:</span>
                    <span className="ml-2 text-gray-900">
                      {selectedProperty.beds} bd • {selectedProperty.baths} ba • {selectedProperty.squareFeet?.toLocaleString()} sqft
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Type:</span>
                    <span className="ml-2 text-gray-900">{selectedProperty.propertyType}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Year Built:</span>
                    <span className="ml-2 text-gray-900">{selectedProperty.yearBuilt}</span>
                  </div>
                </div>
              </div>
            )}

            {/* Search Result */}
            {searchResult && (
              <div className="bg-white rounded-lg shadow-md p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Search Result</h3>
                <div className="space-y-3">
                  <div>
                    <span className="font-medium text-gray-700">Place:</span>
                    <span className="ml-2 text-gray-900">{searchResult.text}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Full Address:</span>
                    <span className="ml-2 text-gray-900">{searchResult.place_name}</span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Coordinates:</span>
                    <span className="ml-2 text-gray-900">
                      {searchResult.center[1].toFixed(6)}, {searchResult.center[0].toFixed(6)}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Type:</span>
                    <span className="ml-2 text-gray-900">{searchResult.place_type.join(', ')}</span>
                  </div>
                  {searchResult.properties.category && (
                    <div>
                      <span className="font-medium text-gray-700">Category:</span>
                      <span className="ml-2 text-gray-900">{searchResult.properties.category}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Features List */}
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Mapbox Features</h3>
              <div className="space-y-2 text-sm">
                <div className="flex items-center space-x-2">
                  <span className="text-green-500">✅</span>
                  <span>Interactive Map with Mapbox GL JS</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-green-500">✅</span>
                  <span>Geocoding & Reverse Geocoding</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-green-500">✅</span>
                  <span>Marker Clustering</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-green-500">✅</span>
                  <span>Custom Map Styles & Themes</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-green-500">✅</span>
                  <span>Advanced Map Controls</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-green-500">✅</span>
                  <span>Property Popups & Details</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-green-500">✅</span>
                  <span>Coordinate Display</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-green-500">✅</span>
                  <span>Search Integration</span>
                </div>
              </div>
            </div>

            {/* Instructions */}
            <div className="bg-blue-50 rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-900 mb-4">How to Use</h3>
              <div className="space-y-2 text-sm text-blue-800">
                <p>• <strong>Search:</strong> Use the search box to find locations</p>
                <p>• <strong>Click Properties:</strong> Click on property markers for details</p>
                <p>• <strong>Change Style:</strong> Use the style selector in the top-right</p>
                <p>• <strong>Map Controls:</strong> Use zoom, compass, and fullscreen controls</p>
                <p>• <strong>Clustering:</strong> Zoom out to see property clusters</p>
                <p>• <strong>Coordinates:</strong> Hover over the map to see coordinates</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
