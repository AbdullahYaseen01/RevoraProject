"use client"

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function PropertyDisplay() {
  const [properties, setProperties] = useState<any[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const fetchProperties = async () => {
      try {
        console.log('🔍 Fetching properties for display...')
        
        const response = await fetch('/api/properties/search', {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Accept': 'application/json'
          },
          body: JSON.stringify({
            searchMode: 'database',
            limit: 50,
            page: 1
          })
        })

        if (response.ok) {
          const data = await response.json()
          console.log('✅ Properties fetched:', data.data?.length || 0)
          setProperties(data.data || [])
        } else {
          setError('Failed to fetch properties')
        }
      } catch (err) {
        console.error('❌ Error fetching properties:', err)
        setError('Network error')
      } finally {
        setIsLoading(false)
      }
    }

    fetchProperties()
  }, [])

  if (isLoading) {
    return (
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-gray-600">Loading properties...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="text-center text-red-600">
            <p>❌ Error: {error}</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="mb-6">
      <CardHeader>
        <CardTitle>🏠 Properties Found ({properties.length >= 50 ? `${properties.length}+` : properties.length})</CardTitle>
        <CardDescription>
          These properties are loaded in your database and should appear on the map
        </CardDescription>
      </CardHeader>
      <CardContent>
        {properties.length === 0 ? (
          <div className="text-center text-gray-600 py-8">
            <p>No properties found in database</p>
            <p className="text-sm mt-2">Try clicking "Find Properties" on the map</p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-sm text-gray-600 mb-4">
              ✅ {properties.length} properties loaded successfully!
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-96 overflow-y-auto">
              {properties.slice(0, 20).map((property, index) => (
                <div key={index} className="bg-gray-50 p-3 rounded-lg border">
                  <div className="font-medium text-gray-900 text-sm">
                    {property.address || 'Property Address'}
                  </div>
                  <div className="text-xs text-gray-600 mt-1">
                    {property.city}, {property.state} {property.zipCode}
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {property.beds ? `${property.beds} bed` : ''} 
                    {property.baths ? ` • ${property.baths} bath` : ''}
                    {property.squareFeet ? ` • ${property.squareFeet} sq ft` : ''}
                  </div>
                  {property.lastSalePrice && (
                    <div className="text-xs font-semibold text-green-600 mt-1">
                      ${property.lastSalePrice.toLocaleString()}
                    </div>
                  )}
                </div>
              ))}
            </div>
            
            {properties.length > 20 && (
              <div className="text-sm text-gray-500 text-center mt-4">
                And {properties.length - 20} more properties...
              </div>
            )}
            
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-blue-800 text-sm font-medium">🗺️ Map Instructions:</p>
              <p className="text-blue-700 text-sm mt-1">
                Go to the Properties page and click "Find Properties" to see these properties as markers on the map!
              </p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
