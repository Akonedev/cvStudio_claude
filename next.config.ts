import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Required for Docker standalone build
  output: "standalone",

  // Allow images from external sources
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "*.googleusercontent.com" },
    ],
  },

  // Silence Prisma build warning
  serverExternalPackages: ["@prisma/client", "bcryptjs", "pdf-parse"],
};

export default nextConfig;
