"use client"

import { useSession } from "next-auth/react"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import DashboardNav from "@/components/dashboard/nav"
import PropertyMapboxMap from "@/components/mapbox/PropertyMapboxMap"
import MapControls from "@/components/mapbox/MapControls"
import MapStyleSelector from "@/components/mapbox/MapStyleSelector"
import GeocodingSearch from "@/components/mapbox/GeocodingSearch"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Map, Layers, Search, Settings, Download } from "lucide-react"

export default function MapViewPage() {
  const { data: session, status } = useSession()
  const router = useRouter()
  const [mapStyle, setMapStyle] = useState('mapbox://styles/mapbox/light-v11')
  const [mapTheme, setMapTheme] = useState('default')
  const [selectedProperties, setSelectedProperties] = useState([])
  const [mapBounds, setMapBounds] = useState(null)
  const [properties] = useState([
    {
      id: '1',
      address: '123 Main St',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94102',
      latitude: 37.7749,
      longitude: -122.4194,
      beds: 3,
      baths: 2,
      squareFeet: 1500,
      lastSalePrice: 850000,
      propertyType: 'Single Family',
      yearBuilt: 1995,
      imageUrl: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400'
    },
    {
      id: '2',
      address: '456 Oak Ave',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94103',
      latitude: 37.7849,
      longitude: -122.4094,
      beds: 2,
      baths: 1,
      squareFeet: 1200,
      lastSalePrice: 750000,
      propertyType: 'Condo',
      yearBuilt: 2010,
      imageUrl: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400'
    },
    {
      id: '3',
      address: '789 Pine St',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94104',
      latitude: 37.7649,
      longitude: -122.4294,
      beds: 4,
      baths: 3,
      squareFeet: 2000,
      lastSalePrice: 1200000,
      propertyType: 'Single Family',
      yearBuilt: 1985,
      imageUrl: 'https://images.unsplash.com/photo-1564013799919-ab600027ffc6?w=400'
    }
  ])

  useEffect(() => {
    if (status === "loading") return

    if (!session) {
      router.push("/auth/signin")
      return
    }
  }, [session, status, router])

  const handleMapStyleChange = (style: string) => {
    setMapStyle(style)
  }

  const handleMapThemeChange = (theme: string) => {
    setMapTheme(theme)
  }

  const handleSearchLocation = async (query: string) => {
    try {
      const response = await fetch(`/api/mapbox/geocode?q=${encodeURIComponent(query)}&limit=1`)
      const data = await response.json()
      
      if (data.success && data.data.features.length > 0) {
        const feature = data.data.features[0]
        const [lng, lat] = feature.center
        
        // You can update map center here if needed
        console.log('Found location:', feature.place_name, 'at', lat, lng)
      }
    } catch (error) {
      console.error('Geocoding error:', error)
    }
  }

  const handleExportMapData = () => {
    if (selectedProperties.length === 0) {
      alert('No properties selected to export')
      return
    }

    const csvContent = [
      ['Address', 'Latitude', 'Longitude', 'Price', 'Property Type'],
      ...selectedProperties.map((property: any) => [
        property.address || '',
        property.latitude || '',
        property.longitude || '',
        property.price || '',
        property.propertyType || '',
      ])
    ].map(row => row.join(',')).join('\n')

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `map-properties-${new Date().toISOString().split('T')[0]}.csv`
    a.click()
    window.URL.revokeObjectURL(url)
  }

  if (status === "loading") {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  if (!session) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <DashboardNav />

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Map View
            </h1>
            <p className="text-gray-600">
              Explore properties and investment opportunities on an interactive map.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Map Controls */}
            <div className="lg:col-span-1 space-y-6">
              {/* Location Search */}
              <Card className="border-gray-200 shadow-lg">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-gray-900 text-lg font-semibold">
                    <Search className="w-5 h-5 text-blue-600" />
                    Search Location
                  </CardTitle>
                  <CardDescription className="text-gray-600 text-sm">
                    Find specific areas on the map
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <GeocodingSearch onResultSelect={handleSearchLocation} />
                </CardContent>
              </Card>

              {/* Map Style */}
              <Card className="border-gray-200 shadow-lg">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-gray-900 text-lg font-semibold">
                    <Layers className="w-5 h-5 text-blue-600" />
                    Map Style
                  </CardTitle>
                  <CardDescription className="text-gray-600 text-sm">
                    Choose your preferred map appearance
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <MapStyleSelector 
                    currentStyle={mapStyle}
                    currentTheme={mapTheme}
                    onStyleChange={handleMapStyleChange}
                    onThemeChange={handleMapThemeChange}
                  />
                </CardContent>
              </Card>

              {/* Map Controls */}
              <Card className="border-gray-200 shadow-lg">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-gray-900 text-lg font-semibold">
                    <Settings className="w-5 h-5 text-blue-600" />
                    Map Tools
                  </CardTitle>
                  <CardDescription className="text-gray-600 text-sm">
                    Drawing and measurement tools
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <MapControls 
                      map={null}
                      showZoom={true}
                      showCompass={true}
                      showGeolocate={true}
                      showFullscreen={true}
                      showDraw={true}
                      showMeasure={true}
                      showLayerControl={false}
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Export Options */}
              {selectedProperties.length > 0 && (
                <Card className="border-gray-200 shadow-lg">
                  <CardHeader className="pb-3">
                    <CardTitle className="flex items-center gap-2 text-gray-900 text-lg font-semibold">
                      <Download className="w-5 h-5 text-blue-600" />
                      Export Data
                    </CardTitle>
                    <CardDescription className="text-gray-600 text-sm">
                      {selectedProperties.length} properties selected
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      onClick={handleExportMapData}
                      className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:shadow-lg transition-all duration-200"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Export Selected Properties
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Map */}
            <div className="lg:col-span-3">
              <Card className="h-[600px] border-gray-200 shadow-lg">
                <CardHeader className="pb-3">
                  <CardTitle className="flex items-center gap-2 text-gray-900 text-lg font-semibold">
                    <Map className="w-5 h-5 text-blue-600" />
                    Interactive Property Map
                  </CardTitle>
                  <CardDescription className="text-gray-600 text-sm">
                    Click on properties to view details and add to selection
                  </CardDescription>
                </CardHeader>
                <CardContent className="p-0 h-full">
                  <div className="h-full w-full">
                    <PropertyMapboxMap 
                      properties={properties}
                      center={[-122.4194, 37.7749]}
                      zoom={10}
                      onPropertyClick={(property) => {
                        setSelectedProperties(prev => [...prev, property])
                      }}
                      onMapLoad={(map) => {
                        console.log('Map loaded successfully')
                      }}
                      showClustering={true}
                      showSearch={true}
                      showControls={true}
                      showStyleSelector={true}
                    />
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
