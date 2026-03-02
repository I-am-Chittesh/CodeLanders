import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* Config options here */
  experimental: {
    // Required if you use specific Next 15 features
  },
  // Suppress hydration warnings during the demo (helpful for AI-generated text)
  reactStrictMode: true,
};

export default nextConfig;
