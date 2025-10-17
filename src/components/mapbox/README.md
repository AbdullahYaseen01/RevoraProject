# Mapbox Integration

This directory contains comprehensive Mapbox integration components for the real estate application.

## Features

### 🗺️ **Core Map Components**
- **MapboxMap**: Main map component with full configuration options
- **MapboxMarker**: Customizable markers with popup support
- **MapboxPopup**: Rich popup content with React integration
- **PropertyMapboxMap**: Specialized map for property visualization

### 🔍 **Geocoding & Search**
- **GeocodingSearch**: Address search with autocomplete
- **Reverse Geocoding**: Convert coordinates to addresses
- **Places API**: Search for points of interest

### 🎨 **Customization**
- **MapStyleSelector**: Choose from multiple map styles and themes
- **Custom Themes**: Predefined color schemes for different use cases
- **Style Management**: Easy switching between map styles

### 📊 **Advanced Features**
- **MapboxClustering**: Marker clustering for better performance
- **MapControls**: Comprehensive map controls (zoom, compass, fullscreen, etc.)
- **Layer Management**: Toggle map layers on/off
- **Coordinate Display**: Real-time coordinate information

### 🛠️ **Utilities**
- **MapboxService**: Centralized service for all Mapbox API calls
- **Style Configurations**: Predefined styles and themes
- **Type Definitions**: Complete TypeScript support

## Setup

### 1. Environment Variables

Add to your `.env.local`:

```env
MAPBOX_API_KEY=your_mapbox_access_token_here
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=your_mapbox_access_token_here
NEXT_PUBLIC_MAPBOX_STYLE=mapbox://styles/mapbox/streets-v12
```

**Note:** You need both variables:
- `MAPBOX_API_KEY` for server-side API calls
- `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN` for client-side map rendering

### 2. Get Mapbox Access Token

1. Sign up at [mapbox.com](https://mapbox.com)
2. Go to Account → Access Tokens
3. Copy your default public token
4. Add it to your environment variables

### 3. Install Dependencies

```bash
npm install mapbox-gl
```

## Usage Examples

### Basic Map

```tsx
import MapboxMap from '@/components/mapbox/MapboxMap'

<MapboxMap
  center={[-122.4194, 37.7749]}
  zoom={10}
  onMapLoad={(map) => console.log('Map loaded:', map)}
  onMapClick={(e) => console.log('Clicked:', e.lngLat)}
/>
```

### Property Map with Clustering

```tsx
import PropertyMapboxMap from '@/components/mapbox/PropertyMapboxMap'

<PropertyMapboxMap
  properties={properties}
  center={[-122.4194, 37.7749]}
  zoom={10}
  showClustering={true}
  showSearch={true}
  showControls={true}
  onPropertyClick={(property) => console.log('Property clicked:', property)}
/>
```

### Geocoding Search

```tsx
import GeocodingSearch from '@/components/mapbox/GeocodingSearch'

<GeocodingSearch
  onResultSelect={(result) => {
    console.log('Selected:', result.place_name)
    map.flyTo({ center: result.center, zoom: 15 })
  }}
  placeholder="Search for properties..."
  limit={5}
/>
```

### Style Selector

```tsx
import MapStyleSelector from '@/components/mapbox/MapStyleSelector'

<MapStyleSelector
  currentStyle="streets"
  currentTheme="default"
  onStyleChange={(style) => setMapStyle(style)}
  onThemeChange={(theme) => setMapTheme(theme)}
/>
```

## API Endpoints

### Geocoding
- `GET /api/mapbox/geocode?q=address` - Convert address to coordinates
- `GET /api/mapbox/reverse-geocode?lng=longitude&lat=latitude` - Convert coordinates to address
- `GET /api/mapbox/directions?waypoints=lng1,lat1;lng2,lat2` - Get directions between points

## Map Styles

### Available Styles
- **Streets**: Detailed street map with building footprints
- **Outdoors**: Outdoor recreation map with terrain features
- **Light**: Light theme with minimal colors
- **Dark**: Dark theme for low-light environments
- **Satellite**: High-resolution satellite imagery
- **Satellite Streets**: Satellite imagery with street labels
- **Navigation Day/Night**: Optimized for turn-by-turn navigation

### Custom Themes
- **Default**: Standard blue theme
- **Green**: Nature-inspired green theme
- **Purple**: Elegant purple theme
- **Dark**: Dark mode theme

## Performance Optimization

### Clustering
Use marker clustering for large datasets:

```tsx
<MapboxClustering
  map={map}
  points={clusterPoints}
  clusterRadius={50}
  clusterMaxZoom={14}
  onClusterClick={handleClusterClick}
  onPointClick={handlePointClick}
/>
```

### Lazy Loading
Components are designed for optimal performance with:
- Dynamic imports for large components
- Efficient re-rendering
- Memory leak prevention
- Proper cleanup on unmount

## Customization

### Custom Markers
```tsx
<MapboxMarker
  map={map}
  coordinates={[-122.4194, 37.7749]}
  color="#ff0000"
  size={25}
  popup="Custom popup content"
  onClick={() => console.log('Marker clicked')}
/>
```

### Custom Popups
```tsx
<MapboxPopup
  map={map}
  coordinates={[-122.4194, 37.7749]}
  content={<div>Custom React content</div>}
  options={{
    closeButton: true,
    closeOnClick: true,
    className: 'custom-popup'
  }}
/>
```

## Troubleshooting

### Common Issues

1. **Map not loading**
   - Check if both `MAPBOX_API_KEY` and `NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN` are set
   - Verify token has correct permissions
   - Check browser console for errors
   - Restart development server after changing environment variables

2. **Geocoding not working**
   - Ensure API endpoints are accessible
   - Check rate limits
   - Verify query parameters

3. **Styling issues**
   - Import Mapbox CSS: `import 'mapbox-gl/dist/mapbox-gl.css'`
   - Check for CSS conflicts
   - Verify style URLs are correct

### Debug Mode
Enable debug logging:

```tsx
// In development
if (process.env.NODE_ENV === 'development') {
  mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN
  mapboxgl.setRTLTextPlugin('https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-rtl-text/v0.2.3/mapbox-gl-rtl-text.js')
}
```

## Best Practices

1. **Always use TypeScript** for better type safety
2. **Clean up event listeners** in useEffect cleanup
3. **Use clustering** for large datasets
4. **Implement error boundaries** for map components
5. **Optimize bundle size** with dynamic imports
6. **Handle loading states** for better UX
7. **Use proper error handling** for API calls

## License

This integration uses Mapbox GL JS, which is licensed under the BSD 3-Clause License.
