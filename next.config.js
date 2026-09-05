/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  compress: true,
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: '**.supabase.co',
      },
      {
        protocol: 'https',
        hostname: '**.supabase.in',
      },
    ],
  },
  async redirects() {
    return [
      {
        source: '/Admin',
        destination: '/admin',
        permanent: true,
      },
      {
        source: '/Admin/:path*',
        destination: '/admin/:path*',
        permanent: true,
      },
      {
        source: '/ADMIN',
        destination: '/admin',
        permanent: true,
      },
      {
        source: '/ADMIN/:path*',
        destination: '/admin/:path*',
        permanent: true,
      },
    ];
  },
};

module.exports = nextConfig;
