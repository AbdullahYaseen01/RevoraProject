# 🗺️ Mapbox Setup Guide

## Quick Setup

### 1. **Update your `.env.local` file:**

Add these lines to your `.env.local` file in the project root:

```env
# Your existing Mapbox API key
MAPBOX_API_KEY=pk.eyJ1IjoicmV2YXJhYWkiLCJhIjoiY21iODdhMzJ4MDBnczJtcHd2NXpibW1laSJ9.e6-3MRdJxZaLUxoUUSEFcg

# Required for client-side map rendering
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=pk.eyJ1IjoicmV2YXJhYWkiLCJhIjoiY21iODdhMzJ4MDBnczJtcHd2NXpibW1laSJ9.e6-3MRdJxZaLUxoUUSEFcg

# Optional: Custom map style
NEXT_PUBLIC_MAPBOX_STYLE=mapbox://styles/mapbox/streets-v12
```

### 2. **Restart your development server:**

```bash
npm run dev
```

### 3. **Test the setup:**

- Visit `/mapbox-demo` to see all features
- Visit `/properties` to see the property search with map
- Visit `/debug-env` to check environment variables

## Why Both Variables?

- **`MAPBOX_API_KEY`**: Used for server-side API calls (geocoding, directions)
- **`NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN`**: Required for client-side map rendering in the browser

## Troubleshooting

### Map not loading?
1. Check both environment variables are set
2. Restart the development server
3. Check browser console for errors
4. Visit `/api/mapbox/config` to verify server can access the token

### Still having issues?
1. Clear browser cache
2. Check if the token is valid at [mapbox.com](https://mapbox.com)
3. Verify the token has the required permissions

## Features Available

✅ Interactive Maps with Mapbox GL JS  
✅ Geocoding & Reverse Geocoding  
✅ Marker Clustering  
✅ Custom Map Styles & Themes  
✅ Advanced Map Controls  
✅ Property Search Integration  
✅ Mobile Responsive Design  

## Demo Pages

- `/mapbox-demo` - Complete feature demonstration
- `/properties` - Property search with map integration
- `/debug-env` - Environment variable debugging
