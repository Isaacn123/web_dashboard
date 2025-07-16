import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
   images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'i.ibb.co', // ✅ Add your image host here
      },
    ],
  },
};



export default nextConfig;
