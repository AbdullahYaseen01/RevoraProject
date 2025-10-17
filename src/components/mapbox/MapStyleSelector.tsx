"use client"

import { useState } from 'react'
import { MAP_STYLES, MAP_THEMES, MapStyle, MapTheme, getStyleById, getThemeById } from '@/lib/mapbox-styles'
import { MAPBOX_CONFIG } from '@/lib/env'

export interface MapStyleSelectorProps {
  currentStyle: string
  currentTheme: string
  onStyleChange: (style: string) => void
  onThemeChange: (theme: string) => void
  className?: string
}

export default function MapStyleSelector({
  currentStyle,
  currentTheme,
  onStyleChange,
  onThemeChange,
  className = ''
}: MapStyleSelectorProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [activeTab, setActiveTab] = useState<'styles' | 'themes'>('styles')

  const selectedStyle = getStyleById(currentStyle)
  const selectedTheme = getThemeById(currentTheme)

  const getStylePreviewUrl = (style: MapStyle) => {
    if (!MAPBOX_CONFIG.accessToken) return ''
    const baseUrl = style.preview || `https://api.mapbox.com/styles/v1/mapbox/${style.id}/static/-122.4194,37.7749,10/150x100@2x`
    return `${baseUrl}?access_token=${MAPBOX_CONFIG.accessToken}`
  }

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-2 px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <span className="text-sm font-medium text-gray-700">
          {activeTab === 'styles' ? selectedStyle?.name : selectedTheme?.name}
        </span>
        <span className="text-gray-400">▼</span>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-80 bg-white border border-gray-300 rounded-md shadow-lg z-50">
          {/* Tabs */}
          <div className="flex border-b border-gray-200">
            <button
              onClick={() => setActiveTab('styles')}
              className={`flex-1 px-4 py-2 text-sm font-medium ${
                activeTab === 'styles'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Map Styles
            </button>
            <button
              onClick={() => setActiveTab('themes')}
              className={`flex-1 px-4 py-2 text-sm font-medium ${
                activeTab === 'themes'
                  ? 'text-blue-600 border-b-2 border-blue-600'
                  : 'text-gray-500 hover:text-gray-700'
              }`}
            >
              Themes
            </button>
          </div>

          {/* Content */}
          <div className="max-h-96 overflow-y-auto">
            {activeTab === 'styles' ? (
              <div className="p-4 space-y-3">
                {MAP_STYLES.map((style) => (
                  <div
                    key={style.id}
                    onClick={() => {
                      onStyleChange(style.id)
                      setIsOpen(false)
                    }}
                    className={`flex items-center space-x-3 p-3 rounded-md cursor-pointer transition-colors ${
                      currentStyle === style.id
                        ? 'bg-blue-50 border border-blue-200'
                        : 'hover:bg-gray-50 border border-transparent'
                    }`}
                  >
                    <div className="flex-shrink-0">
                      {MAPBOX_CONFIG.accessToken ? (
                        <img
                          src={getStylePreviewUrl(style)}
                          alt={style.name}
                          className="w-16 h-10 rounded border border-gray-200 object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none'
                          }}
                        />
                      ) : (
                        <div className="w-16 h-10 bg-gray-200 rounded border border-gray-200 flex items-center justify-center">
                          <span className="text-xs text-gray-500">No Token</span>
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-900">
                        {style.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {style.description}
                      </div>
                      <div className="text-xs text-gray-400 capitalize">
                        {style.category}
                      </div>
                    </div>
                    {currentStyle === style.id && (
                      <div className="flex-shrink-0">
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 space-y-3">
                {MAP_THEMES.map((theme) => (
                  <div
                    key={theme.id}
                    onClick={() => {
                      onThemeChange(theme.id)
                      setIsOpen(false)
                    }}
                    className={`flex items-center space-x-3 p-3 rounded-md cursor-pointer transition-colors ${
                      currentTheme === theme.id
                        ? 'bg-blue-50 border border-blue-200'
                        : 'hover:bg-gray-50 border border-transparent'
                    }`}
                  >
                    <div className="flex-shrink-0">
                      <div className="w-16 h-10 rounded border border-gray-200 flex">
                        <div
                          className="flex-1 rounded-l"
                          style={{ backgroundColor: theme.colors.primary }}
                        ></div>
                        <div
                          className="flex-1 rounded-r"
                          style={{ backgroundColor: theme.colors.secondary }}
                        ></div>
                      </div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium text-gray-900">
                        {theme.name}
                      </div>
                      <div className="text-xs text-gray-500">
                        {theme.description}
                      </div>
                    </div>
                    {currentTheme === theme.id && (
                      <div className="flex-shrink-0">
                        <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Overlay to close dropdown */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}

// Compact style selector for mobile
export function CompactMapStyleSelector({
  currentStyle,
  onStyleChange,
  className = ''
}: {
  currentStyle: string
  onStyleChange: (style: string) => void
  className?: string
}) {
  const [isOpen, setIsOpen] = useState(false)
  const selectedStyle = getStyleById(currentStyle)

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center space-x-1 px-2 py-1 bg-white border border-gray-300 rounded text-xs hover:bg-gray-50"
      >
        <span>🗺️</span>
        <span>{selectedStyle?.name}</span>
      </button>

      {isOpen && (
        <div className="absolute top-full left-0 mt-1 w-48 bg-white border border-gray-300 rounded-md shadow-lg z-50">
          <div className="max-h-64 overflow-y-auto">
            {MAP_STYLES.map((style) => (
              <button
                key={style.id}
                onClick={() => {
                  onStyleChange(style.id)
                  setIsOpen(false)
                }}
                className={`w-full text-left px-3 py-2 text-sm hover:bg-gray-50 ${
                  currentStyle === style.id ? 'bg-blue-50 text-blue-600' : 'text-gray-700'
                }`}
              >
                {style.name}
              </button>
            ))}
          </div>
        </div>
      )}

      {isOpen && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setIsOpen(false)}
        />
      )}
    </div>
  )
}
