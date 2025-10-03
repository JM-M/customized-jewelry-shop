import type { NextConfig } from "next";

// TODO: Remove unused remote patterns
const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
      {
        protocol: "https",
        hostname: "huglsqigxejnqziwrobf.supabase.co",
      },
    ],
  },
};

export default nextConfig;
