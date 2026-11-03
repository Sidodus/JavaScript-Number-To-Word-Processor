/**
 * Locale contract validator (ADR-008).
 *
 * Structural validation of every registered locale. Run after building core:
 *
 *   node scripts/validate-locale.mjs --all
 *   node scripts/validate-locale.mjs --code fr
 *
 * Community locale PRs must pass this gate. It proves the SHAPE of a locale
 * (word tables complete and unique, hooks callable); semantic correctness is
 * proven by the locale's own sample tests (see docs/LOCALES.md checklist).
 */
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const args = process.argv.slice(2);
const wantsAll = args.includes("--all");
const codeIndex = args.indexOf("--code");
const wantsCode = codeIndex !== -1 ? args[codeIndex + 1] : null;

if (!wantsAll && wantsCode === null) {
  console.error("Usage: node scripts/validate-locale.mjs --all | --code <locale>");
  process.exit(1);
}

const { localeCodes, getLocale } = await import(
  new URL("../packages/core/dist/index.js", import.meta.url).href
);

/** @returns {string[]} list of violations for one locale */
function validateLocale(locale) {
  const errors = [];
  const fail = (message) => errors.push(message);

  for (const field of ["code", "zeroWord", "hundredWord", "thousandWord", "negativePrefix", "dotSeparator"]) {
    const value = locale[field];
    if (typeof value !== "string" || value.trim().length === 0) {
      fail(`${field} must be a non-empty string, received ${JSON.stringify(value)}`);
    }
  }

  if (locale.andStyle !== "british" && locale.andStyle !== "american") {
    fail(`andStyle must be "british" or "american", received ${JSON.stringify(locale.andStyle)}`);
  }

  const small = locale.smallNumbers;
  if (!Array.isArray(small) || small.length !== 100) {
    fail(`smallNumbers must contain exactly 100 entries (0..99), received ${Array.isArray(small) ? small.length : typeof small}`);
    return errors;
  }
  if (small[0] !== locale.zeroWord) {
    fail(`smallNumbers[0] must equal zeroWord (${JSON.stringify(locale.zeroWord)})`);
  }
  const seen = new Map();
  small.forEach((word, value) => {
    if (typeof word !== "string" || word.trim().length === 0) {
      fail(`smallNumbers[${value}] is empty or not a string`);
      return;
    }
    if (word !== word.trim()) {
      fail(`smallNumbers[${value}] has leading/trailing whitespace: ${JSON.stringify(word)}`);
    }
    if (seen.has(word)) {
      fail(`smallNumbers[${value}] duplicates ${seen.get(word)}: ${JSON.stringify(word)}`);
    }
    seen.set(word, value);
  });

  for (const hook of ["scaleWordFor", "scaleWord", "hundredPhraseFor", "thousandPhraseFor", "ordinalize"]) {
    if (locale[hook] !== undefined && typeof locale[hook] !== "function") {
      fail(`${hook} must be a function when provided`);
    }
  }

  if (typeof locale.ordinalize === "function") {
    const probeCardinals = ["0", "1", "2", "8", "21"];
    for (const digits of probeCardinals) {
      const index = Number(digits);
      const cardinal = small[index] ?? locale.zeroWord;
      try {
        const ordinal = locale.ordinalize(cardinal);
        if (typeof ordinal !== "string" || ordinal.trim().length === 0) {
          fail(`ordinalize(${JSON.stringify(cardinal)}) returned a non-string/empty value`);
        }
      } catch (error) {
        fail(`ordinalize(${JSON.stringify(cardinal)}) threw: ${String(error)}`);
      }
    }
  }

  return errors;
}

const targets = wantsAll ? localeCodes() : [wantsCode];
let failed = false;

for (const code of targets) {
  let locale;
  try {
    locale = getLocale(code);
  } catch (error) {
    console.error(`✖ ${code}: ${error instanceof Error ? error.message : String(error)}`);
    failed = true;
    continue;
  }
  const errors = validateLocale(locale);
  if (errors.length === 0) {
    console.log(`✔ ${code}: contract OK (${locale.smallNumbers.length} small-number words, style=${locale.andStyle})`);
  } else {
    failed = true;
    console.error(`✖ ${code}: ${errors.length} contract violation(s):`);
    for (const message of errors) {
      console.error(`   - ${message}`);
    }
  }
}

if (failed) {
  process.exit(1);
}
