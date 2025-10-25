"use client"
import { useState } from 'react'
import { useSession } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Loader2, Search, User, Phone, Mail, MapPin, DollarSign, AlertCircle, CheckCircle, XCircle } from 'lucide-react'

interface TraceResult {
  id: string
  name: string
  phone?: string
  email?: string
  address: string
  city: string
  state: string
  zipCode: string
  confidence: number
  source: string
  lastUpdated: string
}

export default function TracePage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [isSearching, setIsSearching] = useState(false)
  const [results, setResults] = useState<TraceResult[]>([])
  const [error, setError] = useState<string | null>(null)

  if (status === 'loading') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-blue-600" />
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  if (!session) {
    router.push('/auth/signin')
    return null
  }

  const handleSearch = async () => {
    if (!searchQuery.trim()) {
      setError('Please enter a property address or owner name to search')
      return
    }

    setIsSearching(true)
    setError(null)
    setResults([])

    try {
      // Simulate API call - replace with actual trace API
      await new Promise(resolve => setTimeout(resolve, 2000))
      
      // Mock results for demonstration
      const mockResults: TraceResult[] = [
        {
          id: '1',
          name: 'John Smith',
          phone: '(555) 123-4567',
          email: 'john.smith@email.com',
          address: '123 Main Street',
          city: 'Miami',
          state: 'FL',
          zipCode: '33125',
          confidence: 95,
          source: 'Public Records',
          lastUpdated: '2024-01-15'
        },
        {
          id: '2',
          name: 'Maria Garcia',
          phone: '(555) 987-6543',
          email: 'maria.garcia@email.com',
          address: '456 Oak Avenue',
          city: 'Miami',
          state: 'FL',
          zipCode: '33125',
          confidence: 87,
          source: 'Property Records',
          lastUpdated: '2024-01-10'
        }
      ]

      setResults(mockResults)
    } catch (err) {
      setError('Failed to perform skip trace. Please try again.')
    } finally {
      setIsSearching(false)
    }
  }

  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'bg-green-100 text-green-800'
    if (confidence >= 70) return 'bg-yellow-100 text-yellow-800'
    return 'bg-red-100 text-red-800'
  }

  const getConfidenceIcon = (confidence: number) => {
    if (confidence >= 90) return <CheckCircle className="w-4 h-4" />
    if (confidence >= 70) return <AlertCircle className="w-4 h-4" />
    return <XCircle className="w-4 h-4" />
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Skip Trace</h1>
          <p className="text-gray-600">Find property owners and their contact information</p>
        </div>

        {/* Search Section */}
        <Card className="mb-8 shadow-lg">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-gray-900">
              <Search className="w-5 h-5" />
              Search for Property Owner
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div>
                <input
                  type="text"
                  placeholder="Enter property address, owner name, or phone number..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-900 placeholder-gray-500"
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
              </div>
              <div className="flex items-center justify-between">
                <p className="text-sm text-gray-600">
                  Skip trace costs $0.10 per search. We only charge if contact info is found.
                </p>
                <Button 
                  onClick={handleSearch} 
                  disabled={isSearching}
                  className="bg-red-600 hover:bg-red-700 text-white"
                >
                  {isSearching ? (
                    <>
                      <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                      Searching...
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4 mr-2" />
                      Start Skip Trace
                    </>
                  )}
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Error Message */}
        {error && (
          <Card className="mb-8 border-red-200 bg-red-50">
            <CardContent className="pt-6">
              <div className="flex items-center gap-2 text-red-800">
                <XCircle className="w-5 h-5" />
                <span className="font-medium">{error}</span>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Results Section */}
        {results.length > 0 && (
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-gray-900">
                Skip Trace Results ({results.length} found)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                {results.map((result) => (
                  <div key={result.id} className="border border-gray-200 rounded-lg p-6 bg-white">
                    <div className="flex items-start justify-between mb-4">
                      <div>
                        <h3 className="text-xl font-semibold text-gray-900 mb-1">{result.name}</h3>
                        <div className="flex items-center gap-2 text-gray-600">
                          <MapPin className="w-4 h-4" />
                          <span>{result.address}, {result.city}, {result.state} {result.zipCode}</span>
                        </div>
                      </div>
                      <Badge className={`${getConfidenceColor(result.confidence)} flex items-center gap-1`}>
                        {getConfidenceIcon(result.confidence)}
                        {result.confidence}% Confidence
                      </Badge>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                      {result.phone && (
                        <div className="flex items-center gap-2 text-gray-700">
                          <Phone className="w-4 h-4 text-green-600" />
                          <span className="font-medium">{result.phone}</span>
                        </div>
                      )}
                      {result.email && (
                        <div className="flex items-center gap-2 text-gray-700">
                          <Mail className="w-4 h-4 text-blue-600" />
                          <span className="font-medium">{result.email}</span>
                        </div>
                      )}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                      <div className="text-sm text-gray-500">
                        <span className="font-medium">Source:</span> {result.source} • 
                        <span className="font-medium ml-1">Updated:</span> {result.lastUpdated}
                      </div>
                      <div className="flex gap-2">
                        <Button size="sm" variant="outline">
                          <Phone className="w-4 h-4 mr-1" />
                          Call
                        </Button>
                        <Button size="sm" variant="outline">
                          <Mail className="w-4 h-4 mr-1" />
                          Email
                        </Button>
                        <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                          <DollarSign className="w-4 h-4 mr-1" />
                          Contact
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        {/* Instructions */}
        <Card className="mt-8 bg-blue-50 border-blue-200">
          <CardHeader>
            <CardTitle className="text-blue-900">How Skip Trace Works</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 text-blue-800">
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                <p>Enter a property address, owner name, or phone number in the search box above.</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                <p>Our system searches multiple databases and public records to find current contact information.</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                <p>You'll receive detailed results with confidence scores and contact methods.</p>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-6 h-6 bg-blue-600 text-white rounded-full flex items-center justify-center text-sm font-bold">4</div>
                <p>Use the contact buttons to reach out to property owners directly.</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
