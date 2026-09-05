import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  serverExternalPackages: ["pdf-parse"],
  experimental: {
    serverActions: {
      bodySizeLimit: "10mb",
    },
  },
  webpack: (config, { isServer }) => {
    if (isServer) {
      // Prevent pdf-parse from being bundled — it reads test files from disk at require-time
      // which causes Vercel build failures. It is handled via serverExternalPackages above.
      config.externals = [...(config.externals || []), "pdf-parse"];
    }
    return config;
  },
};

export default nextConfig;
