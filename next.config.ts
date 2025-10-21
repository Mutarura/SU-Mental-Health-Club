import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // ✅ Prevents build from failing due to lint errors
  },
};

export default nextConfig;
