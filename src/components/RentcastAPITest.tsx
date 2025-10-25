"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function RentcastAPITest() {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

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
          limit: 5,
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

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Rentcast API Test</CardTitle>
          <CardDescription>
            Test both Rentcast API and Database search to diagnose the 401 error
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex space-x-4">
            <Button 
              onClick={testRentcastAPI} 
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isLoading ? 'Testing...' : 'Test Rentcast API'}
            </Button>
            
            <Button 
              onClick={testDatabaseAPI} 
              disabled={isLoading}
              variant="outline"
            >
              {isLoading ? 'Testing...' : 'Test Database API'}
            </Button>
          </div>

          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <h3 className="text-red-800 font-semibold mb-2">Error:</h3>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {result && (
            <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
              <h3 className="text-green-800 font-semibold mb-2">Result:</h3>
              <p className="text-green-700 text-sm mb-2">{result.message}</p>
              <details className="text-xs">
                <summary className="cursor-pointer text-green-600 hover:text-green-800">
                  View Full Response
                </summary>
                <pre className="mt-2 p-2 bg-white border rounded text-xs overflow-auto">
                  {JSON.stringify(result.data, null, 2)}
                </pre>
              </details>
            </div>
          )}

          <div className="text-sm text-gray-600">
            <h4 className="font-semibold mb-2">Environment Check:</h4>
            <ul className="space-y-1">
              <li>• RENTCAST_API_KEY: {process.env.NEXT_PUBLIC_RENTCAST_API_KEY ? '✅ Set' : '❌ Missing'}</li>
              <li>• RENTCAST_BASE_URL: {process.env.NEXT_PUBLIC_RENTCAST_BASE_URL || 'Using default'}</li>
              <li>• Database: {process.env.DATABASE_URL ? '✅ Connected' : '❌ Not configured'}</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
