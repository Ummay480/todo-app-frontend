/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  experimental: {
    typedRoutes: true,
  },
  // For Vercel deployment, we don't need explicit rewrites for API proxying
  // since the API calls will go to the backend server directly
};

export default nextConfig;
