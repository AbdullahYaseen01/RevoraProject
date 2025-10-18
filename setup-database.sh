#!/bin/bash

# Database Setup Script for Revara Project
echo "🚀 Setting up database for Revara Project..."

# Create a free Neon database
echo "📦 Creating Neon database..."

# Database credentials (these will be provided by Neon)
DB_HOST="ep-cool-darkness-123456.us-east-1.aws.neon.tech"
DB_NAME="revara_db"
DB_USER="revara_user"
DB_PASSWORD="revara_password"

# Construct DATABASE_URL
DATABASE_URL="postgresql://${DB_USER}:${DB_PASSWORD}@${DB_HOST}/${DB_NAME}?sslmode=require"

echo "✅ Database URL: ${DATABASE_URL}"

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npx prisma generate

# Push schema to database
echo "📊 Pushing schema to database..."
npx prisma db push

echo "✅ Database setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Add DATABASE_URL to Netlify environment variables"
echo "2. Redeploy your site"
echo "3. Test registration functionality"
