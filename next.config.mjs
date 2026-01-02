/** @type {import('next').NextConfig} */
const nextConfig = {
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  // Allow requests from the local development server
  allowedDevOrigins: ['http://localhost:3000', 'http://172.28.176.1:3000'],
  eslint: {
    ignoreDuringBuilds: true,
  },
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'placehold.co',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: 'i.pravatar.cc',
        port: '',
        pathname: '/**',
      },
    ],
  },
  webpack: (config, { isServer }) => {
    // Handle pg module specifically
    if (isServer) {
      config.externals = config.externals || [];
      config.externals.push({
        'pg': 'commonjs pg',
        'pg-pool': 'commonjs pg-pool',
      });
    } else {
      // Exclude pg from client bundle
      config.externals = {
        ...config.externals,
        'pg': 'commonjs pg',
        'pg-pool': 'commonjs pg-pool',
      };
    }

    // Fallbacks for Node.js modules
    config.resolve.fallback = {
      ...config.resolve.fallback,
      fs: false,
      net: false,
      dns: false,
      tls: false,
      assert: false,
      path: false,
      url: false,
      util: false,
      querystring: false,
      stream: false,
      crypto: false,
      http: false,
      https: false,
      os: false,
      zlib: false,
    };

    return config;
  },
};

export default nextConfig;
