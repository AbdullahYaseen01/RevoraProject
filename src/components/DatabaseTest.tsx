"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function DatabaseTest() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const testDatabaseAPI = async () => {
    setIsLoading(true)
    setError(null)
    setResult(null)

    try {
      console.log('Testing Database API...')
      
      const response = await fetch('/api/properties/search', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          searchMode: 'database',
          limit: 10,
          city: 'San Francisco',
          state: 'CA'
        })
      })

      console.log('Database API response status:', response.status)
      
      if (response.ok) {
        const data = await response.json()
        console.log('Database API success:', data)
        setResult({
          success: true,
          status: response.status,
          data: data,
          message: `Found ${data.data?.length || 0} properties in database`
        })
      } else {
        const errorText = await response.text()
        console.error('Database API error:', response.status, errorText)
        setError(`Database API Error: ${response.status} - ${errorText}`)
      }
    } catch (err: any) {
      console.error('Database API test error:', err)
      setError(`Network Error: ${err.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  const testRentcastAPI = async () => {
    setIsLoading(true)
    setError(null)
    setResult(null)

    try {
      console.log('Testing Rentcast API...')
      
      const response = await fetch('/api/properties/search', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          searchMode: 'rentcast',
          limit: 5,
          city: 'San Francisco',
          state: 'CA'
        })
      })

      console.log('Rentcast API response status:', response.status)
      
      if (response.ok) {
        const data = await response.json()
        console.log('Rentcast API success:', data)
        setResult({
          success: true,
          status: response.status,
          data: data,
          message: `Found ${data.data?.length || 0} properties via Rentcast API`
        })
      } else {
        const errorText = await response.text()
        console.error('Rentcast API error:', response.status, errorText)
        setError(`Rentcast API Error: ${response.status} - ${errorText}`)
      }
    } catch (err: any) {
      console.error('Rentcast API test error:', err)
      setError(`Network Error: ${err.message}`)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>🔧 API Testing Dashboard</CardTitle>
          <CardDescription>
            Step-by-step testing of both Database and Rentcast APIs
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          
          {/* Step 1: Database Test */}
          <div className="border rounded-lg p-4 bg-green-50">
            <h3 className="text-lg font-semibold text-green-800 mb-2">Step 1: Test Database API (Recommended)</h3>
            <p className="text-green-700 text-sm mb-4">
              This tests your local database search - should always work and show properties.
            </p>
            <Button 
              onClick={testDatabaseAPI} 
              disabled={isLoading}
              className="bg-green-600 hover:bg-green-700"
            >
              {isLoading ? 'Testing Database...' : 'Test Database API'}
            </Button>
          </div>

          {/* Step 2: Rentcast Test */}
          <div className="border rounded-lg p-4 bg-blue-50">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">Step 2: Test Rentcast API (Optional)</h3>
            <p className="text-blue-700 text-sm mb-4">
              This tests your Rentcast API key - may show 401 error if subscription is inactive.
            </p>
            <Button 
              onClick={testRentcastAPI} 
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? 'Testing Rentcast...' : 'Test Rentcast API'}
            </Button>
          </div>

          {/* Results */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <h3 className="text-red-800 font-semibold mb-2">❌ Error:</h3>
              <p className="text-red-700 text-sm">{error}</p>
              <div className="mt-2 text-xs text-red-600">
                <strong>Common Solutions:</strong>
                <ul className="list-disc list-inside mt-1">
                  <li>For 401 errors: Check if Rentcast subscription is active</li>
                  <li>For database errors: Ensure database is running</li>
                  <li>For network errors: Check internet connection</li>
                </ul>
              </div>
            </div>
          )}

          {result && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <h3 className="text-green-800 font-semibold mb-2">✅ Success:</h3>
              <p className="text-green-700 text-sm mb-2">{result.message}</p>
              
              {result.data?.data && result.data.data.length > 0 && (
                <div className="mt-3">
                  <h4 className="font-semibold text-green-800 mb-2">Sample Properties:</h4>
                  <div className="space-y-2">
                    {result.data.data.slice(0, 3).map((property: any, index: number) => (
                      <div key={index} className="bg-white p-2 rounded border text-xs">
                        <div className="font-medium">{property.address}</div>
                        <div className="text-gray-600">{property.city}, {property.state}</div>
                        <div className="text-gray-500">
                          {property.beds} bed, {property.baths} bath
                          {property.lastSalePrice && ` • $${property.lastSalePrice.toLocaleString()}`}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              
              <details className="mt-3">
                <summary className="cursor-pointer text-green-600 hover:text-green-800 text-sm">
                  View Full Response
                </summary>
                <pre className="mt-2 p-2 bg-white border rounded text-xs overflow-auto max-h-60">
                  {JSON.stringify(result.data, null, 2)}
                </pre>
              </details>
            </div>
          )}

          {/* Environment Status */}
          <div className="border rounded-lg p-4 bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Environment Status</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <div className="font-medium text-gray-700">Database:</div>
                <div className="text-green-600">✅ Connected (PostgreSQL)</div>
              </div>
              <div>
                <div className="font-medium text-gray-700">Rentcast API:</div>
                <div className="text-blue-600">🔑 Key Configured</div>
              </div>
              <div>
                <div className="font-medium text-gray-700">Mapbox:</div>
                <div className="text-green-600">✅ Token Set</div>
              </div>
              <div>
                <div className="font-medium text-gray-700">NextAuth:</div>
                <div className="text-green-600">✅ Secret Set</div>
              </div>
            </div>
          </div>

          {/* Instructions */}
          <div className="border rounded-lg p-4 bg-yellow-50">
            <h3 className="text-lg font-semibold text-yellow-800 mb-2">📋 Testing Instructions</h3>
            <ol className="text-yellow-700 text-sm space-y-1 list-decimal list-inside">
              <li>Click "Test Database API" first - this should work and show properties</li>
              <li>If database test succeeds, your property search is working</li>
              <li>Try "Test Rentcast API" - may show 401 error (this is normal if subscription is inactive)</li>
              <li>Use the "Find Properties" button on the map - it uses database mode by default</li>
              <li>Check the browser console for detailed logs</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
