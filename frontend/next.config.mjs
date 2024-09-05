/** @type {import('next').NextConfig} */
const nextConfig = {
    reactStrictMode: true,
    webpack: (config, { dev, isServer }) => {
      if (dev && !isServer) {
        const originalEntry = config.entry
        config.entry = async () => {
          const entries = await originalEntry()
          if (entries['main.js'] && !entries['main.js'].includes('./client/dev-error-overlay')) {
            entries['main.js'].unshift('webpack-hot-middleware/client?path=/_next/webpack-hmr&timeout=20000&reload=true')
          }
          return entries
        }
      }
      return config
    },
  };
  
  module.exports = nextConfig;