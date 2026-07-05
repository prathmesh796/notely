import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  transpilePackages: ["@repo/ui", "@repo/tailwind-config", "@repo/eslint-config", "@repo/typescript-config"],
};

export default nextConfig;
