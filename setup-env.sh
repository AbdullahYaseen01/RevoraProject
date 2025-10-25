# Rentcast API Setup Script
# Run this script to set up your environment variables

echo "Setting up Rentcast API environment variables..."

# Create .env.local file
cat > .env.local << 'EOF'
# Environment Variables for Revora Project

# Mapbox Configuration (Required for maps)
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=pk.eyJ1IjoidGVjaDIzMTQzIiwiYSI6ImNtaDV5ZGs1bTBlazAybHBnOXE0YTVodDgifQ.2NJBERowtCEcKoTcN8k_QA
MAPBOX_API_KEY=pk.eyJ1IjoidGVjaDIzMTQzIiwiYSI6ImNtaDV5ZGs1bTBlazAybHBnOXE0YTVodDgifQ.2NJBERowtCEcKoTcN8k_QA

# Rentcast API (Required for property search)
RENTCAST_API_KEY=42a7df68a0ec41338161708c2aab02e2
RENTCAST_BASE_URL=https://api.rentcast.io/v1

# Database Configuration
DATABASE_URL=postgresql://postgres:password@localhost:5432/revora_db

# NextAuth Configuration
NEXTAUTH_SECRET=lXqOc4xDg6CKpAok1VhmiWtuJ2Ewr5S8
NEXTAUTH_URL=http://localhost:3000
EOF

echo "Environment variables created successfully!"
echo "Please restart your development server for changes to take effect."
echo ""
echo "To restart:"
echo "1. Stop the current server (Ctrl+C)"
echo "2. Run: npm run dev"
