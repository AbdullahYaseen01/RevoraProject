"use client"

import SimpleMapboxMap from '@/components/mapbox/SimpleMapboxMap'
import FallbackMapboxMap from '@/components/mapbox/FallbackMapboxMap'
import CustomMapboxMap from '@/components/mapbox/CustomMapboxMap'
import EnhancedMapboxMap from '@/components/mapbox/EnhancedMapboxMap'
import OptimizedMapboxMap from '@/components/mapbox/OptimizedMapboxMap'
import PropertyDisplay from '@/components/PropertyDisplay'

export default function TestMapPage() {
  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Map Test Page</h1>
        
        <PropertyDisplay />
        
        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">⚡ Optimized Map - Fastest & Smoothest (NEW!)</h2>
          <p className="text-gray-600 mb-4">This map includes performance optimizations, debounced search, and smooth interactions for the best user experience.</p>
          <div className="h-[600px]">
            <OptimizedMapboxMap />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">🚀 Enhanced Map with Search Tools</h2>
          <p className="text-gray-600 mb-4">This map includes comprehensive search functionality, location tools, and interactive features.</p>
          <div className="h-[600px]">
            <EnhancedMapboxMap />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Custom Map Test</h2>
          <div className="h-[500px]">
            <CustomMapboxMap />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Simple Map Test</h2>
          <SimpleMapboxMap />
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Fallback Map Test</h2>
          <FallbackMapboxMap />
        </div>

        <div className="bg-white rounded-lg shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-4">Enhanced Map Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Search Tools:</h3>
              <ul className="space-y-1 text-gray-600">
                <li>• Address and place search</li>
                <li>• Current location detection</li>
                <li>• Property search integration</li>
                <li>• Quick location buttons</li>
                <li>• Marker management</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-gray-900 mb-2">Map Controls:</h3>
              <ul className="space-y-1 text-gray-600">
                <li>• Navigation controls</li>
                <li>• Geolocation control</li>
                <li>• Scale control</li>
                <li>• Fullscreen control</li>
                <li>• Click to add markers</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
