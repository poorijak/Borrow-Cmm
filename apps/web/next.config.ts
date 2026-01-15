import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  typescript: {
    ignoreBuildErrors: true,
  },
  transpilePackages: ["@repo/types"],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "pub-fc617485688f4d8882eb3b12e10bad97.r2.dev",
        pathname: "/**",
      },
    ],
  },
};

export default nextConfig;
