import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    // Skip ESLint during production builds to avoid blocking on style issues
    ignoreDuringBuilds: true,
  },
  // Enable static exports for better Netlify compatibility
  output: 'standalone',
  // Optimize images for Netlify
  images: {
    unoptimized: true,
  },
  // External packages for server components
  serverExternalPackages: ['@prisma/client', 'bcryptjs'],
};

export default nextConfig;
