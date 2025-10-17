export type RentcastProperty = {
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

type SearchParams = {
  city?: string
  zipCode?: string
  address?: string
  bedsMin?: number
  bathsMin?: number
  squareFeetMin?: number
}

const BASE_URL = process.env.RENTCAST_BASE_URL || "https://api.rentcast.io/v1"
const API_KEY = process.env.RENTCAST_API_KEY

function authHeaders() {
  if (!API_KEY) throw new Error("Missing RENTCAST_API_KEY. Set it in .env to enable property search.")
  return { "X-Api-Key": API_KEY }
}

export async function searchProperties(params: SearchParams): Promise<RentcastProperty[]> {
  const url = new URL(`${BASE_URL}/properties/search`)
  if (params.city) url.searchParams.set("city", params.city)
  if (params.zipCode) url.searchParams.set("zip", params.zipCode)
  if (params.address) url.searchParams.set("address", params.address)
  if (params.bedsMin) url.searchParams.set("minBeds", String(params.bedsMin))
  if (params.bathsMin) url.searchParams.set("minBaths", String(params.bathsMin))
  if (params.squareFeetMin) url.searchParams.set("minSqft", String(params.squareFeetMin))

  const res = await fetch(url.toString(), { headers: authHeaders(), cache: "no-store" })
  if (!res.ok) throw new Error(`Rentcast search failed: ${res.status}`)
  const data = await res.json()
  return (data as any[]).map(mapRentcast)
}

export async function getPropertyById(id: string): Promise<RentcastProperty | null> {
  const url = new URL(`${BASE_URL}/properties/${id}`)
  const res = await fetch(url.toString(), { headers: authHeaders(), cache: "no-store" })
  if (res.status === 404) return null
  if (!res.ok) throw new Error(`Rentcast details failed: ${res.status}`)
  const data = await res.json()
  return mapRentcast(data)
}

function mapRentcast(p: any): RentcastProperty {
  return {
    id: String(p.id ?? p.propertyId ?? p.rentcastId ?? `${p.address}-${p.zip}`),
    address: p.address || `${p.streetNumber ?? ''} ${p.streetName ?? ''}`.trim(),
    city: p.city,
    state: p.state,
    zipCode: p.zip || p.zipCode,
    latitude: p.latitude ?? p.lat,
    longitude: p.longitude ?? p.lng,
    beds: p.beds ?? p.bedrooms,
    baths: p.baths ?? p.bathrooms,
    squareFeet: p.squareFeet ?? p.sqft,
    lotSize: p.lotSize,
    yearBuilt: p.yearBuilt,
    lastSalePrice: p.lastSalePrice,
    lastSaleDate: p.lastSaleDate,
    propertyType: p.propertyType,
    status: p.status,
    imageUrl: p.imageUrl || p.image || p.photo
  }
}


