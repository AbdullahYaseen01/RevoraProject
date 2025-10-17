import { MAPBOX_CONFIG } from './env'

export interface GeocodingResult {
  id: string
  type: string
  place_type: string[]
  relevance: number
  properties: {
    accuracy: string
    address?: string
    category?: string
    maki?: string
    wikidata?: string
  }
  text: string
  place_name: string
  center: [number, number] // [longitude, latitude]
  geometry: {
    type: string
    coordinates: [number, number]
  }
  context?: Array<{
    id: string
    text: string
    wikidata?: string
    short_code?: string
  }>
}

export interface GeocodingResponse {
  type: string
  query: string[]
  features: GeocodingResult[]
  attribution: string
}

export interface ReverseGeocodingResult {
  type: string
  query: [number, number]
  features: GeocodingResult[]
  attribution: string
}

export interface DirectionsResult {
  routes: Array<{
    geometry: {
      coordinates: [number, number][]
      type: string
    }
    legs: Array<{
      distance: number
      duration: number
      steps: Array<{
        distance: number
        duration: number
        geometry: {
          coordinates: [number, number][]
          type: string
        }
        instruction: string
        maneuver: {
          type: string
          instruction: string
          bearing_after: number
          bearing_before: number
          location: [number, number]
        }
      }>
    }>
    distance: number
    duration: number
    weight_name: string
    weight: number
  }>
  waypoints: Array<{
    distance: number
    name: string
    location: [number, number]
  }>
  code: string
  uuid: string
}

class MapboxService {
  private accessToken: string
  private baseUrl: string

  constructor() {
    this.accessToken = MAPBOX_CONFIG.accessToken
    this.baseUrl = MAPBOX_CONFIG.geocodingApiUrl
  }

  private async makeRequest<T>(url: string): Promise<T> {
    if (!this.accessToken) {
      throw new Error('Mapbox access token is required. Please set NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN or MAPBOX_API_KEY in your environment variables.')
    }

    const response = await fetch(`${url}&access_token=${this.accessToken}`)
    
    if (!response.ok) {
      throw new Error(`Mapbox API request failed: ${response.status} ${response.statusText}`)
    }

    return response.json()
  }

  /**
   * Geocode an address to get coordinates
   */
  async geocode(query: string, options: {
    limit?: number
    proximity?: [number, number]
    bbox?: [number, number, number, number]
    types?: string[]
    country?: string
    language?: string
  } = {}): Promise<GeocodingResponse> {
    const params = new URLSearchParams()
    params.set('q', query)
    
    if (options.limit) params.set('limit', options.limit.toString())
    if (options.proximity) params.set('proximity', options.proximity.join(','))
    if (options.bbox) params.set('bbox', options.bbox.join(','))
    if (options.types) params.set('types', options.types.join(','))
    if (options.country) params.set('country', options.country)
    if (options.language) params.set('language', options.language)

    return this.makeRequest<GeocodingResponse>(`${this.baseUrl}/${encodeURIComponent(query)}.json?${params.toString()}`)
  }

  /**
   * Reverse geocode coordinates to get address
   */
  async reverseGeocode(coordinates: [number, number], options: {
    limit?: number
    types?: string[]
    language?: string
  } = {}): Promise<ReverseGeocodingResult> {
    const params = new URLSearchParams()
    
    if (options.limit) params.set('limit', options.limit.toString())
    if (options.types) params.set('types', options.types.join(','))
    if (options.language) params.set('language', options.language)

    return this.makeRequest<ReverseGeocodingResult>(
      `${this.baseUrl}/${coordinates[0]},${coordinates[1]}.json?${params.toString()}`
    )
  }

  /**
   * Get directions between two or more points
   */
  async getDirections(waypoints: [number, number][], options: {
    profile?: 'driving' | 'walking' | 'cycling'
    alternatives?: boolean
    geometries?: 'geojson' | 'polyline' | 'polyline6'
    overview?: 'full' | 'simplified' | 'false'
    steps?: boolean
    annotations?: string[]
    language?: string
    roundtrip?: boolean
    source?: 'first' | 'any'
    destination?: 'last' | 'any'
  } = {}): Promise<DirectionsResult> {
    const coordinates = waypoints.map(wp => wp.join(',')).join(';')
    const params = new URLSearchParams()
    
    if (options.profile) params.set('profile', options.profile)
    if (options.alternatives !== undefined) params.set('alternatives', options.alternatives.toString())
    if (options.geometries) params.set('geometries', options.geometries)
    if (options.overview) params.set('overview', options.overview)
    if (options.steps !== undefined) params.set('steps', options.steps.toString())
    if (options.annotations) params.set('annotations', options.annotations.join(','))
    if (options.language) params.set('language', options.language)
    if (options.roundtrip !== undefined) params.set('roundtrip', options.roundtrip.toString())
    if (options.source) params.set('source', options.source)
    if (options.destination) params.set('destination', options.destination)

    return this.makeRequest<DirectionsResult>(
      `${MAPBOX_CONFIG.directionsApiUrl}/${coordinates}?${params.toString()}`
    )
  }

  /**
   * Get isochrone (travel time/distance contours) from a point
   */
  async getIsochrone(coordinates: [number, number], options: {
    profile?: 'driving' | 'walking' | 'cycling'
    contours_minutes?: number[]
    contours_meters?: number[]
    polygons?: boolean
    denoise?: number
    generalize?: number
  } = {}): Promise<any> {
    const params = new URLSearchParams()
    
    if (options.profile) params.set('profile', options.profile)
    if (options.contours_minutes) params.set('contours_minutes', options.contours_minutes.join(','))
    if (options.contours_meters) params.set('contours_meters', options.contours_meters.join(','))
    if (options.polygons !== undefined) params.set('polygons', options.polygons.toString())
    if (options.denoise) params.set('denoise', options.denoise.toString())
    if (options.generalize) params.set('generalize', options.generalize.toString())

    return this.makeRequest<any>(
      `${MAPBOX_CONFIG.isochroneApiUrl}/${coordinates[0]},${coordinates[1]}?${params.toString()}`
    )
  }

  /**
   * Search for places using Mapbox Search API
   */
  async searchPlaces(query: string, options: {
    limit?: number
    proximity?: [number, number]
    bbox?: [number, number, number, number]
    types?: string[]
    country?: string
    language?: string
  } = {}): Promise<GeocodingResponse> {
    return this.geocode(query, options)
  }

  /**
   * Get address components from a geocoding result
   */
  getAddressComponents(result: GeocodingResult) {
    const components: Record<string, string> = {}
    
    if (result.context) {
      result.context.forEach(context => {
        if (context.id.startsWith('place')) {
          components.city = context.text
        } else if (context.id.startsWith('region')) {
          components.state = context.text
        } else if (context.id.startsWith('country')) {
          components.country = context.text
        } else if (context.id.startsWith('postcode')) {
          components.postalCode = context.text
        } else if (context.id.startsWith('neighborhood')) {
          components.neighborhood = context.text
        }
      })
    }

    return {
      address: result.text,
      fullAddress: result.place_name,
      coordinates: result.center,
      ...components
    }
  }
}

export const mapboxService = new MapboxService()
