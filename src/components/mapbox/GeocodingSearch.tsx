"use client"

import { useState, useEffect, useRef } from 'react'
import { GeocodingResult } from '@/lib/mapbox'

export interface GeocodingSearchProps {
  onResultSelect: (result: GeocodingResult) => void
  placeholder?: string
  className?: string
  limit?: number
  proximity?: [number, number]
  types?: string[]
  country?: string
  language?: string
  disabled?: boolean
}

export default function GeocodingSearch({
  onResultSelect,
  placeholder = "Search for places...",
  className = "",
  limit = 5,
  proximity,
  types,
  country,
  language = "en",
  disabled = false
}: GeocodingSearchProps) {
  const [query, setQuery] = useState("")
  const [results, setResults] = useState<GeocodingResult[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const inputRef = useRef<HTMLInputElement>(null)
  const resultsRef = useRef<HTMLDivElement>(null)

  // Debounced search
  useEffect(() => {
    if (!query.trim() || query.length < 2) {
      setResults([])
      setIsOpen(false)
      return
    }

    const timeoutId = setTimeout(async () => {
      setIsLoading(true)
      try {
        const params = new URLSearchParams({
          q: query,
          limit: limit.toString(),
          language
        })

        if (proximity) {
          params.set('proximity', proximity.join(','))
        }
        if (types) {
          params.set('types', types.join(','))
        }
        if (country) {
          params.set('country', country)
        }

        const response = await fetch(`/api/mapbox/geocode?${params.toString()}`)
        const data = await response.json()

        if (response.ok) {
          setResults(data.features || [])
          setIsOpen(true)
          setSelectedIndex(-1)
        } else {
          console.error('Geocoding error:', data.error)
          setResults([])
        }
      } catch (error) {
        console.error('Geocoding request failed:', error)
        setResults([])
      } finally {
        setIsLoading(false)
      }
    }, 300)

    return () => clearTimeout(timeoutId)
  }, [query, limit, proximity, types, country, language])

  // Handle keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen || results.length === 0) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex(prev => 
          prev < results.length - 1 ? prev + 1 : 0
        )
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex(prev => 
          prev > 0 ? prev - 1 : results.length - 1
        )
        break
      case 'Enter':
        e.preventDefault()
        if (selectedIndex >= 0 && selectedIndex < results.length) {
          handleResultSelect(results[selectedIndex])
        }
        break
      case 'Escape':
        setIsOpen(false)
        setSelectedIndex(-1)
        break
    }
  }

  const handleResultSelect = (result: GeocodingResult) => {
    onResultSelect(result)
    setQuery(result.place_name)
    setIsOpen(false)
    setSelectedIndex(-1)
    inputRef.current?.blur()
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setQuery(e.target.value)
    if (!isOpen && e.target.value.length >= 2) {
      setIsOpen(true)
    }
  }

  const handleInputFocus = () => {
    if (results.length > 0) {
      setIsOpen(true)
    }
  }

  const handleInputBlur = (e: React.FocusEvent) => {
    // Delay closing to allow clicking on results
    setTimeout(() => {
      if (!resultsRef.current?.contains(document.activeElement)) {
        setIsOpen(false)
        setSelectedIndex(-1)
      }
    }, 150)
  }

  const getResultIcon = (result: GeocodingResult) => {
    const placeType = result.place_type[0]
    switch (placeType) {
      case 'poi':
        return '📍'
      case 'address':
        return '🏠'
      case 'neighborhood':
        return '🏘️'
      case 'locality':
        return '🏙️'
      case 'place':
        return '🏛️'
      case 'district':
        return '🏢'
      case 'region':
        return '🗺️'
      case 'country':
        return '🌍'
      default:
        return '📍'
    }
  }

  const formatResultText = (result: GeocodingResult) => {
    const parts = result.place_name.split(', ')
    if (parts.length > 2) {
      return `${parts[0]}, ${parts[parts.length - 1]}`
    }
    return result.place_name
  }

  return (
    <div className={`relative ${className}`}>
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={handleInputChange}
          onKeyDown={handleKeyDown}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:bg-gray-100 disabled:cursor-not-allowed"
        />
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          {isLoading ? (
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600"></div>
          ) : (
            <span className="text-gray-400">🔍</span>
          )}
        </div>
      </div>

      {/* Results dropdown */}
      {isOpen && results.length > 0 && (
        <div
          ref={resultsRef}
          className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-50 max-h-64 overflow-y-auto"
        >
          {results.map((result, index) => (
            <button
              key={result.id}
              onClick={() => handleResultSelect(result)}
              className={`w-full text-left px-4 py-3 hover:bg-gray-50 focus:bg-gray-50 focus:outline-none ${
                index === selectedIndex ? 'bg-blue-50 border-l-4 border-blue-500' : ''
              }`}
            >
              <div className="flex items-start space-x-3">
                <span className="text-lg flex-shrink-0 mt-0.5">
                  {getResultIcon(result)}
                </span>
                <div className="flex-1 min-w-0">
                  <div className="text-sm font-medium text-gray-900 truncate">
                    {result.text}
                  </div>
                  <div className="text-xs text-gray-500 truncate">
                    {formatResultText(result)}
                  </div>
                  {result.properties.category && (
                    <div className="text-xs text-gray-400 capitalize">
                      {result.properties.category}
                    </div>
                  )}
                </div>
              </div>
            </button>
          ))}
        </div>
      )}

      {/* No results message */}
      {isOpen && !isLoading && query.length >= 2 && results.length === 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-300 rounded-md shadow-lg z-50">
          <div className="px-4 py-3 text-sm text-gray-500 text-center">
            No places found for "{query}"
          </div>
        </div>
      )}
    </div>
  )
}

// Compact version for mobile
export function CompactGeocodingSearch({
  onResultSelect,
  placeholder = "Search...",
  className = "",
  ...props
}: GeocodingSearchProps) {
  return (
    <GeocodingSearch
      onResultSelect={onResultSelect}
      placeholder={placeholder}
      className={`${className} text-sm`}
      {...props}
    />
  )
}
