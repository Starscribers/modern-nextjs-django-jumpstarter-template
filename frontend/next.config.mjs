/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: false, // Temporarily disable to test double mounting
  // output: 'export', // Temporarily disabled for development
  trailingSlash: true,
  experimental: {
    serverComponentsExternalPackages: [],
  },
  images: {
    unoptimized: true,
    domains: [
      'images.unsplash.com',
      'localhost',
      '127.0.0.1',
      'picsum.photos',
      '14215678c021.ngrok-free.app',
    ],

    remotePatterns: [
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '8000',
        pathname: '/media/**',
      },
      {
        protocol: 'http',
        hostname: '127.0.0.1',
        port: '8000',
        pathname: '/media/**',
      },
      {
        protocol: 'https',
        hostname: 'localhost',
        port: '8000',
        pathname: '/media/**',
      },
      {
        protocol: 'https',
        hostname: '127.0.0.1',
        port: '8000',
        pathname: '/media/**',
      },
      // Add your production domain here when deploying
      // {
      //   protocol: 'https',
      //   hostname: 'your-production-domain.com',
      //   pathname: '/media/**',
      // },
    ],
  },
};

export default nextConfig;
