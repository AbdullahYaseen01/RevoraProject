"use client"

import { useState, useEffect } from "react"
import { useSession } from "next-auth/react"

interface SavedSearch {
  id: string
  searchParams: any
  createdAt: string
}

interface SavedSearchesProps {
  onLoadSearch: (searchParams: any) => void
}

export default function SavedSearches({ onLoadSearch }: SavedSearchesProps) {
  const { data: session } = useSession()
  const [savedSearches, setSavedSearches] = useState<SavedSearch[]>([])
  const [loading, setLoading] = useState(false)
  const [showSavedSearches, setShowSavedSearches] = useState(false)

  useEffect(() => {
    if (session?.user) {
      fetchSavedSearches()
    }
  }, [session])

  const fetchSavedSearches = async () => {
    if (!session?.user) return
    
    setLoading(true)
    try {
      const res = await fetch('/api/properties/saved-searches')
      if (res.ok) {
        const data = await res.json()
        setSavedSearches(data.searches || [])
      }
    } catch (error) {
      console.error('Failed to fetch saved searches:', error)
    } finally {
      setLoading(false)
    }
  }

  const deleteSavedSearch = async (searchId: string) => {
    try {
      const res = await fetch(`/api/properties/saved-searches/${searchId}`, {
        method: 'DELETE'
      })
      if (res.ok) {
        setSavedSearches(prev => prev.filter(s => s.id !== searchId))
      }
    } catch (error) {
      console.error('Failed to delete saved search:', error)
    }
  }

  const formatSearchParams = (params: any) => {
    const parts = []
    if (params.city) parts.push(`City: ${params.city}`)
    if (params.state) parts.push(`State: ${params.state}`)
    if (params.zipCode) parts.push(`ZIP: ${params.zipCode}`)
    if (params.bedsMin) parts.push(`Min Beds: ${params.bedsMin}`)
    if (params.bedsMax) parts.push(`Max Beds: ${params.bedsMax}`)
    if (params.priceMin) parts.push(`Min Price: $${params.priceMin.toLocaleString()}`)
    if (params.priceMax) parts.push(`Max Price: $${params.priceMax.toLocaleString()}`)
    if (params.propertyType) parts.push(`Type: ${params.propertyType}`)
    
    return parts.length > 0 ? parts.join(', ') : 'No filters'
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  if (!session?.user) {
    return null
  }

  return (
    <div className="mb-6">
      <button
        onClick={() => setShowSavedSearches(!showSavedSearches)}
        className="flex items-center space-x-2 px-4 py-2 text-sm border border-gray-300 rounded-md hover:bg-gray-50"
      >
        <span>📋</span>
        <span>Saved Searches ({savedSearches.length})</span>
        <span className={`transform transition-transform ${showSavedSearches ? 'rotate-180' : ''}`}>
          ▼
        </span>
      </button>

      {showSavedSearches && (
        <div className="mt-4 bg-white rounded-lg shadow-md border">
          <div className="p-4 border-b">
            <h3 className="text-lg font-medium text-gray-900">Your Saved Searches</h3>
            <p className="text-sm text-gray-600">Click on a search to load it, or delete searches you no longer need.</p>
          </div>
          
          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center text-gray-500">
                Loading saved searches...
              </div>
            ) : savedSearches.length === 0 ? (
              <div className="p-8 text-center text-gray-500">
                <div className="text-4xl mb-2">🔍</div>
                <p>No saved searches yet</p>
                <p className="text-sm">Your search history will appear here after you perform searches.</p>
              </div>
            ) : (
              <div className="divide-y">
                {savedSearches.map((search) => (
                  <div key={search.id} className="p-4 hover:bg-gray-50">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-2">
                          <button
                            onClick={() => onLoadSearch(search.searchParams)}
                            className="text-blue-600 hover:text-blue-800 font-medium text-sm"
                          >
                            Load Search
                          </button>
                          <span className="text-gray-400">•</span>
                          <span className="text-xs text-gray-500">
                            {formatDate(search.createdAt)}
                          </span>
                        </div>
                        <p className="text-sm text-gray-700 line-clamp-2">
                          {formatSearchParams(search.searchParams)}
                        </p>
                      </div>
                      <button
                        onClick={() => deleteSavedSearch(search.id)}
                        className="ml-4 text-red-600 hover:text-red-800 text-sm"
                        title="Delete saved search"
                      >
                        🗑️
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
