/** @type {import('next').NextConfig} */
const nextConfig = {
  api: {
    bodyParser: {
      sizeLimit: '1mb',
    },
    responseLimit: '8mb',
  },
  serverRuntimeConfig: {
    apiTimeout: 60000, // 60 seconds
  },
  // ... any other existing configurations
};

export default nextConfig;
