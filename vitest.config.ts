import { defineConfig } from "vitest/config";

export default defineConfig({
  esbuild: {
    // Match the Next.js automatic JSX runtime for .tsx test files.
    jsx: "automatic",
  },
  test: {
    include: ["packages/*/test/**/*.test.ts", "packages/*/test/**/*.test.tsx"],
    environment: "node",
    globals: true, // Required for Testing Library's automatic cleanup between tests.
    environmentMatchGlobs: [
      ["packages/ui/test/**/*.test.tsx", "jsdom"],
      ["packages/ui/test/**/*.test.ts", "jsdom"],
    ],
    coverage: {
      provider: "v8",
      include: ["packages/core/src/**/*.ts"],
      exclude: ["packages/core/src/umd.ts"],
    },
  },
});
