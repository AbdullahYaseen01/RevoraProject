# Revara Project - Database Configuration
# Use this configuration for your Netlify environment variables

# ===========================================
# REQUIRED DATABASE CONFIGURATION
# ===========================================

# Neon PostgreSQL Database (Free tier)
# Replace 'your-site-name' with your actual Netlify site name
DATABASE_URL=postgresql://revara_user:revara_password@ep-cool-darkness-123456.us-east-1.aws.neon.tech/revara_db?sslmode=require

# NextAuth Configuration
NEXTAUTH_URL=https://your-site-name.netlify.app
NEXTAUTH_SECRET=revara-super-secret-key-2024-production-ready

# ===========================================
# REQUIRED MAPBOX CONFIGURATION
# ===========================================

NEXT_PUBLIC_MAPBOX_ACCESS_TOKEN=pk.eyJ1IjoicmV2YXJhYWkiLCJhIjoiY21iODdhMzJ4MDBnczJtcHd2NXpibW1laSJ9.e6-3MRdJxZaLUxoUUSEFcg
NEXT_PUBLIC_MAPBOX_STYLE=mapbox://styles/mapbox/streets-v12

# ===========================================
# SECURITY CONFIGURATION
# ===========================================

JWT_SECRET=revara-jwt-secret-key-2024-production
ENCRYPTION_KEY=revara-32-character-encryption-key

# ===========================================
# OPTIONAL CONFIGURATIONS (Add later if needed)
# ===========================================

# OAuth Providers
# GOOGLE_CLIENT_ID=your-google-client-id
# GOOGLE_CLIENT_SECRET=your-google-client-secret
# GITHUB_CLIENT_ID=your-github-client-id
# GITHUB_CLIENT_SECRET=your-github-client-secret
# DISCORD_CLIENT_ID=your-discord-client-id
# DISCORD_CLIENT_SECRET=your-discord-client-secret

# Email Configuration
# SMTP_HOST=smtp.gmail.com
# SMTP_PORT=587
# SMTP_USER=your-email@gmail.com
# SMTP_PASS=your-app-password
# FROM_EMAIL=noreply@revara.com
# FROM_NAME=Revara

# Stripe Configuration
# STRIPE_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
# STRIPE_SECRET_KEY=sk_test_your_secret_key_here
# STRIPE_WEBHOOK_SECRET=whsec_your_webhook_secret_here
# STRIPE_PRICE_ID_STARTER=price_starter_monthly
# STRIPE_PRICE_ID_PRO=price_pro_monthly
# STRIPE_PRICE_ID_ENTERPRISE=price_enterprise_monthly
