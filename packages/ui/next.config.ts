import type { NextConfig } from "next";

/**
 * Static export keeps the UI deployable to GitHub Pages exactly like the v3
 * index.html was. Set NEXT_PUBLIC_BASE_PATH when building for a project page
 * (e.g. https://sidodus.github.io/JavaScript-Number-To-Word-Processor/).
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  ...(basePath ? { basePath, assetPrefix: basePath } : {}),
  images: {
    // Static export has no image optimization server.
    unoptimized: true,
  },
  eslint: {
    // Linting is owned by the repo root flat config (`npm run lint`); the
    // built-in next lint runner is legacy and incompatible with it.
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
