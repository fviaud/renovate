import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  // Génère .next/standalone (serveur minimal) pour l'image Docker
  output: "standalone",
  cacheComponents: true,
  partialPrefetching: true,
  turbopack: {
    rules: {
      "*.css": {
        loaders: ["@tailwindcss/turbopack"],
        as: "*.css",
      },
    },
  },
};

export default nextConfig;
