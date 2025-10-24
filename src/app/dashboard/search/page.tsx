"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import DashboardNav from "@/components/dashboard/nav"
import PropertySearchFilters from "@/components/property-search/PropertySearchFilters"
import PropertySearchResults from "@/components/property-search/PropertySearchResults"
import QuickSearch from "@/components/property-search/QuickSearch"
import SavedSearches from "@/components/property-search/SavedSearches"
import ExportResults from "@/components/property-search/ExportResults"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Search, Filter, Download, Save } from "lucide-react"

export default function PropertySearchPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [searchParams, setSearchParams] = useState({})
  const [filters, setFilters] = useState({
    city: '',
    state: '',
    zipCode: '',
    address: '',
    bedsMin: undefined,
    bedsMax: undefined,
    bathsMin: undefined,
    bathsMax: undefined,
    squareFeetMin: undefined,
    squareFeetMax: undefined,
    priceMin: undefined,
    priceMax: undefined,
    propertyType: '',
    status: '',
    yearBuiltMin: undefined,
    yearBuiltMax: undefined,
    lotSizeMin: undefined,
    lotSizeMax: undefined,
    searchMode: 'rentcast' as const,
    sortBy: '',
    sortOrder: 'asc' as const,
    page: 1,
    limit: 20
  } as any)

  useEffect(() => {
    if (status === "loading") return

    if (!session) {
      router.push("/auth/signin")
      return
    }
  }, [session, status, router])

  const handleSearch = async (searchFilters?: any) => {
    setIsSearching(true)
    const params = searchFilters || filters
    setSearchParams(params)
    
    try {
      const response = await fetch('/api/properties/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(params),
      })
      
      if (!response.ok) {
        const errorText = await response.text()
        console.error(`API Error: ${response.status} ${response.statusText}`, errorText)
        setSearchResults([])
        return
      }

      const data = await response.json()
      
      if (data.success) {
        setSearchResults(data.data || [])
      } else {
        console.error('Search failed:', data.error)
        setSearchResults([])
      }
    } catch (error) {
      console.error('Search error:', error)
      setSearchResults([])
    } finally {
      setIsSearching(false)
    }
  }

  const handleSaveSearch = async (searchName: string) => {
    try {
      const response = await fetch('/api/properties/saved-searches', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: searchName,
          parameters: searchParams,
        }),
      })
      
      const data = await response.json()
      
      if (data.success) {
        alert('Search saved successfully!')
      } else {
        alert('Failed to save search')
      }
    } catch (error) {
      console.error('Save search error:', error)
      alert('Failed to save search')
    }
  }

  const handleExportResults = () => {
    if (searchResults.length === 0) {
      alert('No results to export')
      return
    }

    const csvContent = [
      ['Address', 'City', 'State', 'Price', 'Bedrooms', 'Bathrooms', 'Square Feet', 'Property Type'],
      ...searchResults.map((property: any) => [
        property.address || '',
        property.city || '',
        property.state || '',
        property.price || '',
        property.bedrooms || '',
        property.bathrooms || '',
        property.squareFeet || '',
        property.propertyType || '',
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `property-search-results-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
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
              Property Search
            </h1>
            <p className="text-gray-600">
              Find distressed properties and investment opportunities in your target markets.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Search Filters */}
            <div className="lg:col-span-1">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Filter className="w-5 h-5" />
                    Search Filters
                  </CardTitle>
                  <CardDescription>
                    Refine your property search
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <PropertySearchFilters 
                    filters={filters}
                    onFiltersChange={setFilters}
                    onSearch={() => handleSearch()}
                    loading={isSearching}
                  />
                </CardContent>
              </Card>

              {/* Quick Search */}
              <div className="mt-6">
                <QuickSearch />
              </div>

              {/* Saved Searches */}
              <div className="mt-6">
                <SavedSearches onLoadSearch={handleSearch} />
              </div>
            </div>

            {/* Search Results */}
            <div className="lg:col-span-3">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <Search className="w-5 h-5" />
                        Search Results
                      </CardTitle>
                      <CardDescription>
                        {searchResults.length > 0 
                          ? `${searchResults.length} properties found`
                          : 'Enter search criteria to find properties'
                        }
                      </CardDescription>
                    </div>
                    {searchResults.length > 0 && (
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const searchName = prompt('Enter a name for this search:')
                            if (searchName) handleSaveSearch(searchName)
                          }}
                        >
                          <Save className="w-4 h-4 mr-2" />
                          Save Search
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleExportResults}
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Export
                        </Button>
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent>
                  <PropertySearchResults 
                    results={searchResults} 
                    isLoading={isSearching}
                    onPageChange={(page) => {
                      // Handle page change if needed
                      console.log('Page changed to:', page)
                    }}
                    onSortChange={(sortBy, sortOrder) => {
                      // Handle sort change if needed
                      console.log('Sort changed:', sortBy, sortOrder)
                    }}
                  />
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
