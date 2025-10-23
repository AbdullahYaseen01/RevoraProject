"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import DashboardNav from "@/components/dashboard/nav"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { 
  Users, 
  Search, 
  Filter, 
  MapPin, 
  DollarSign, 
  Calendar, 
  CheckCircle, 
  AlertCircle,
  Eye,
  MessageCircle,
  Star
} from "lucide-react"

interface CashBuyer {
  id: string
  name: string
  email: string
  phone: string
  location: string
  investmentRange: string
  propertyTypes: string[]
  verificationStatus: 'VERIFIED' | 'PENDING' | 'REJECTED'
  dealHistory: number
  lastActive: string
  rating: number
}

export default function CashBuyersPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [cashBuyers, setCashBuyers] = useState<CashBuyer[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('ALL')
  const [filterLocation, setFilterLocation] = useState('ALL')

  useEffect(() => {
    if (status === "loading") return

    if (!session) {
      router.push("/auth/signin")
      return
    }

    loadCashBuyers()
  }, [session, status, router])

  const loadCashBuyers = async () => {
    try {
      setIsLoading(true)
      const response = await fetch('/api/cash-buyers/search')
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }
      
      const data = await response.json()
      
      if (data.success) {
        setCashBuyers(data.data || [])
      } else {
        console.error('Failed to load cash buyers:', data.error || 'Unknown error')
        setCashBuyers([])
      }
    } catch (error) {
      console.error('Error loading cash buyers:', error)
      setCashBuyers([])
    } finally {
      setIsLoading(false)
    }
  }

  const handleContactBuyer = async (buyerId: string) => {
    try {
      const response = await fetch('/api/contact-cash-buyer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          buyerId,
          message: 'I have a property that might interest you.',
        }),
      })
      
      const data = await response.json()
      
      if (data.success) {
        alert('Message sent to cash buyer successfully!')
      } else {
        alert('Failed to send message')
      }
    } catch (error) {
      console.error('Error contacting buyer:', error)
      alert('Failed to send message')
    }
  }

  const filteredBuyers = cashBuyers.filter(buyer => {
    const matchesSearch = buyer.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         buyer.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         buyer.location.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = filterStatus === 'ALL' || buyer.verificationStatus === filterStatus
    const matchesLocation = filterLocation === 'ALL' || buyer.location.includes(filterLocation)
    
    return matchesSearch && matchesStatus && matchesLocation
  })

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'VERIFIED':
        return <Badge className="bg-green-100 text-green-800"><CheckCircle className="w-3 h-3 mr-1" />Verified</Badge>
      case 'PENDING':
        return <Badge className="bg-yellow-100 text-yellow-800"><AlertCircle className="w-3 h-3 mr-1" />Pending</Badge>
      case 'REJECTED':
        return <Badge className="bg-red-100 text-red-800"><AlertCircle className="w-3 h-3 mr-1" />Rejected</Badge>
      default:
        return <Badge variant="outline">{status}</Badge>
    }
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNav />

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Cash Buyers
            </h1>
            <p className="text-gray-600">
              Connect with verified cash buyers in your target markets.
            </p>
          </div>

          {/* Search and Filters */}
          <div className="mb-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Search className="w-5 h-5" />
                  Search & Filter
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Search
                    </label>
                    <input
                      type="text"
                      placeholder="Search by name, email, or location..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Verification Status
                    </label>
                    <select
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="ALL">All Status</option>
                      <option value="VERIFIED">Verified</option>
                      <option value="PENDING">Pending</option>
                      <option value="REJECTED">Rejected</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Location
                    </label>
                    <select
                      value={filterLocation}
                      onChange={(e) => setFilterLocation(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    >
                      <option value="ALL">All Locations</option>
                      <option value="Atlanta">Atlanta</option>
                      <option value="Dallas">Dallas</option>
                      <option value="Houston">Houston</option>
                      <option value="Phoenix">Phoenix</option>
                      <option value="Miami">Miami</option>
                    </select>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Cash Buyers Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {isLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <Card key={i}>
                  <CardContent className="p-6">
                    <div className="animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-1/2 mb-4"></div>
                      <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                      <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : filteredBuyers.length > 0 ? (
              filteredBuyers.map((buyer) => (
                <Card key={buyer.id} className="hover:shadow-lg transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div>
                        <CardTitle className="text-lg">{buyer.name}</CardTitle>
                        <CardDescription className="flex items-center gap-1 mt-1">
                          <MapPin className="w-4 h-4" />
                          {buyer.location}
                        </CardDescription>
                      </div>
                      {getStatusBadge(buyer.verificationStatus)}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <DollarSign className="w-4 h-4" />
                        <span>{buyer.investmentRange}</span>
                      </div>
                      
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span>{buyer.dealHistory} deals completed</span>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Star className="w-4 h-4" />
                        <span>{buyer.rating}/5 rating</span>
                      </div>

                      <div className="text-sm text-gray-600">
                        <strong>Property Types:</strong>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {buyer.propertyTypes.map((type, index) => (
                            <Badge key={index} variant="outline" className="text-xs">
                              {type}
                            </Badge>
                          ))}
                        </div>
                      </div>

                      <div className="flex gap-2 pt-2">
                        <Button
                          size="sm"
                          onClick={() => handleContactBuyer(buyer.id)}
                          className="flex-1"
                        >
                          <MessageCircle className="w-4 h-4 mr-2" />
                          Contact
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => router.push(`/cash-buyers/${buyer.id}`)}
                        >
                          <Eye className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            ) : (
              <div className="col-span-full">
                <Card>
                  <CardContent className="p-12 text-center">
                    <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No cash buyers found
                    </h3>
                    <p className="text-gray-600">
                      Try adjusting your search criteria or check back later.
                    </p>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>

          {/* Stats */}
          {!isLoading && cashBuyers.length > 0 && (
            <div className="mt-8">
              <Card>
                <CardHeader>
                  <CardTitle>Cash Buyer Statistics</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div className="text-center">
                      <div className="text-2xl font-bold text-indigo-600">
                        {cashBuyers.length}
                      </div>
                      <div className="text-sm text-gray-600">Total Buyers</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        {cashBuyers.filter(b => b.verificationStatus === 'VERIFIED').length}
                      </div>
                      <div className="text-sm text-gray-600">Verified</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {cashBuyers.reduce((sum, b) => sum + b.dealHistory, 0)}
                      </div>
                      <div className="text-sm text-gray-600">Total Deals</div>
                    </div>
                    <div className="text-center">
                      <div className="text-2xl font-bold text-purple-600">
                        {(cashBuyers.reduce((sum, b) => sum + b.rating, 0) / cashBuyers.length).toFixed(1)}
                      </div>
                      <div className="text-sm text-gray-600">Avg Rating</div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </main>
    </div>
  )
}
