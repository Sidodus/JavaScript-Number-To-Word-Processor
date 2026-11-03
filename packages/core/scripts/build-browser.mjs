/**
 * Browser bundle build: produces the single drop-in `<script>` file
 * `JSnumberToWordProcessor.js` at the package root - the same artifact name
 * v3 published, with the global exposed as the BARE callable
 * (`JSnumberToWordProcessor(...)`), exactly like v3.
 *
 * Uses esbuild directly (not tsup's iife format) because tsup wraps iife
 * exports in __toCommonJS, which would make the global an object with a
 * `.default` key instead of the callable itself.
 */
import { build } from "esbuild";
import { copyFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const coreRoot = join(dirname(fileURLToPath(import.meta.url)), "..");

await build({
  entryPoints: [join(coreRoot, "src", "umd.ts")],
  bundle: true,
  format: "iife",
  globalName: "JSnumberToWordProcessor",
  outfile: join(coreRoot, "dist", "JSnumberToWordProcessor.global.js"),
  sourcemap: true,
  target: "es2020",
  // Deterministic global shape: whatever esbuild assigned (bare value or
  // namespace object), normalize so the global is the bare callable.
  footer: {
    js: [
      ";if (typeof JSnumberToWordProcessor === 'object' && JSnumberToWordProcessor !== null",
      "    && typeof JSnumberToWordProcessor.default === 'function') {",
      "  JSnumberToWordProcessor = JSnumberToWordProcessor.default;",
      "}",
    ].join("\n"),
  },
});

const built = join(coreRoot, "dist", "JSnumberToWordProcessor.global.js");
const target = join(coreRoot, "JSnumberToWordProcessor.js");
copyFileSync(built, target);

if (!existsSync(target)) {
  console.error(`Browser bundle missing after copy: ${target}`);
  process.exit(1);
}
console.log(`Browser bundle -> ${target}`);
