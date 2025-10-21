import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // ✅ Don't block builds for lint errors
  },
  experimental: {
    optimizeCss: false, // 🚫 Disable LightningCSS optimization
  },
};

export default nextConfig;
