import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // ✅ Allow build even with ESLint warnings/errors
  },
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'images.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'plus.unsplash.com',
      },
      {
        protocol: 'https',
        hostname: 'media.istockphoto.com',
      },
      {
        protocol: 'https',
        hostname: 'example.com',
      },
      {
        protocol: 'https',
        hostname: 'yourcdn.com',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5000',
        pathname: '/uploads/**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
        port: '5000',
        pathname: '/api/v1/uploads/**',
      },
      {
        protocol: 'https',
        hostname: 'ramona-jewels-server.onrender.com',
        // port: '5000',
        pathname: '/uploads/**'
      },
      {
        protocol: 'https',
        hostname: 'ramona-jewels-server.onrender.com',
        // port: '5000',
        pathname: '/**'
      },
    ],
  },
  async rewrites() {
    const API = process.env.NEXT_PUBLIC_API_URL || ""
    const SERVER = process.env.NEXT_PUBLIC_SERVER_URL || (() => {
      try { return API ? new URL(API).origin : "" } catch { return "" }
    })() || 'http://localhost:5000'
    const base = SERVER.replace(/\/$/, "")
    return [
      { source: '/uploads/:path*', destination: `${base}/uploads/:path*` },
      { source: '/api/v1/uploads/:path*', destination: `${base}/api/v1/uploads/:path*` },
    ]
  },
};

export default nextConfig;
