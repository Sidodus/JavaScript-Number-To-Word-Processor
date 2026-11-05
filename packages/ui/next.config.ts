import type { NextConfig } from "next";

/**
 * Static export keeps the UI deployable to GitHub Pages exactly like the v3
 * index.html was. Set NEXT_PUBLIC_BASE_PATH when building for a project page
 * (e.g. https://sidodus.github.io/JavaScript-Number-To-Word-Processor/).
 * Note (Next 16): the built-in eslint key was removed upstream - linting is
 * owned entirely by the repo root flat config (`npm run lint`).
 */
const basePath = process.env.NEXT_PUBLIC_BASE_PATH ?? "";

const nextConfig: NextConfig = {
  output: "export",
  ...(basePath ? { basePath, assetPrefix: basePath } : {}),
  images: {
    // Static export has no image optimization server.
    unoptimized: true,
  },
};

export default nextConfig;
