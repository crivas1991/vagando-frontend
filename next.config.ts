import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  cacheComponents: true,
  partialPrefetching: true,
  images: {
    // Dominios externos permitidos para next/image (AGENTS.md 4.4).
    remotePatterns: [
      new URL('https://flags.restcountries.com/v5/**'),
      // Fotos de lugares (Geoapify/OpenStreetMap) que apuntan a Wikimedia Commons.
      new URL('https://upload.wikimedia.org/**'),
    ],
  },
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
