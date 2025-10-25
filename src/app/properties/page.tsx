"use client"
import { useMemo, useState } from "react"
import dynamic from "next/dynamic"
import PropertySearchFilters from "@/components/property-search/PropertySearchFilters"
import PropertySearchResults from "@/components/property-search/PropertySearchResults"
import SavedSearches from "@/components/property-search/SavedSearches"
import PropertyMapboxMap from "@/components/mapbox/PropertyMapboxMap"
import CustomMapboxMap from "@/components/mapbox/CustomMapboxMap"
import EnhancedMapboxMap from "@/components/mapbox/EnhancedMapboxMap"
import OptimizedMapboxMap from "@/components/mapbox/OptimizedMapboxMap"
import MapboxStatus from "@/components/mapbox/MapboxStatus"
import AnalyzeButton from "./AnalyzeButton"
import DrawControl from "./DrawControl"

type Property = {
  id: string
  address: string
  city: string
  state: string
  zipCode: string
  latitude?: number
  longitude?: number
  beds?: number
  baths?: number
  squareFeet?: number
  lotSize?: number
  yearBuilt?: number
  lastSalePrice?: number
  lastSaleDate?: string
  propertyType?: string
  status?: string
  imageUrl?: string
}

interface SearchFilters {
  city?: string
  state?: string
  zipCode?: string
  address?: string
  bedsMin?: number
  bedsMax?: number
  bathsMin?: number
  bathsMax?: number
  squareFeetMin?: number
  squareFeetMax?: number
  priceMin?: number
  priceMax?: number
  propertyType?: string
  status?: string
  yearBuiltMin?: number
  yearBuiltMax?: number
  lotSizeMin?: number
  lotSizeMax?: number
  searchMode?: "rentcast" | "database"
  sortBy?: string
  sortOrder?: "asc" | "desc"
  page?: number
  limit?: number
}

interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

// Remove Leaflet imports as we're using Mapbox now

export default function PropertiesPage() {
  const [filters, setFilters] = useState<SearchFilters>({
    searchMode: "rentcast",
    sortBy: "lastSaleDate",
    sortOrder: "desc",
    page: 1,
    limit: 20
  })
  const [loading, setLoading] = useState(false)
  const [properties, setProperties] = useState<Property[]>([])
  const [pagination, setPagination] = useState<Pagination>({
    page: 1,
    limit: 20,
    total: 0,
    totalPages: 0,
    hasNext: false,
    hasPrev: false
  })
  const [analyzing, setAnalyzing] = useState(false)
  const [boundaryMode, setBoundaryMode] = useState(false)
  const [polygon, setPolygon] = useState<[number, number][]>([])
  const [showMap, setShowMap] = useState(true)
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null)

  const performSearch = async (searchFilters: SearchFilters = filters) => {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      
      // Add all filters to params
      Object.entries(searchFilters).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          params.set(key, String(value))
        }
      })

      const res = await fetch(`/api/properties/search?${params.toString()}`)
      const data = await res.json()
      
      if (res.ok) {
        setProperties(data.results ?? [])
        setPagination(data.pagination ?? {
          page: 1,
          limit: 20,
          total: 0,
          totalPages: 0,
          hasNext: false,
          hasPrev: false
        })
      } else {
        console.error("Search failed:", data.error)
        setProperties([])
        setPagination({
          page: 1,
          limit: 20,
          total: 0,
          totalPages: 0,
          hasNext: false,
          hasPrev: false
        })
      }
    } catch (error) {
      console.error("Search error:", error)
      setProperties([])
      setPagination({
        page: 1,
        limit: 20,
        total: 0,
        totalPages: 0,
        hasNext: false,
        hasPrev: false
      })
    } finally {
      setLoading(false)
    }
  }

  const handleFiltersChange = (newFilters: SearchFilters) => {
    setFilters(newFilters)
  }

  const handleSearch = () => {
    const searchFilters = { ...filters, page: 1 }
    setFilters(searchFilters)
    performSearch(searchFilters)
  }

  const handlePageChange = (page: number) => {
    const searchFilters = { ...filters, page }
    setFilters(searchFilters)
    performSearch(searchFilters)
  }

  const handleSortChange = (sortBy: string, sortOrder: "asc" | "desc") => {
    const searchFilters = { ...filters, sortBy, sortOrder, page: 1 }
    setFilters(searchFilters)
    performSearch(searchFilters)
  }

  const handleLoadSavedSearch = (searchParams: any) => {
    setFilters(searchParams)
    performSearch(searchParams)
  }

  const handlePropertyClick = (property: Property) => {
    setSelectedProperty(property)
  }

  const handleMapClick = (coordinates: [number, number]) => {
    // Handle map click if needed
    console.log('Map clicked at:', coordinates)
  }

  const center = useMemo<[number, number]>(() => {
    const first = properties.find(p => p.latitude && p.longitude)
    return first ? [first.latitude as number, first.longitude as number] : [37.7749, -122.4194]
  }, [properties])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Property Search</h1>
          <p className="text-gray-600">Find properties that match your investment criteria</p>
        </div>

        {/* Mapbox Status Check */}
        <MapboxStatus />

        {/* Saved Searches */}
        <SavedSearches onLoadSearch={handleLoadSavedSearch} />

        {/* Search Filters */}
        <PropertySearchFilters
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onSearch={handleSearch}
          loading={loading}
        />

        {/* Map Toggle */}
        <div className="mb-6 flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowMap(!showMap)}
              className="px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 flex items-center space-x-2"
            >
              <span>{showMap ? "🗺️" : "📍"}</span>
              <span>{showMap ? "Hide Map" : "Show Map"}</span>
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Map Section */}
          {showMap && (
            <div className="lg:col-span-3">
              <div className="sticky top-8">
                <div className="h-[700px] w-full relative bg-white rounded-lg shadow-md overflow-hidden">
                  <OptimizedMapboxMap />
                </div>
              </div>
            </div>
          )}

          {/* Results Section */}
          <div className={showMap ? "lg:col-span-2" : "lg:col-span-5"}>
            <PropertySearchResults
              properties={properties}
              pagination={pagination}
              loading={loading}
              onPageChange={handlePageChange}
              onSortChange={handleSortChange}
              currentSort={{ sortBy: filters.sortBy || "lastSaleDate", sortOrder: filters.sortOrder || "desc" }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}


