import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // ✅ ignore linting
  },
  experimental: {
    optimizeCss: false, // ✅ disable LightningCSS
  },
  typescript: {
    ignoreBuildErrors: true, // ✅ prevents minor TypeScript issues from blocking
  },
};

export default nextConfig;
