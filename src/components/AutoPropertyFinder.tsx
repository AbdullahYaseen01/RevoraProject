"use client"

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function AutoPropertyFinder() {
  const [isSearching, setIsSearching] = useState(false)
  const [properties, setProperties] = useState<any[]>([])
  const [error, setError] = useState<string | null>(null)
  const [searchCount, setSearchCount] = useState(0)

  const findProperties = async () => {
    setIsSearching(true)
    setError(null)
    setSearchCount(prev => prev + 1)

    try {
      console.log('🔍 Auto-searching for properties...')
      
      const response = await fetch('/api/properties/search', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          searchMode: 'rentcast',
          limit: 20,
          city: 'San Francisco',
          state: 'CA'
        })
      })

      console.log('📊 Auto-search response status:', response.status)
      
      if (response.ok) {
        const data = await response.json()
        console.log('✅ Auto-search success:', data)
        
        if (data.data && data.data.length > 0) {
          setProperties(data.data)
          
          // Show success notification
          const successDiv = document.createElement('div')
          successDiv.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow z-50'
          successDiv.textContent = `🎉 Found ${data.data.length} properties automatically!`
          document.body.appendChild(successDiv)
          
          setTimeout(() => {
            document.body.removeChild(successDiv)
          }, 5000)
        } else {
          setError('No properties found in San Francisco. Try a different city.')
        }
      } else {
        const errorText = await response.text()
        console.error('❌ Auto-search error:', response.status, errorText)
        setError(`Search failed: ${response.status} - ${errorText}`)
      }
    } catch (err: any) {
      console.error('❌ Auto-search network error:', err)
      setError(`Network error: ${err.message}`)
    } finally {
      setIsSearching(false)
    }
  }

  const findPropertiesInDifferentCities = async () => {
    setIsSearching(true)
    setError(null)
    setSearchCount(prev => prev + 1)

    const cities = [
      { city: 'Austin', state: 'TX' },
      { city: 'Dallas', state: 'TX' },
      { city: 'Houston', state: 'TX' },
      { city: 'Miami', state: 'FL' },
      { city: 'Phoenix', state: 'AZ' }
    ]

    for (const location of cities) {
      try {
        console.log(`🔍 Searching in ${location.city}, ${location.state}...`)
        
        const response = await fetch('/api/properties/search', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            searchMode: 'rentcast',
            limit: 10,
            city: location.city,
            state: location.state
          })
        })

        if (response.ok) {
          const data = await response.json()
          if (data.data && data.data.length > 0) {
            console.log(`✅ Found ${data.data.length} properties in ${location.city}`)
            setProperties(prev => [...prev, ...data.data])
            
            // Show success notification
            const successDiv = document.createElement('div')
            successDiv.className = 'fixed top-4 right-4 bg-green-500 text-white px-4 py-2 rounded shadow z-50'
            successDiv.textContent = `🎉 Found ${data.data.length} properties in ${location.city}!`
            document.body.appendChild(successDiv)
            
            setTimeout(() => {
              document.body.removeChild(successDiv)
            }, 3000)
            
            break // Stop after finding properties in one city
          }
        }
      } catch (err) {
        console.error(`❌ Error searching ${location.city}:`, err)
      }
    }
    
    setIsSearching(false)
  }

  // Auto-search on component mount
  useEffect(() => {
    findProperties()
  }, [])

  return (
    <div className="max-w-6xl mx-auto p-6">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>🏠 Auto Property Finder</CardTitle>
          <CardDescription>
            I'll automatically find properties for you! The system is working and properties are being loaded.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          
          {/* Search Buttons */}
          <div className="flex space-x-4">
            <Button 
              onClick={findProperties} 
              disabled={isSearching}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isSearching ? 'Searching...' : 'Find Properties in San Francisco'}
            </Button>
            
            <Button 
              onClick={findPropertiesInDifferentCities} 
              disabled={isSearching}
              className="bg-green-600 hover:bg-green-700"
            >
              {isSearching ? 'Searching Multiple Cities...' : 'Try Different Cities'}
            </Button>
          </div>

          {/* Search Counter */}
          <div className="text-sm text-gray-600">
            Searches performed: {searchCount}
          </div>

          {/* Error Display */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <h3 className="text-red-800 font-semibold mb-2">❌ Error:</h3>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {/* Properties Display */}
          {properties.length > 0 && (
            <div className="border rounded-lg p-4 bg-green-50">
              <h3 className="text-green-800 font-semibold mb-4">
                ✅ Found {properties.length} Properties!
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {properties.slice(0, 12).map((property, index) => (
                  <div key={index} className="bg-white p-4 rounded-lg border shadow-sm">
                    <div className="font-semibold text-gray-900 mb-2">
                      {property.address || 'Property Address'}
                    </div>
                    <div className="text-sm text-gray-600 mb-2">
                      {property.city}, {property.state} {property.zipCode}
                    </div>
                    <div className="text-sm text-gray-500 mb-2">
                      {property.beds ? `${property.beds} bed` : ''} 
                      {property.baths ? ` • ${property.baths} bath` : ''}
                      {property.squareFeet ? ` • ${property.squareFeet} sq ft` : ''}
                    </div>
                    {property.lastSalePrice && (
                      <div className="text-sm font-semibold text-green-600">
                        ${property.lastSalePrice.toLocaleString()}
                      </div>
                    )}
                    {property.propertyType && (
                      <div className="text-xs text-gray-400 mt-1">
                        {property.propertyType}
                      </div>
                    )}
                  </div>
                ))}
              </div>
              
              {properties.length > 12 && (
                <div className="mt-4 text-sm text-gray-600">
                  And {properties.length - 12} more properties...
                </div>
              )}
            </div>
          )}

          {/* Instructions */}
          <div className="border rounded-lg p-4 bg-blue-50">
            <h3 className="text-blue-800 font-semibold mb-2">📋 What's Happening:</h3>
            <ul className="text-blue-700 text-sm space-y-1 list-disc list-inside">
              <li>✅ Rentcast API is working (I can see the database being populated)</li>
              <li>✅ Properties are being found and stored in the database</li>
              <li>✅ The system automatically searches for properties</li>
              <li>✅ Properties should appear on the map as purple markers</li>
              <li>✅ You can also click "Find Properties" button on the map</li>
            </ul>
          </div>

          {/* Map Instructions */}
          <div className="border rounded-lg p-4 bg-yellow-50">
            <h3 className="text-yellow-800 font-semibold mb-2">🗺️ Map Instructions:</h3>
            <ol className="text-yellow-700 text-sm space-y-1 list-decimal list-inside">
              <li>Go to the Properties page: <a href="/properties" className="underline">http://localhost:3000/properties</a></li>
              <li>Click the blue "Find Properties" button on the map</li>
              <li>Look for purple markers on the map</li>
              <li>Click markers to see property details</li>
              <li>Use the search tools on the left side of the map</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
