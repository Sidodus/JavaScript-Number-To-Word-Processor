import react from "@vitejs/plugin-react";
import { defineConfig } from "vitest/config";

export default defineConfig({
  // Vitest's Rolldown-based transform ignores esbuild.jsx - the React plugin
  // handles JSX for .tsx test files with the automatic runtime.
  plugins: [react()],

  test: {
    globals: true, // Required for Testing Library's automatic cleanup between tests.
    coverage: {
      provider: "v8",
      include: ["packages/core/src/**/*.ts"],
      exclude: [
        "packages/core/src/umd.ts",
        // Type-only files carry no runtime code.
        "packages/core/src/types.ts",
        "packages/core/src/locales/types.ts",
        "**/*.d.ts",
      ],
      thresholds: {
        lines: 90,
        functions: 90,
        branches: 85,
        statements: 90,
      },
    },
    // Vitest 5 removed environmentMatchGlobs - use projects instead.
    projects: [
      {
        test: {
          name: "core",
          include: ["packages/core/test/**/*.test.ts"],
          environment: "node",
        },
      },
      {
        test: {
          name: "ui",
          include: ["packages/ui/test/**/*.test.ts", "packages/ui/test/**/*.test.tsx"],
          environment: "jsdom",
        },
      },
    ],
  },
});
