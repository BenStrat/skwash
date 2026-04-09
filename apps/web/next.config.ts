import type { NextConfig } from 'next';

const nextConfig: NextConfig = {
  transpilePackages: ['@skwash/ui', '@skwash/db']
};

export default nextConfig;
