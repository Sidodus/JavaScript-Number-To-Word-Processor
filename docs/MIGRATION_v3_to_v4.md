# Migration Guide — v3 → v4

v4 is a ground-up TypeScript rewrite of the 2019 v3 library. The call
signature and the result-object shape are preserved, so most consumers
upgrade with **zero code changes**. Some **outputs changed on purpose** —
v3 contained real conversion bugs (see `BUG_AUDIT_v3.md`) — and the error
behavior is now strict.

## 1. Quick compatibility check

| v3 usage | v4 status |
|----------|-----------|
| `N("987")`, `N(987.5)`, `N(555n)`, `N([..])` | ✅ identical results |
| `N(input, decimalPlace)` number shorthand | ✅ identical for valid values |
| `result.displayNum / displayWord / ...` (all 9 fields) | ✅ same field names |
| Booleans as input (`N(55 > 26)`) | ✅ preserved (true → 1) |
| `(negative)`, `(dot)`, `hundredths` vocabulary | ✅ preserved |
| Whole-part comma grouping | ✅ preserved |
| Decimal comma grouping (`98,588`) | ✅ preserved — now documented & tested |

## 2. Output changes (bug fixes — the reason for the major bump)

| Input | v3 | v4 |
|-------|----|----|
| `0.0005, 4` | "Five tenths" | **"Five ten-thousandths"** (place-value fix) |
| `26.00002, 5` | "Two tenths" | **"Two hundred-thousandths"** |
| `9.999, 2` | "Ten (dot) Zero hundredths" | **"Ten"** (display `10`, not `10.00`) |
| `0.995, 2` | "0.99" | **"1"** (exact half-up rounding) |
| `.5` | display `0.50`, words "Fifty tenths" | **display `0.50`, words "Fifty hundredths"** (they now agree) |
| `"1e21"` (string) | RangeError crash | **"One Sextillion"** |
| `2**70` | "One (dot) Zero hundredths" | **its honest value in words** |
| `"-0"` | "(negative) Zero" | **"Zero"** |
| `"5."`, `"0.00"` | "Five (dot) Zero " | **"Five" / "Zero"** |
| `9012` | "Nine Thousand, and Twelve" | **"Nine Thousand and Twelve"** (standard British; ADR-001) |
| `0.01` | "One tenths" (always plural) | **"One hundredth"** (singular when value is 1) |
| `>33003` digits | displayWord "SORRY..." | **throws `NumberTooLargeError`** |

**Action for consumers:** if your tests assert on v3 strings for any of these
classes of input, update the expectations. Everything else is byte-identical
(see `packages/core/test/golden/v3-parity.test.ts`).

## 3. Error behavior changes

| v3 | v4 |
|----|----|
| `""` → "Zero" silently | throws `InvalidNumberError` |
| `"abc"` in an array → silently dropped | throws with `at index N`; pass `{ lenient: true }` to restore v3 skipping |
| `null` / `Infinity` → raw TypeError/RangeError | typed `InvalidNumberError` with guidance |
| negative `decimalPlace` → silently 2 | throws `InvalidOptionsError` |

**Action:** wrap calls in try/catch (or pre-validate UI input). Arrays of
untrusted data that previously relied on silent filtering should pass
`{ lenient: true }`.

## 4. Packaging changes

- **Module formats:** v4 ships true ESM (`dist/index.js`), CJS
  (`dist/index.cjs`) and TypeScript types (`dist/index.d.ts`). AMD support is
  dropped (v3's AMD branch was untestable and unused).
- **Browser usage:** the drop-in file is now a SINGLE script —
  `JSnumberToWordProcessor.js` (19.6KB). `curStrLengthFunc_2(.min).js` is no
  longer needed or shipped; the 1.3MB lookup table was replaced by an
  algorithmic Conway-Wechsler generator verified equivalent
  (`CONWAY_WECHSLER.md`).
  ```html
  <!-- v3: two scripts -->                 <!-- v4: one script -->
  <script src="curStrLengthFunc_2.min.js"></script>
  <script src="JSnumberToWordProcessor.js"></script>
  ```
- `main`/`exports`/`types` fields point at the built files; the callable
  global for `<script>` usage is unchanged (`JSnumberToWordProcessor(...)`).

## 5. Semantic decisions to be aware of

1. **Requested decimalPlaces wins.** Digits shown = digits described. `0.5`
   with `decimalPlaces: 5` → `0.50,000` / "Fifty Thousand hundred-thousandths".
   v3's default-2 path produced mismatched display/words.
2. **All-zero decimals vanish.** `26.00000232 @5` → `26` / "Twenty-Six"
   (v3 fell back to `.00` with junk words).
3. **Rounding is half-up on the exact digit string**, applied to the requested
   place even below the input's own precision (`123.456 @0` → `123`).
4. **Whole inputs ignore `decimalPlaces`** (unchanged from v3).

## 6. UI (quick-usage console)

Rebuilt on Next.js 15 + React-Bootstrap 5 (static export, GitHub Pages
compatible). Behavior changes:

- "Change Decimal Length" **rejects negative/non-integer/>33003 values** with
  inline feedback (v3 accepted negatives silently).
- Inputs are text-based — you can paste numbers of any size and `"1e21"`-style
  values (v3's `type="number"` mangled long input).
- Invalid input shows a descriptive alert instead of being silently ignored.
- Result styling keeps the v3 identity (red negative, tomato dot, gray unit).
- Session keys are v3-compatible; stale v3 values are handled defensively.

## 7. Upgrade checklist

1. `npm i js-number-to-word-processor@^4.0.0`
2. Remove `curStrLengthFunc_2.min.js` from any HTML pages.
3. Search your tests for the changed-output classes in §2.
4. If you filtered array inputs yourself, consider the new strict errors or
   `{ lenient: true }`.
5. TypeScript consumers: the types are now generated from source — replace
   any hand-written `ProcessedNumber` interface with the exported one.
