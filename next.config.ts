import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "picsum.photos", pathname: "/**" },
      { protocol: "https", hostname: "cdn.dummyjson.com", pathname: "/**" },
      // Supabase Storage for wardrobe images (Try-On canvas crossOrigin)
      { protocol: "https", hostname: "*.supabase.co", pathname: "/**" },
      // Supabase pooler / CDN urls
      { protocol: "https", hostname: "*.supabase.com", pathname: "/**" },
    ],
  },
};

export default nextConfig;
