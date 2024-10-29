/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    domains: ['a0.muscache.com', 'images.unsplash.com'],
  },
  experimental: {
    serverActions: true,
  },
};

module.exports = nextConfig;