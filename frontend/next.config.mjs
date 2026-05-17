/** @type {import('next').NextConfig} */
const nextConfig = {
  // Force Webpack to poll for file changes (Fix for Windows/Docker)
  webpack: (config, context) => {
    config.watchOptions = {
      poll: 1000, // Check for changes every second
      aggregateTimeout: 300,
    }
    return config
  },
}

export default nextConfig;