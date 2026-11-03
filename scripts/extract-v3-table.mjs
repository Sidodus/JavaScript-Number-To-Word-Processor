/**
 * Extracts the illion-name lookup table hard-coded in the legacy v3 scripts
 * (legacy/JSnumberToWordProcessor.js for lengths 4-102 and
 * legacy/curStrLengthFunc_2.js for lengths 103-33003) into a JSON fixture.
 *
 * The fixture is the golden oracle used by the v4 test-suite to prove that the
 * algorithmic Conway-Wechsler generator reproduces every published v3 name.
 *
 * Usage: node scripts/extract-v3-table.mjs
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const fixturesDir = join(root, "packages", "core", "test", "fixtures");

const files = [
  join(root, "legacy", "JSnumberToWordProcessor.js"),
  join(root, "legacy", "curStrLengthFunc_2.js"),
];

/**
 * Matches one ternary arm of the legacy lookup, e.g.
 *   curStrLengthFunc >= 103 && curStrLengthFunc <= 105 ? (largeNumbers = "Trestrigintillion")
 * The legacy source uses >= and <= exclusively for the range bounds.
 */
const armPattern =
  /(?:\w+\s*>=\s*(\d+)\s*&&\s*\w+\s*<=\s*(\d+)|\w+\s*===?\s*(\d+))\s*\?\s*\(?\s*largeNumbers\s*=\s*"([A-Za-z-]+)"/g;

/** @type {Record<number, string>} */
const table = {};

for (const file of files) {
  const source = readFileSync(file, "utf8");
  let match;
  while ((match = armPattern.exec(source)) !== null) {
    const [, loStr, hiStr, eqStr, name] = match;
    const lo = loStr !== undefined ? Number(loStr) : Number(eqStr);
    const hi = hiStr !== undefined ? Number(hiStr) : Number(eqStr);
    for (let length = lo; length <= hi; length++) {
      if (table[length] !== undefined && table[length] !== name) {
        throw new Error(
          `Conflicting names for length ${length}: "${table[length]}" vs "${name}" (${file})`,
        );
      }
      table[length] = name;
    }
  }
}

const lengths = Object.keys(table)
  .map(Number)
  .sort((a, b) => a - b);
const gaps = [];
for (let i = 1; i < lengths.length; i++) {
  if (lengths[i] !== lengths[i - 1] + 1) {
    gaps.push(`${lengths[i - 1]} -> ${lengths[i]}`);
  }
}

const fixture = {
  meta: {
    extractedFrom: files.map((f) => f.split(/[\\/]/).pop()),
    coverage: `${lengths[0]}..${lengths[lengths.length - 1]}`,
    entries: lengths.length,
    gaps,
    note: "Length = digit count of the whole part; value = scale word v3 assigns to that length.",
  },
  table,
};

mkdirSync(fixturesDir, { recursive: true });
const outPath = join(fixturesDir, "v3-illion-table.json");
writeFileSync(outPath, `${JSON.stringify(fixture, null, 2)}\n`, "utf8");

console.log(`Extracted ${lengths.length} entries (${lengths[0]}..${lengths[lengths.length - 1]})`);
console.log(`Gaps in coverage: ${gaps.length ? gaps.join(", ") : "none"}`);
console.log(`Wrote ${outPath}`);
