#!/bin/bash

# Netlify Build Script
echo "🚀 Starting Netlify build process..."

# Set Node version
export NODE_VERSION=20

# Install dependencies with legacy peer deps flag
echo "📦 Installing dependencies..."
npm ci --legacy-peer-deps

# Generate Prisma client
echo "🔧 Generating Prisma client..."
npx prisma generate

# Build the application
echo "🏗️ Building application..."
npm run build

echo "✅ Build completed successfully!"
