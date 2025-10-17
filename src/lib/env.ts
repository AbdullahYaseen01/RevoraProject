export function requireEnv(name: string) {
  const val = process.env[name]
  if (!val || val.length === 0) {
    throw new Error(`Missing required environment variable: ${name}`)
  }
  return val
}

export function isEnvSet(name: string) {
  const val = process.env[name]
  return !!val && val.length > 0
}

// Mapbox configuration
export const MAPBOX_CONFIG = {
  accessToken: process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN || process.env.MAPBOX_API_KEY || '',
  style: process.env.NEXT_PUBLIC_MAPBOX_STYLE || 'mapbox://styles/mapbox/streets-v12',
  geocodingApiUrl: 'https://api.mapbox.com/geocoding/v5/mapbox.places',
  directionsApiUrl: 'https://api.mapbox.com/directions/v5/mapbox/driving',
  isochroneApiUrl: 'https://api.mapbox.com/isochrone/v1/mapbox/driving'
}

export function getMapboxConfig() {
  if (!MAPBOX_CONFIG.accessToken) {
    console.warn('Mapbox access token not found. Please set NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN or MAPBOX_API_KEY in your environment variables.')
  }
  return MAPBOX_CONFIG
}


