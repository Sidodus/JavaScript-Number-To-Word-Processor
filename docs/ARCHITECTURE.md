# Architecture — JSnumberToWordProcessor v4

## 1. Design principles

1. **Exactness is the product.** A number-to-words library that says the wrong
   place value is worse than useless. Every conversion operates on exact digit
   strings and `BigInt`; floating point is never used for value math. JS
   `number` inputs are converted through their shortest round-trip string
   (documented honest representation — callers needing exactness pass strings
   or `bigint`).
2. **Display and words always agree** (see `AGENTS.md` §3 invariants).
3. **Pure, dependency-free core.** No runtime dependencies, no I/O, no global
   mutable state (v3's shared `largeNumbers` variable was a real bug source —
   see `BUG_AUDIT_v3.md` bug 11).
4. **Fail loudly.** Typed errors with actionable messages; `lenient` mode is
   an explicit opt-in, not the default.

## 2. Module map (`packages/core/src/`)

```
index.ts      Public API: default + named export, error classes, constants.
umd.ts        Browser entry: single default export -> IIFE global callable.
types.ts      ProcessedNumber, NumberInput, ProcessOptions, ProcessResult.
errors.ts     NumberToWordError base; InvalidNumberError; NumberTooLargeError; InvalidOptionsError.
parse.ts      Input normalization: strings/numbers/bigints/booleans -> ParsedNumber
              { negative, whole, decimals }. Exponent expansion, sign rules,
              leading-zero normalization, size limit check.
format.ts     groupDigits(): comma grouping in threes, right-anchored (used by
              both the whole part and the point-anchored decimal part).
scales.ts     "Zero".."Ninety-Nine" small-number words.
illions.ts    Algorithmic Conway-Wechsler generator: illionName(n) for n >= 1
              (Million = 1, 10^(3n+3)). Replaces the legacy 1.3MB lookup.
ordinals.ts   decimalPlaceOrdinal(place, singular): tenths .. undecillinillionths (1..33003).
words.ts      wholePartToWords(digits): group splitting, scale words,
              British "and" rules (ADR-001).
process.ts    Orchestrator: option validation, strict/lenient array handling,
              exact half-up string rounding with carry, result assembly.
```

Data flow for one input:

```
NumberInput
  └─ parse.ts ──► ParsedNumber { negative, whole: "5876", decimals: "985876950" }
       └─ process.ts
            ├─ roundDecimalDigits(decimals, places) ─► { digits, carry }   (exact, half-up)
            ├─ addCarry(whole, carry)                                (BigInt +1)
            ├─ words.ts ──► whole words (groups + illionName scales + "and" rules)
            ├─ words.ts ──► decimal digit words (value of kept digits)
            ├─ ordinals.ts ─► place ordinal ("hundred-thousandths")
            └─ format.ts ──► grouped display strings
                 └─► ProcessedNumber (displayNum, displayWord, 7 more fields)
```

## 3. Rounding semantics (exact, half-up)

Given decimal digits `D` and requested places `p`:

- Keep `D[0..p)` padded with zeros to length `p`.
- If the first dropped digit is ≥ 5, increment the kept string as a BigInt.
  - Overflow beyond `p` digits (e.g. `0.999 @2`) carries into the whole part
    and the decimal part is dropped.
- If the kept digits are all zeros, the decimal part is dropped.
- `p = 0` rounds to a whole number from the first decimal digit.
- Whole-number inputs (no decimal point) ignore `decimalPlaces` (v3 parity).

Examples: `0.995 @2 → 1` · `0.994 @2 → 0.99` · `999.999 @2 → 1,000 (One Thousand)` ·
`123.456 @0 → 123` · `123.999 @0 → 124`.

## 4. Word engine rules

- Split the canonical whole string into 3-digit groups (little-endian index:
  0 = units, 1 = thousands, 2 = millions, ...).
- Group word: `X Hundred and YY` / `X Hundred` / `YY` (empty groups skipped).
- Scale word: index 1 → "Thousand"; index i ≥ 2 → `illionName(i - 1)`.
- Final "and": when ≥ 1 higher group was spoken and the last spoken group is a
  bare value < 100, join it with " and " (no comma) — "Nine Thousand and
  Twelve". Exact hundreds stay comma-joined — "One Thousand, One Hundred".
- Decimal words: the value of the kept digits ("00,012" → "Twelve"), then the
  place ordinal from `decimalPlaceOrdinal(places)`. Value 1 → singular.

## 5. Conway-Wechsler generator (replaces 1.3MB lookup)

`illions.ts` composes names from unit/tens/hundreds segments with
letter-insertion rules (see `CONWAY_WECHSLER.md` for the full rule set and
provenance). Verified entry-for-entry against the v3-published table for all
33,000 supported digit lengths (golden test). ~19.6KB total bundle vs v3's
~755KB of scripts.

## 6. Result object (v3-compatible shape)

`ProcessedNumber` keeps v3's field names; see `API_REFERENCE.md` for the
filled-in semantics of each field and worked examples.

## 7. UI architecture (`packages/ui`)

- Next.js 15 App Router, **static export** (`output: "export"` → `out/`).
- `app/page.tsx` (server) renders `components/NumberToWordConsole.tsx`
  (client) which owns: decimal length state (session-persisted, key
  `decimalPlaceLength`), result state (session-persisted, keys
  `display2Document` / `arrOfNum`), and error surfaces.
- `components/DecimalLengthControl.tsx` — validated control (0..33003, no
  negatives; the v3 UI bug fix).
- `components/NumberForms.tsx` — single number + array forms; calls the core
  directly in the browser (no network).
- `components/ResultCard.tsx` / `ResultList.tsx` — v3 visual identity
  (red `-`, tomato `(dot)`, gray ordinal unit; custom properties in
  `app/globals.css`).
- Session-storage reads are client-only (`useEffect`) and defensive (may
  contain v3-era junk).

## 8. Repository layout

```
├── AGENTS.md                  # Agent operating manual (start here)
├── docs/                      # Source of truth documentation
├── legacy/                    # Frozen v3.0.4 sources (read-only)
├── scripts/extract-v3-table.mjs
├── packages/
│   ├── core/                  # npm: js-number-to-word-processor (v4)
│   │   ├── src/               # TypeScript sources (module map above)
│   │   ├── test/              # unit / regression / golden + fixtures
│   │   ├── scripts/build-browser.mjs
│   │   └── dist/              # built ESM/CJS/d.ts (+ root IIFE bundle)
│   └── ui/                    # Next.js console (static export → out/)
├── eslint.config.cjs
├── tsconfig.base.json
└── vitest.config.ts
```

## 9. Performance notes

- The full 33003-digit conversion path is string-based; the heaviest
  operations are one BigInt increment (carry) and 11k group iterations —
  sub-200ms in tests (`illions.test.ts` perf guard).
- The IIFE bundle (19.6KB, ~6KB gzipped) replaces v3's 755KB of scripts.
