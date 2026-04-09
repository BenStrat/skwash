import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'image.thum.io'
      }
    ]
  },
  transpilePackages: ['@skwash/ui', '@skwash/db']
};

export default nextConfig;
