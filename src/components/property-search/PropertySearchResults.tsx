"use client"

import { useState } from "react"
import ExportResults from "./ExportResults"

interface Property {
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

interface Pagination {
  page: number
  limit: number
  total: number
  totalPages: number
  hasNext: boolean
  hasPrev: boolean
}

interface PropertySearchResultsProps {
  properties: Property[]
  pagination: Pagination
  loading?: boolean
  onPageChange: (page: number) => void
  onSortChange: (sortBy: string, sortOrder: "asc" | "desc") => void
  currentSort?: { sortBy: string; sortOrder: "asc" | "desc" }
}

const SORT_OPTIONS = [
  { value: "lastSaleDate", label: "Sale Date" },
  { value: "price", label: "Price" },
  { value: "beds", label: "Bedrooms" },
  { value: "baths", label: "Bathrooms" },
  { value: "squareFeet", label: "Square Feet" },
  { value: "yearBuilt", label: "Year Built" },
  { value: "address", label: "Address" }
]

export default function PropertySearchResults({
  properties,
  pagination,
  loading = false,
  onPageChange,
  onSortChange,
  currentSort = { sortBy: "lastSaleDate", sortOrder: "desc" }
}: PropertySearchResultsProps) {
  const [viewMode, setViewMode] = useState<"list" | "grid">("list")

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const PropertyCard = ({ property }: { property: Property }) => (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      {property.imageUrl && (
        <div className="aspect-video bg-gray-200">
          <img
            src={property.imageUrl}
            alt={property.address}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).style.display = 'none'
            }}
          />
        </div>
      )}
      
      <div className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-semibold text-lg text-gray-900 line-clamp-1">
            {property.address}
          </h3>
          {property.lastSalePrice && (
            <span className="text-lg font-bold text-green-600">
              {formatCurrency(property.lastSalePrice)}
            </span>
          )}
        </div>
        
        <p className="text-gray-600 text-sm mb-3">
          {property.city}, {property.state} {property.zipCode}
        </p>
        
        <div className="grid grid-cols-2 gap-2 text-sm text-gray-700 mb-3">
          <div className="flex items-center">
            <span className="font-medium">Beds:</span>
            <span className="ml-1">{property.beds ?? "N/A"}</span>
          </div>
          <div className="flex items-center">
            <span className="font-medium">Baths:</span>
            <span className="ml-1">{property.baths ?? "N/A"}</span>
          </div>
          <div className="flex items-center">
            <span className="font-medium">Sq Ft:</span>
            <span className="ml-1">{property.squareFeet?.toLocaleString() ?? "N/A"}</span>
          </div>
          <div className="flex items-center">
            <span className="font-medium">Year:</span>
            <span className="ml-1">{property.yearBuilt ?? "N/A"}</span>
          </div>
        </div>
        
        {property.propertyType && (
          <div className="flex items-center justify-between text-sm">
            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
              {property.propertyType}
            </span>
            {property.lastSaleDate && (
              <span className="text-gray-500">
                Sold {formatDate(property.lastSaleDate)}
              </span>
            )}
          </div>
        )}
        
        <div className="mt-4">
          <a
            href={`/properties/${property.id}`}
            className="block w-full text-center bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors"
          >
            View Details
          </a>
        </div>
      </div>
    </div>
  )

  const PropertyListItem = ({ property }: { property: Property }) => (
    <div className="bg-white rounded-lg shadow-sm border p-4 hover:shadow-md transition-shadow">
      <div className="flex items-start space-x-4">
        {property.imageUrl && (
          <div className="w-24 h-24 bg-gray-200 rounded-md overflow-hidden flex-shrink-0">
            <img
              src={property.imageUrl}
              alt={property.address}
              className="w-full h-full object-cover"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none'
              }}
            />
          </div>
        )}
        
        <div className="flex-1 min-w-0">
          <div className="flex justify-between items-start mb-2">
            <h3 className="font-semibold text-lg text-gray-900 truncate">
              {property.address}
            </h3>
            {property.lastSalePrice && (
              <span className="text-lg font-bold text-green-600 ml-4">
                {formatCurrency(property.lastSalePrice)}
              </span>
            )}
          </div>
          
          <p className="text-gray-600 text-sm mb-3">
            {property.city}, {property.state} {property.zipCode}
          </p>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-700 mb-3">
            <div>
              <span className="font-medium">Bedrooms:</span> {property.beds ?? "N/A"}
            </div>
            <div>
              <span className="font-medium">Bathrooms:</span> {property.baths ?? "N/A"}
            </div>
            <div>
              <span className="font-medium">Square Feet:</span> {property.squareFeet?.toLocaleString() ?? "N/A"}
            </div>
            <div>
              <span className="font-medium">Year Built:</span> {property.yearBuilt ?? "N/A"}
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 text-sm">
              {property.propertyType && (
                <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                  {property.propertyType}
                </span>
              )}
              {property.lastSaleDate && (
                <span className="text-gray-500">
                  Sold {formatDate(property.lastSaleDate)}
                </span>
              )}
            </div>
            
            <a
              href={`/properties/${property.id}`}
              className="bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 transition-colors text-sm"
            >
              View Details
            </a>
          </div>
        </div>
      </div>
    </div>
  )

  if (loading) {
    return (
      <div className="space-y-4">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm border p-4 animate-pulse">
            <div className="flex items-start space-x-4">
              <div className="w-24 h-24 bg-gray-200 rounded-md"></div>
              <div className="flex-1 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                <div className="grid grid-cols-4 gap-4">
                  {[...Array(4)].map((_, j) => (
                    <div key={j} className="h-3 bg-gray-200 rounded"></div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (properties.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-gray-400 text-6xl mb-4">🏠</div>
        <h3 className="text-lg font-medium text-gray-900 mb-2">No properties found</h3>
        <p className="text-gray-600">Try adjusting your search criteria to find more results.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Results Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="flex items-center space-x-4">
          <h2 className="text-xl font-semibold text-gray-900">
            {pagination.total.toLocaleString()} Properties Found
          </h2>
          <span className="text-sm text-gray-500">
            Page {pagination.page} of {pagination.totalPages}
          </span>
        </div>
        
        <div className="flex items-center space-x-4">
          {/* Export Results */}
          <ExportResults properties={properties} loading={loading} />
          
          {/* Sort Options */}
          <div className="flex items-center space-x-2">
            <label className="text-sm font-medium text-gray-700">Sort by:</label>
            <select
              value={currentSort.sortBy}
              onChange={(e) => onSortChange(e.target.value, currentSort.sortOrder)}
              className="text-sm border border-gray-300 rounded-md px-2 py-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {SORT_OPTIONS.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <button
              onClick={() => onSortChange(currentSort.sortBy, currentSort.sortOrder === "asc" ? "desc" : "asc")}
              className="p-1 text-gray-400 hover:text-gray-600"
              title={`Sort ${currentSort.sortOrder === "asc" ? "Descending" : "Ascending"}`}
            >
              {currentSort.sortOrder === "asc" ? "↑" : "↓"}
            </button>
          </div>
          
          {/* View Mode Toggle */}
          <div className="flex border border-gray-300 rounded-md">
            <button
              onClick={() => setViewMode("list")}
              className={`px-3 py-1 text-sm ${
                viewMode === "list" 
                  ? "bg-blue-600 text-white" 
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              List
            </button>
            <button
              onClick={() => setViewMode("grid")}
              className={`px-3 py-1 text-sm ${
                viewMode === "grid" 
                  ? "bg-blue-600 text-white" 
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              Grid
            </button>
          </div>
        </div>
      </div>

      {/* Results */}
      <div className={
        viewMode === "grid" 
          ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          : "space-y-4"
      }>
        {properties.map(property => (
          viewMode === "grid" 
            ? <PropertyCard key={property.id} property={property} />
            : <PropertyListItem key={property.id} property={property} />
        ))}
      </div>

      {/* Pagination */}
      {pagination.totalPages > 1 && (
        <div className="flex items-center justify-between border-t pt-6">
          <div className="text-sm text-gray-700">
            Showing {((pagination.page - 1) * pagination.limit) + 1} to{' '}
            {Math.min(pagination.page * pagination.limit, pagination.total)} of{' '}
            {pagination.total.toLocaleString()} results
          </div>
          
          <div className="flex items-center space-x-2">
            <button
              onClick={() => onPageChange(pagination.page - 1)}
              disabled={!pagination.hasPrev}
              className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            <div className="flex space-x-1">
              {[...Array(Math.min(5, pagination.totalPages))].map((_, i) => {
                const pageNum = Math.max(1, pagination.page - 2) + i
                if (pageNum > pagination.totalPages) return null
                
                return (
                  <button
                    key={pageNum}
                    onClick={() => onPageChange(pageNum)}
                    className={`px-3 py-2 text-sm border rounded-md ${
                      pageNum === pagination.page
                        ? "bg-blue-600 text-white border-blue-600"
                        : "border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {pageNum}
                  </button>
                )
              })}
            </div>
            
            <button
              onClick={() => onPageChange(pagination.page + 1)}
              disabled={!pagination.hasNext}
              className="px-3 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
