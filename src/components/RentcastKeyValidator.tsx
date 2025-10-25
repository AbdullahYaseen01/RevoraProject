"use client"

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'

export default function RentcastKeyValidator() {
  const [isChecking, setIsChecking] = useState(false)
  const [result, setResult] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

  const checkAPIKeyStatus = async () => {
    setIsChecking(true)
    setError(null)
    setResult(null)

    try {
      console.log('🔍 Checking Rentcast API Key Status...')
      
      // Test with a simple API call to check key validity
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

      console.log('📊 API Response Status:', response.status)
      
      if (response.status === 401) {
        setResult({
          status: 'inactive',
          message: 'API Key is valid but subscription is INACTIVE',
          details: 'Your API key is recognized by Rentcast but your subscription plan is not active.',
          solution: 'You need to activate your Rentcast subscription to use the API.'
        })
      } else if (response.status === 403) {
        setResult({
          status: 'forbidden',
          message: 'API Key is INVALID or EXPIRED',
          details: 'The API key is not recognized by Rentcast.',
          solution: 'Check your API key and ensure it\'s correct.'
        })
      } else if (response.ok) {
        const data = await response.json()
        setResult({
          status: 'active',
          message: 'API Key is ACTIVE and working!',
          details: `Found ${data.data?.length || 0} properties successfully.`,
          solution: 'Your Rentcast API is working perfectly!'
        })
      } else {
        setResult({
          status: 'error',
          message: `API Error: ${response.status}`,
          details: 'Unexpected error occurred.',
          solution: 'Check your internet connection and try again.'
        })
      }
    } catch (err: any) {
      console.error('❌ API Key Check Error:', err)
      setError(`Network Error: ${err.message}`)
    } finally {
      setIsChecking(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-50 border-green-200'
      case 'inactive': return 'text-yellow-600 bg-yellow-50 border-yellow-200'
      case 'forbidden': return 'text-red-600 bg-red-50 border-red-200'
      default: return 'text-gray-600 bg-gray-50 border-gray-200'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return '✅'
      case 'inactive': return '⚠️'
      case 'forbidden': return '❌'
      default: return '❓'
    }
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>🔑 Rentcast API Key Status Checker</CardTitle>
          <CardDescription>
            Check if your Rentcast API key is active and working properly
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          
          {/* Check Button */}
          <div className="text-center">
            <Button 
              onClick={checkAPIKeyStatus} 
              disabled={isChecking}
              className="bg-blue-600 hover:bg-blue-700 px-8 py-3 text-lg"
            >
              {isChecking ? 'Checking API Key...' : 'Check API Key Status'}
            </Button>
          </div>

          {/* Current API Key Info */}
          <div className="border rounded-lg p-4 bg-gray-50">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Current API Key</h3>
            <div className="space-y-2 text-sm">
              <div><strong>Key:</strong> 42a7df68a0ec41338161708c2aab02e2</div>
              <div><strong>Base URL:</strong> https://api.rentcast.io/v1</div>
              <div><strong>Status:</strong> {isChecking ? 'Checking...' : 'Not checked yet'}</div>
            </div>
          </div>

          {/* Results */}
          {error && (
            <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
              <h3 className="text-red-800 font-semibold mb-2">❌ Error:</h3>
              <p className="text-red-700 text-sm">{error}</p>
            </div>
          )}

          {result && (
            <div className={`p-4 border rounded-lg ${getStatusColor(result.status)}`}>
              <h3 className="font-semibold mb-2">
                {getStatusIcon(result.status)} {result.message}
              </h3>
              <p className="text-sm mb-2">{result.details}</p>
              <div className="mt-3 p-3 bg-white rounded border">
                <h4 className="font-semibold mb-1">💡 Solution:</h4>
                <p className="text-sm">{result.solution}</p>
              </div>
            </div>
          )}

          {/* Subscription Activation Guide */}
          {result?.status === 'inactive' && (
            <div className="border rounded-lg p-4 bg-blue-50">
              <h3 className="text-lg font-semibold text-blue-800 mb-2">🚀 How to Activate Your Rentcast Subscription</h3>
              <ol className="text-blue-700 text-sm space-y-2 list-decimal list-inside">
                <li>Visit <a href="https://rentcast.io" target="_blank" className="underline font-medium">rentcast.io</a></li>
                <li>Log in to your account</li>
                <li>Go to your dashboard or billing section</li>
                <li>Activate or upgrade your subscription plan</li>
                <li>Ensure your payment method is valid</li>
                <li>Wait a few minutes for activation to take effect</li>
                <li>Test the API again using this tool</li>
              </ol>
            </div>
          )}

          {/* Alternative Solutions */}
          <div className="border rounded-lg p-4 bg-green-50">
            <h3 className="text-lg font-semibold text-green-800 mb-2">✅ Alternative: Use Database Mode</h3>
            <p className="text-green-700 text-sm mb-2">
              While you activate your Rentcast subscription, you can use the database search mode which is already working:
            </p>
            <ul className="text-green-700 text-sm space-y-1 list-disc list-inside">
              <li>Database search is already active and working</li>
              <li>Properties are stored locally and searchable</li>
              <li>No subscription required for database mode</li>
              <li>All map features work with database search</li>
            </ul>
          </div>

          {/* Test Database Mode */}
          <div className="text-center">
            <Button 
              onClick={() => window.open('/properties', '_blank')}
              className="bg-green-600 hover:bg-green-700"
            >
              Test Database Mode (Working Now)
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
