/**
 * Algorithmic Conway-Wechsler illion-name generator.
 *
 * Replaces the legacy 1.3MB hard-coded lookup (curStrLengthFunc_2.js) with
 * ~200 lines of pure string logic that produces the exact same names for
 * every supported scale. Verified entry-by-entry against the extracted v3
 * table by test/golden/illionTableEquivalence.test.ts (33,000 lengths).
 *
 * Naming rules follow https://www.mrob.com/pub/math/largenum.html
 * (Conway & Guy system, Miakinen's "quin" amendment, as adopted by v3).
 *
 * Convention: `illionName(1)` = "Million", `illionName(2)` = "Billion",
 * i.e. n-th illion = 10^(3n + 3). "Thousand" is NOT an illion and is handled
 * separately by words.ts (scale index 1).
 */

/** Basic roots for bare unit scales (million, billion, ... nonillion). */
const UNIT_SCALES: readonly string[] = [
  "mi",
  "bi",
  "tri",
  "quadri",
  "quinti",
  "sexti",
  "septi",
  "octi",
  "noni",
];

/**
 * Unit segments (the 1's column). `trailers` are the letters the segment may
 * contribute to the next segment; `tre` is handled by the special "s" rule.
 */
interface UnitSegment {
  readonly root: string;
  readonly trailers: readonly string[];
  readonly isTre?: boolean;
}

const UNIT_SEGMENTS: readonly (UnitSegment | null)[] = [
  null, // index 0: no units digit
  { root: "un", trailers: [] },
  { root: "duo", trailers: [] },
  { root: "tre", trailers: ["s"], isTre: true },
  { root: "quattuor", trailers: [] },
  { root: "quin", trailers: [] },
  { root: "se", trailers: ["s", "x"] },
  { root: "septe", trailers: ["m", "n"] },
  { root: "octo", trailers: [] },
  { root: "nove", trailers: ["m", "n"] },
];

/** Tens segments (the 10's column) with their leading marker sets. */
const TENS_SEGMENTS: readonly (readonly string[] | null)[] = [
  null, // index 0
  ["n"], // 10 deci
  ["m", "s"], // 20 viginti
  ["n", "s"], // 30 triginta
  ["n", "s"], // 40 quadraginta
  ["n", "s"], // 50 quinquaginta
  ["n"], // 60 sexaginta
  ["n"], // 70 septuaginta
  ["m", "x"], // 80 octoginta
  [], // 90 nonaginta
];

const TENS_ROOTS: readonly string[] = [
  "",
  "deci",
  "viginti",
  "triginta",
  "quadraginta",
  "quinquaginta",
  "sexaginta",
  "septuaginta",
  "octoginta",
  "nonaginta",
];

/** Hundreds segments (the 100's column) with their leading marker sets. */
const HUNDREDS_SEGMENTS: readonly (readonly string[] | null)[] = [
  null, // index 0
  ["n", "x"], // 100 centi
  ["n"], // 200 ducenti
  ["n", "s"], // 300 trecenti
  ["n", "s"], // 400 quadringenti
  ["n", "s"], // 500 quingenti
  ["n"], // 600 sescenti
  ["n"], // 700 septingenti
  ["m", "x"], // 800 octingenti
  [], // 900 nongenti
];

const HUNDREDS_ROOTS: readonly string[] = [
  "",
  "centi",
  "ducenti",
  "trecenti",
  "quadringenti",
  "quingenti",
  "sescenti",
  "septingenti",
  "octingenti",
  "nongenti",
];

/** Segments are joined in the order: units, tens, hundreds (e.g. 996 -> se|nonaginta|nongenti). */
function firstIntersection(letters: readonly string[], markers: readonly string[]): string {
  for (const letter of letters) {
    if (markers.includes(letter)) {
      return letter;
    }
  }
  return "";
}

/** Strips a single trailing vowel per the Conway-Wechsler assembly rule. */
function stripFinalVowel(root: string): string {
  return /[aeiou]$/.test(root) ? root.slice(0, -1) : root;
}

/**
 * Builds the raw root for a 3-digit chunk of the scale index (1..999).
 * Returns e.g. "trestrigint" for 333, "senonagintanongent" for 996.
 * Bare units (1-9) return the base scale root ("mi", "bi", ...) with its
 * final vowel kept - the caller decides between "llion" and "illi".
 */
function chunkRoot(chunk: number): string {
  if (chunk < 10) {
    return UNIT_SCALES[chunk - 1] as string;
  }
  const units = chunk % 10;
  const tens = Math.floor(chunk / 10) % 10;
  const hundreds = Math.floor(chunk / 100);

  let assembled = "";

  if (units > 0) {
    const unit = UNIT_SEGMENTS[units] as UnitSegment;
    const tensMarkers = tens > 0 ? (TENS_SEGMENTS[tens] as readonly string[]) : [];
    const hundredsMarkers =
      hundreds > 0 && tens === 0 ? (HUNDREDS_SEGMENTS[hundreds] as readonly string[]) : [];
    const nextMarkers = tens > 0 ? tensMarkers : hundredsMarkers;

    let inserted = "";
    if (unit.isTre === true) {
      // Special "tre" rule: insert "s" when the following part carries s or x.
      if (nextMarkers.includes("s") || nextMarkers.includes("x")) {
        inserted = "s";
      }
    } else {
      inserted = firstIntersection(unit.trailers, nextMarkers);
    }
    assembled += unit.root + inserted;
  }

  if (tens > 0) {
    assembled += TENS_ROOTS[tens];
  }

  if (hundreds > 0) {
    assembled += HUNDREDS_ROOTS[hundreds];
  }

  return stripFinalVowel(assembled);
}

/** Capitalizes the composed name to match the library's public vocabulary ("Million", not "million"). */
function capitalize(name: string): string {
  return name.charAt(0).toUpperCase() + name.slice(1);
}

/**
 * Returns the English (short scale) Conway-Wechsler name for the n-th illion,
 * where million is n = 1 and the value of the n-th illion is 10^(3n + 3).
 *
 * Examples: 1 -> "Million", 33 -> "Trestrigintillion", 1000 -> "Millinillion",
 * 10996 -> "Decillisenonagintanongentillion" (identical to the v3 table).
 */
export function illionName(n: number): string {
  if (!Number.isInteger(n) || n < 1) {
    throw new RangeError(`illionName expects an integer >= 1, received ${n}`);
  }

  if (n < 1000) {
    return n < 10
      ? capitalize(`${UNIT_SCALES[n - 1]}llion`)
      : capitalize(`${chunkRoot(n)}illion`);
  }

  // n >= 1000: decompose into 3-digit chunks, higher chunks take the "illi"
  // connector, the final chunk takes the illion ending. Zero chunks use the
  // "nilli"/"nillion" placeholders (e.g. 1000 -> "millinillion"). The name is
  // assembled lowercase and capitalized once at the end (v3 table parity:
  // "Decillisenonagintanongentillion", not "DecilliNovenonaginta...").
  const chunks: number[] = [];
  let remaining = n;
  while (remaining > 0) {
    chunks.unshift(remaining % 1000);
    remaining = Math.floor(remaining / 1000);
  }

  let name = "";
  for (let i = 0; i < chunks.length; i++) {
    const chunk = chunks[i] as number;
    const isFinal = i === chunks.length - 1;
    if (chunk === 0) {
      name += isFinal ? "nillion" : "nilli";
    } else if (chunk < 10) {
      // Bare unit: "million".."nonillion" when final; vowel-stripped + "illi"
      // when a connector ("mi" -> "milli", "bi" -> "billi", "sexti" -> "sextilli").
      const unitScale = UNIT_SCALES[chunk - 1] as string;
      name += isFinal ? `${unitScale}llion` : `${stripFinalVowel(unitScale)}illi`;
    } else {
      name += isFinal ? `${chunkRoot(chunk)}illion` : `${chunkRoot(chunk)}illi`;
    }
  }
  return capitalize(name);
}
