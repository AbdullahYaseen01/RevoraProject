#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const envContent = `# Mapbox Configuration
MAPBOX_API_KEY=pk.eyJ1IjoicmV2YXJhYWkiLCJhIjoiY21iODdhMzJ4MDBnczJtcHd2NXpibW1laSJ9.e6-3MRdJxZaLUxoUUSEFcg
NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=pk.eyJ1IjoicmV2YXJhYWkiLCJhIjoiY21iODdhMzJ4MDBnczJtcHd2NXpibW1laSJ9.e6-3MRdJxZaLUxoUUSEFcg
NEXT_PUBLIC_MAPBOX_STYLE=mapbox://styles/mapbox/streets-v12

# Database
DATABASE_URL="postgresql://username:password@localhost:5432/your_database"

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your-secret-key-here

# Other environment variables can be added here
`;

const envPath = path.join(process.cwd(), '.env.local');

try {
  // Check if .env.local already exists
  if (fs.existsSync(envPath)) {
    console.log('⚠️  .env.local already exists');
    console.log('📝 Please add these lines to your existing .env.local file:');
    console.log('');
    console.log('MAPBOX_API_KEY=pk.eyJ1IjoicmV2YXJhYWkiLCJhIjoiY21iODdhMzJ4MDBnczJtcHd2NXpibW1laSJ9.e6-3MRdJxZaLUxoUUSEFcg');
    console.log('NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=pk.eyJ1IjoicmV2YXJhYWkiLCJhIjoiY21iODdhMzJ4MDBnczJtcHd2NXpibW1laSJ9.e6-3MRdJxZaLUxoUUSEFcg');
    console.log('NEXT_PUBLIC_MAPBOX_STYLE=mapbox://styles/mapbox/streets-v12');
  } else {
    // Create .env.local file
    fs.writeFileSync(envPath, envContent);
    console.log('✅ Created .env.local file with Mapbox configuration');
    console.log('🔄 Please restart your development server: npm run dev');
  }
} catch (error) {
  console.error('❌ Error creating .env.local file:', error.message);
  console.log('');
  console.log('📝 Please manually create .env.local file with this content:');
  console.log('');
  console.log(envContent);
}
