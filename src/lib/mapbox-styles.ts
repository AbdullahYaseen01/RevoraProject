// Mapbox style configurations and custom themes

export interface MapStyle {
  id: string
  name: string
  style: string
  description: string
  category: 'default' | 'satellite' | 'terrain' | 'custom'
  preview?: string
}

export const MAP_STYLES: MapStyle[] = [
  // Default Mapbox styles
  {
    id: 'streets',
    name: 'Streets',
    style: 'mapbox://styles/mapbox/streets-v12',
    description: 'Detailed street map with building footprints',
    category: 'default',
    preview: 'https://api.mapbox.com/styles/v1/mapbox/streets-v12/static/-122.4194,37.7749,10/300x200@2x?access_token='
  },
  {
    id: 'outdoors',
    name: 'Outdoors',
    style: 'mapbox://styles/mapbox/outdoors-v12',
    description: 'Outdoor recreation map with terrain features',
    category: 'default',
    preview: 'https://api.mapbox.com/styles/v1/mapbox/outdoors-v12/static/-122.4194,37.7749,10/300x200@2x?access_token='
  },
  {
    id: 'light',
    name: 'Light',
    style: 'mapbox://styles/mapbox/light-v11',
    description: 'Light theme with minimal colors',
    category: 'default',
    preview: 'https://api.mapbox.com/styles/v1/mapbox/light-v11/static/-122.4194,37.7749,10/300x200@2x?access_token='
  },
  {
    id: 'dark',
    name: 'Dark',
    style: 'mapbox://styles/mapbox/dark-v11',
    description: 'Dark theme for low-light environments',
    category: 'default',
    preview: 'https://api.mapbox.com/styles/v1/mapbox/dark-v11/static/-122.4194,37.7749,10/300x200@2x?access_token='
  },
  {
    id: 'satellite',
    name: 'Satellite',
    style: 'mapbox://styles/mapbox/satellite-v9',
    description: 'High-resolution satellite imagery',
    category: 'satellite',
    preview: 'https://api.mapbox.com/styles/v1/mapbox/satellite-v9/static/-122.4194,37.7749,10/300x200@2x?access_token='
  },
  {
    id: 'satellite-streets',
    name: 'Satellite Streets',
    style: 'mapbox://styles/mapbox/satellite-streets-v12',
    description: 'Satellite imagery with street labels',
    category: 'satellite',
    preview: 'https://api.mapbox.com/styles/v1/mapbox/satellite-streets-v12/static/-122.4194,37.7749,10/300x200@2x?access_token='
  },
  {
    id: 'navigation-day',
    name: 'Navigation Day',
    style: 'mapbox://styles/mapbox/navigation-day-v1',
    description: 'Optimized for turn-by-turn navigation',
    category: 'default',
    preview: 'https://api.mapbox.com/styles/v1/mapbox/navigation-day-v1/static/-122.4194,37.7749,10/300x200@2x?access_token='
  },
  {
    id: 'navigation-night',
    name: 'Navigation Night',
    style: 'mapbox://styles/mapbox/navigation-night-v1',
    description: 'Night-optimized navigation map',
    category: 'default',
    preview: 'https://api.mapbox.com/styles/v1/mapbox/navigation-night-v1/static/-122.4194,37.7749,10/300x200@2x?access_token='
  }
]

// Custom style configurations for real estate
export const REAL_ESTATE_STYLES = {
  // Property-focused style with enhanced building visibility
  property: {
    id: 'property',
    name: 'Property Focus',
    style: 'mapbox://styles/mapbox/streets-v12',
    description: 'Enhanced for property visualization',
    category: 'custom' as const,
    customLayers: [
      {
        id: 'property-highlight',
        type: 'fill',
        source: 'property-data',
        paint: {
          'fill-color': '#3b82f6',
          'fill-opacity': 0.3,
          'fill-outline-color': '#1d4ed8'
        }
      }
    ]
  },
  
  // Investment analysis style
  investment: {
    id: 'investment',
    name: 'Investment Analysis',
    style: 'mapbox://styles/mapbox/light-v11',
    description: 'Optimized for market analysis',
    category: 'custom' as const,
    customLayers: [
      {
        id: 'market-zones',
        type: 'fill',
        source: 'market-data',
        paint: {
          'fill-color': [
            'interpolate',
            ['linear'],
            ['get', 'value'],
            0, '#fee2e2',
            50, '#fef3c7',
            100, '#d1fae5'
          ],
          'fill-opacity': 0.4
        }
      }
    ]
  }
}

// Theme configurations
export interface MapTheme {
  id: string
  name: string
  description: string
  colors: {
    primary: string
    secondary: string
    accent: string
    background: string
    text: string
    border: string
  }
  markerColors: {
    default: string
    selected: string
    hover: string
    cluster: string
  }
}

export const MAP_THEMES: MapTheme[] = [
  {
    id: 'default',
    name: 'Default',
    description: 'Standard blue theme',
    colors: {
      primary: '#3b82f6',
      secondary: '#1d4ed8',
      accent: '#60a5fa',
      background: '#ffffff',
      text: '#1f2937',
      border: '#e5e7eb'
    },
    markerColors: {
      default: '#3b82f6',
      selected: '#1d4ed8',
      hover: '#60a5fa',
      cluster: '#ef4444'
    }
  },
  {
    id: 'green',
    name: 'Green',
    description: 'Nature-inspired green theme',
    colors: {
      primary: '#10b981',
      secondary: '#059669',
      accent: '#34d399',
      background: '#ffffff',
      text: '#1f2937',
      border: '#e5e7eb'
    },
    markerColors: {
      default: '#10b981',
      selected: '#059669',
      hover: '#34d399',
      cluster: '#f59e0b'
    }
  },
  {
    id: 'purple',
    name: 'Purple',
    description: 'Elegant purple theme',
    colors: {
      primary: '#8b5cf6',
      secondary: '#7c3aed',
      accent: '#a78bfa',
      background: '#ffffff',
      text: '#1f2937',
      border: '#e5e7eb'
    },
    markerColors: {
      default: '#8b5cf6',
      selected: '#7c3aed',
      hover: '#a78bfa',
      cluster: '#f59e0b'
    }
  },
  {
    id: 'dark',
    name: 'Dark',
    description: 'Dark mode theme',
    colors: {
      primary: '#6366f1',
      secondary: '#4f46e5',
      accent: '#818cf8',
      background: '#1f2937',
      text: '#f9fafb',
      border: '#374151'
    },
    markerColors: {
      default: '#6366f1',
      selected: '#4f46e5',
      hover: '#818cf8',
      cluster: '#ef4444'
    }
  }
]

// Utility functions
export function getStyleById(id: string): MapStyle | undefined {
  return MAP_STYLES.find(style => style.id === id)
}

export function getThemeById(id: string): MapTheme | undefined {
  return MAP_THEMES.find(theme => theme.id === id)
}

export function getStylesByCategory(category: MapStyle['category']): MapStyle[] {
  return MAP_STYLES.filter(style => style.category === category)
}

export function getDefaultStyle(): MapStyle {
  return MAP_STYLES.find(style => style.id === 'streets') || MAP_STYLES[0]
}

export function getDefaultTheme(): MapTheme {
  return MAP_THEMES.find(theme => theme.id === 'default') || MAP_THEMES[0]
}

// Style preview URL generator
export function getStylePreviewUrl(style: MapStyle, accessToken: string, center: [number, number] = [-122.4194, 37.7749], zoom: number = 10): string {
  const baseUrl = style.preview || `https://api.mapbox.com/styles/v1/mapbox/${style.id}/static/${center[0]},${center[1]},${zoom}/300x200@2x`
  return `${baseUrl}?access_token=${accessToken}`
}
