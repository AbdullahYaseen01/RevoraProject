"use client"

import { useState } from "react"

interface SearchFilters {
  // Location filters
  city?: string
  state?: string
  zipCode?: string
  address?: string
  
  // Property details
  bedsMin?: number
  bedsMax?: number
  bathsMin?: number
  bathsMax?: number
  squareFeetMin?: number
  squareFeetMax?: number
  
  // Price filters
  priceMin?: number
  priceMax?: number
  
  // Property characteristics
  propertyType?: string
  status?: string
  yearBuiltMin?: number
  yearBuiltMax?: number
  lotSizeMin?: number
  lotSizeMax?: number
  
  // Search options
  searchMode?: "rentcast" | "database"
  sortBy?: string
  sortOrder?: "asc" | "desc"
  page?: number
  limit?: number
}

interface PropertySearchFiltersProps {
  filters?: SearchFilters
  onFiltersChange: (filters: SearchFilters) => void
  onSearch: () => void
  loading?: boolean
}

const PROPERTY_TYPES = [
  "Single Family",
  "Condo",
  "Townhouse",
  "Multi-Family",
  "Apartment",
  "Commercial",
  "Land",
  "Mobile Home"
]

const PROPERTY_STATUS = [
  "For Sale",
  "Sold",
  "Pending",
  "Off Market",
  "Active"
]

export default function PropertySearchFilters({ 
  filters = {}, 
  onFiltersChange, 
  onSearch, 
  loading = false 
}: PropertySearchFiltersProps) {
  const [showAdvanced, setShowAdvanced] = useState(false)

  const updateFilter = (key: keyof SearchFilters, value: any) => {
    onFiltersChange({ ...filters, [key]: value })
  }

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 p-8 mb-8">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Property Search</h2>
          <p className="text-gray-600">Find your perfect property with our advanced search filters</p>
        </div>
        <div className="flex justify-end">
          <button
            onClick={() => setShowAdvanced(!showAdvanced)}
            className="px-8 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 shadow-md hover:shadow-lg"
          >
            {showAdvanced ? "Hide Advanced Filters" : "Show Advanced Filters"}
          </button>
        </div>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); onSearch() }} className="space-y-8">
        {/* Location Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">Location</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Address
              </label>
              <input
                type="text"
                value={filters.address || ""}
                onChange={(e) => updateFilter("address", e.target.value)}
                placeholder="123 Main St"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                City
              </label>
              <input
                type="text"
                value={filters.city || ""}
                onChange={(e) => updateFilter("city", e.target.value)}
                placeholder="San Francisco"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                State
              </label>
              <input
                type="text"
                value={filters.state || ""}
                onChange={(e) => updateFilter("state", e.target.value)}
                placeholder="CA"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                ZIP Code
              </label>
              <input
                type="text"
                value={filters.zipCode || ""}
                onChange={(e) => updateFilter("zipCode", e.target.value)}
                placeholder="94102"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
              />
            </div>
          </div>
        </div>

        {/* Property Details Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">Property Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Min Bedrooms
              </label>
              <select
                value={filters.bedsMin || ""}
                onChange={(e) => updateFilter("bedsMin", e.target.value ? Number(e.target.value) : undefined)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
              >
                <option value="">Any</option>
                {[1, 2, 3, 4, 5, 6].map(num => (
                  <option key={num} value={num}>{num}+</option>
                ))}
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Max Bedrooms
              </label>
              <select
                value={filters.bedsMax || ""}
                onChange={(e) => updateFilter("bedsMax", e.target.value ? Number(e.target.value) : undefined)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
              >
                <option value="">Any</option>
                {[1, 2, 3, 4, 5, 6].map(num => (
                  <option key={num} value={num}>{num}</option>
                ))}
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Min Bathrooms
              </label>
              <select
                value={filters.bathsMin || ""}
                onChange={(e) => updateFilter("bathsMin", e.target.value ? Number(e.target.value) : undefined)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
              >
                <option value="">Any</option>
                {[1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5].map(num => (
                  <option key={num} value={num}>{num}+</option>
                ))}
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Max Bathrooms
              </label>
              <select
                value={filters.bathsMax || ""}
                onChange={(e) => updateFilter("bathsMax", e.target.value ? Number(e.target.value) : undefined)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
              >
                <option value="">Any</option>
                {[1, 1.5, 2, 2.5, 3, 3.5, 4, 4.5, 5].map(num => (
                  <option key={num} value={num}>{num}</option>
                ))}
              </select>
            </div>
          </div>
        </div>

        {/* Price Range Section */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-200 pb-2">Price Range</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Min Price
              </label>
              <input
                type="number"
                value={filters.priceMin || ""}
                onChange={(e) => updateFilter("priceMin", e.target.value ? Number(e.target.value) : undefined)}
                placeholder="100000"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
              />
            </div>
            
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                Max Price
              </label>
              <input
                type="number"
                value={filters.priceMax || ""}
                onChange={(e) => updateFilter("priceMax", e.target.value ? Number(e.target.value) : undefined)}
                placeholder="1000000"
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-gray-900 bg-white"
              />
            </div>
          </div>
        </div>

        {/* Advanced Filters */}
        {showAdvanced && (
          <div className="border-t pt-4 space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Advanced Filters</h3>
            
            {/* Square Footage */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Min Square Feet
                </label>
                <input
                  type="number"
                  value={filters.squareFeetMin || ""}
                  onChange={(e) => updateFilter("squareFeetMin", e.target.value ? Number(e.target.value) : undefined)}
                  placeholder="1000"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Max Square Feet
                </label>
                <input
                  type="number"
                  value={filters.squareFeetMax || ""}
                  onChange={(e) => updateFilter("squareFeetMax", e.target.value ? Number(e.target.value) : undefined)}
                  placeholder="5000"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Year Built */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Min Year Built
                </label>
                <input
                  type="number"
                  value={filters.yearBuiltMin || ""}
                  onChange={(e) => updateFilter("yearBuiltMin", e.target.value ? Number(e.target.value) : undefined)}
                  placeholder="1950"
                  min="1800"
                  max={new Date().getFullYear()}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Max Year Built
                </label>
                <input
                  type="number"
                  value={filters.yearBuiltMax || ""}
                  onChange={(e) => updateFilter("yearBuiltMax", e.target.value ? Number(e.target.value) : undefined)}
                  placeholder="2024"
                  min="1800"
                  max={new Date().getFullYear()}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Lot Size */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Min Lot Size (sq ft)
                </label>
                <input
                  type="number"
                  value={filters.lotSizeMin || ""}
                  onChange={(e) => updateFilter("lotSizeMin", e.target.value ? Number(e.target.value) : undefined)}
                  placeholder="5000"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Max Lot Size (sq ft)
                </label>
                <input
                  type="number"
                  value={filters.lotSizeMax || ""}
                  onChange={(e) => updateFilter("lotSizeMax", e.target.value ? Number(e.target.value) : undefined)}
                  placeholder="50000"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Property Type and Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Property Type
                </label>
                <select
                  value={filters.propertyType || ""}
                  onChange={(e) => updateFilter("propertyType", e.target.value || undefined)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Any Type</option>
                  {PROPERTY_TYPES.map(type => (
                    <option key={type} value={type}>{type}</option>
                  ))}
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Property Status
                </label>
                <select
                  value={filters.status || ""}
                  onChange={(e) => updateFilter("status", e.target.value || undefined)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Any Status</option>
                  {PROPERTY_STATUS.map(status => (
                    <option key={status} value={status}>{status}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Search Options */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Search Mode
                </label>
                <select
                  value={filters.searchMode || "rentcast"}
                  onChange={(e) => updateFilter("searchMode", e.target.value as "rentcast" | "database")}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="rentcast">External API (Rentcast)</option>
                  <option value="database">Local Database</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Results per Page
                </label>
                <select
                  value={filters.limit || 20}
                  onChange={(e) => updateFilter("limit", Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                  <option value={50}>50</option>
                  <option value={100}>100</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Search Button */}
        <div className="flex justify-center pt-6 border-t border-gray-200">
          <button
            type="submit"
            disabled={loading}
            className="px-12 py-4 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl"
          >
            {loading ? (
              <span className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                Searching...
              </span>
            ) : (
              "Search Properties"
            )}
          </button>
        </div>
      </form>
    </div>
  )
}
