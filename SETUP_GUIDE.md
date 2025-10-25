# Environment Setup Guide

## Required API Keys for Property Search and Map View

To get the property search and map view working, you need to set up the following environment variables. Create a `.env.local` file in your project root with these variables:

### 1. Mapbox API Key (Required for Maps)
```bash
# Get your free Mapbox token at: https://account.mapbox.com/access-tokens/
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN="pk.your-mapbox-token-here"
MAPBOX_API_KEY="pk.your-mapbox-token-here"
```

### 2. Rentcast API Key (Required for Property Search)
```bash
# Get your Rentcast API key at: https://rentcast.io/
RENTCAST_API_KEY="your-rentcast-api-key-here"
RENTCAST_BASE_URL="https://api.rentcast.io/v1"
```

### 3. Database Configuration
```bash
DATABASE_URL="postgresql://username:password@localhost:5432/revora_db"
```

### 4. NextAuth Configuration
```bash
NEXTAUTH_SECRET="your-nextauth-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
```

### 5. Stripe Configuration (For Payments)
```bash
STRIPE_SECRET_KEY="sk_test_your-stripe-secret-key"
STRIPE_PUBLISHABLE_KEY="pk_test_your-stripe-publishable-key"
STRIPE_WEBHOOK_SECRET="whsec_your-webhook-secret"
```

## Quick Setup Steps:

1. **Get Mapbox Token:**
   - Go to https://account.mapbox.com/access-tokens/
   - Sign up for a free account
   - Create a new access token
   - Copy the token (starts with "pk.")

2. **Get Rentcast API Key:**
   - Go to https://rentcast.io/
   - Sign up for an account
   - Get your API key from the dashboard

3. **Create .env.local file:**
   ```bash
   # Copy this template and replace with your actual keys
   NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN="pk.your-mapbox-token-here"
   MAPBOX_API_KEY="pk.your-mapbox-token-here"
   RENTCAST_API_KEY="your-rentcast-api-key-here"
   DATABASE_URL="postgresql://username:password@localhost:5432/revora_db"
   NEXTAUTH_SECRET="your-nextauth-secret-key-here"
   NEXTAUTH_URL="http://localhost:3000"
   ```

4. **Restart your development server:**
   ```bash
   npm run dev
   ```

## Testing the Setup:

1. **Check Mapbox Status:** The app will show a green checkmark if Mapbox is configured correctly
2. **Test Property Search:** Try searching for properties in a city like "San Francisco" or "New York"
3. **Test Map View:** The map should load and display property markers

## Troubleshooting:

- If the map doesn't load: Check that your Mapbox token is valid and starts with "pk."
- If property search returns no results: Check that your Rentcast API key is valid
- If you see errors in the console: Check that all required environment variables are set

## Free Tier Limits:

- **Mapbox:** 50,000 map loads per month (free)
- **Rentcast:** Check their pricing at https://rentcast.io/pricing
