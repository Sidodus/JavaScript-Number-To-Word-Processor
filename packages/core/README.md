<h1 align="center"><ins>JavaScript Number To Word Processor</ins></h1>

<h6 align="center" style="color: grey; margin-top: -10px">
  <small>... #JSnumberToWordProcessor ... v4.1.0 ... TypeScript rewrite of the 2019 classic</small>
</h6>

<div align="center">
  <a href="https://github.com/Sidodus/JavaScript-Number-To-Word-Processor/actions/workflows/ci.yml"><img src="https://github.com/Sidodus/JavaScript-Number-To-Word-Processor/actions/workflows/ci.yml/badge.svg" alt="CI" /></a>
  <a href="https://www.npmjs.com/package/js-number-to-word-processor"><img src="https://img.shields.io/npm/v/js-number-to-word-processor" alt="npm version" /></a>
  <a href="https://www.npmjs.com/package/js-number-to-word-processor"><img src="https://img.shields.io/bundlephobia/minzip/js-number-to-word-processor" alt="minified size" /></a>
  <a href="https://github.com/Sidodus/JavaScript-Number-To-Word-Processor/blob/master/LICENSE"><img src="https://img.shields.io/npm/l/js-number-to-word-processor" alt="license" /></a>
</div>

<div align="center">
  <p><code>123,456,789,012,345,680</code> => <em>One Hundred and Twenty-Three Quadrillion, Four Hundred and Fifty-Six Trillion, Seven Hundred and Eighty-Nine Billion, Twelve Million, Three Hundred and Forty-Five Thousand, Six Hundred and Eighty.</em></p>
  <p><code>-97,000,005,430,000.<small>98,766,537,867</small></code> => <em>(negative) Ninety-Seven Trillion, Five Million, Four Hundred and Thirty Thousand (dot) Ninety-Eight Billion, Seven Hundred and Sixty-Six Million, Five Hundred and Thirty-Seven Thousand, Eight Hundred and Sixty-Seven <b>hundred-billionths</b>.</em></p>
</div>

<blockquote align="center">
  The goal of <strong>JSnumberToWordProcessor</strong> is a well formatted, human readable number with its corresponding words — exact, typed and dependency-free.
</blockquote>

---

## Highlights (v4)

- **Exact** — digit-string + BigInt arithmetic; half-up rounding with no float artifacts. Display and words always describe the same digits.
- **Huge** — standard dictionary numbers up to **10^33003** (Conway-Wechsler), generated algorithmically: the whole library is now **19.6KB** (v3 shipped ~755KB of scripts).
- **Typed** — strict TypeScript with generated `.d.ts`; ESM + CommonJS + a single-file browser bundle.
- **Honest** — typed errors (`InvalidNumberError`, `NumberTooLargeError`, `InvalidOptionsError`) instead of silent wrong output. `{ lenient: true }` restores v3's skip behavior for arrays.
- **Tested** — 101 tests including entry-for-entry equivalence with all 33,000 published v3 scale names and tombstones for 12 audited v3 bugs (`docs/BUG_AUDIT_v3.md`).
- **Modern console** — Next.js + React-Bootstrap UI with static export (GitHub Pages compatible).

## Installation

```sh
npm i js-number-to-word-processor
```

```html
<!-- Browser: one script, zero dependencies (replaces the two v3 scripts) -->
<script src=".../JSnumberToWordProcessor.js"></script>
```

## Usage

```js
// ESM / TypeScript
import JSnumberToWordProcessor from "js-number-to-word-processor";
// CommonJS
const JSnumberToWordProcessor = require("js-number-to-word-processor");
// Browser global: JSnumberToWordProcessor(...)
```

```js
JSnumberToWordProcessor("987");
// 987: Nine Hundred and Eighty-Seven

JSnumberToWordProcessor("123456789012345680");
// 123,456,789,012,345,680: One Hundred and Twenty-Three Quadrillion, Four Hundred and
// Fifty-Six Trillion, Seven Hundred and Eighty-Nine Billion, Twelve Million, Three
// Hundred and Forty-Five Thousand, Six Hundred and Eighty

JSnumberToWordProcessor(5876985876950n);
// 5,876,985,876,950: Five Trillion, Eight Hundred and Seventy-Six Billion, Nine Hundred
// and Eighty-Five Million, Eight Hundred and Seventy-Six Thousand, Nine Hundred and Fifty
```

### Decimals (second argument = decimal places, default 2)

```js
JSnumberToWordProcessor("5876.98587695");
// 5,876.99: Five Thousand, Eight Hundred and Seventy-Six (dot) Ninety-Nine hundredths

JSnumberToWordProcessor("5876.985876950", 5);
// 5,876.98,588: ... (dot) Ninety-Eight Thousand, Five Hundred and Eighty-Eight hundred-thousandths
//             ^ decimal commas anchor at the point, mirroring the "Thousand," boundaries (intentional)

JSnumberToWordProcessor("0.00012", 5);
// 0.00,012: Zero (dot) Twelve hundred-thousandths     <- v3 said "Twelve hundredths" (fixed)

JSnumberToWordProcessor("9.999", 2);
// 10: Ten                                             <- v3 said "Ten (dot) Zero hundredths" (fixed)

JSnumberToWordProcessor("0.01");
// 0.01: Zero (dot) One hundredth                      <- singular when the value is exactly 1
```

### Negatives, exponents, arrays, BigInt, booleans

```js
JSnumberToWordProcessor("-876950");
// -876,950: (negative) Eight Hundred and Seventy-Six Thousand, Nine Hundred and Fifty

JSnumberToWordProcessor("-8769.5", 1);
// -8,769.5: (negative) Eight Thousand, Seven Hundred and Sixty-Nine (dot) Five tenths

JSnumberToWordProcessor("1e21");
// 1,000,000,000,000,000,000,000: One Sextillion       <- string exponents work (v3 crashed)

JSnumberToWordProcessor(["6677", "-7674.969", "0.00"]);
// [ Six Thousand, Six Hundred and Seventy-Seven,
//   (negative) Seven Thousand, Six Hundred and Seventy-Four (dot) Ninety-Seven hundredths,
//   Zero ]

JSnumberToWordProcessor(55 > 26); // 1: One   (boolean legacy compatibility)
JSnumberToWordProcessor(555n * 111n); // 61,605: Sixty-One Thousand, Six Hundred and Five
```

> **Tip:** pass `string` or `bigint` beyond `2^53 - 1` for exactness — JS
> numbers are converted through their shortest round-trip representation.

### Options

```js
JSnumberToWordProcessor(input, { decimalPlaces: 4 }); // integer 0..33003; default 2; 0 = whole
JSnumberToWordProcessor(arrayInput, { lenient: true }); // skip invalid entries (default: throw)
```

### New in 4.1 — currency, styles, ordinals, locales

```js
// Money words (check-writing ready)
JSnumberToWordProcessor("1234.56", {
  currency: { major: "Naira", majorPlural: "Naira", minor: "Kobo" },
});
// 1,234.56: One Thousand, Two Hundred and Thirty-Four Naira, Fifty-Six Kobo

// American style (no "and")
JSnumberToWordProcessor("123456789", { style: "american" });
// One Hundred Twenty-Three Million, Four Hundred Fifty-Six Thousand, Seven Hundred Eighty-Nine

// Ordinals
JSnumberToWordProcessor("21", { output: "ordinal" }); // 21: Twenty-First

// Locales (en built in; register your own)
JSnumberToWordProcessor("987", { locale: "en" });
```

Invalid input throws a descriptive, typed error — see
[`docs/API_REFERENCE.md`](https://github.com/Sidodus/JavaScript-Number-To-Word-Processor/blob/master/docs/API_REFERENCE.md) for the complete contract.

## The UI console

`packages/ui` is a Next.js 15 + React-Bootstrap 5 quick-usage app:

```sh
npm install
npm run build        # builds core, then ui
npm run dev:ui       # develop at http://localhost:3000
```

`npm run build:ui` produces a static export in `packages/ui/out` (GitHub
Pages ready; set `NEXT_PUBLIC_BASE_PATH` for project subpaths). The UI
validates the decimal length (0..33003 — negatives are rejected), accepts
pasted numbers of any size, and surfaces every library error loudly.

## Documentation

| Doc | Contents |
|-----|----------|
| [`docs/API_REFERENCE.md`](https://github.com/Sidodus/JavaScript-Number-To-Word-Processor/blob/master/docs/API_REFERENCE.md) | Full API contract, options, errors, worked examples |
| [`docs/MIGRATION_v3_to_v4.md`](https://github.com/Sidodus/JavaScript-Number-To-Word-Processor/blob/master/docs/MIGRATION_v3_to_v4.md) | Every behavior change + upgrade checklist |
| [`docs/BUG_AUDIT_v3.md`](https://github.com/Sidodus/JavaScript-Number-To-Word-Processor/blob/master/docs/BUG_AUDIT_v3.md) | The 12 v3 defects, with evidence and v4 fixes |
| [`docs/ARCHITECTURE.md`](https://github.com/Sidodus/JavaScript-Number-To-Word-Processor/blob/master/docs/ARCHITECTURE.md) | Module map, rounding semantics, word rules |
| [`docs/CONWAY_WECHSLER.md`](https://github.com/Sidodus/JavaScript-Number-To-Word-Processor/blob/master/docs/CONWAY_WECHSLER.md) | The naming system and its verification |
| [`docs/TESTING_STRATEGY.md`](https://github.com/Sidodus/JavaScript-Number-To-Word-Processor/blob/master/docs/TESTING_STRATEGY.md) | The 101-test suite and how to extend it |
| [`docs/DECISIONS.md`](https://github.com/Sidodus/JavaScript-Number-To-Word-Processor/blob/master/docs/DECISIONS.md) | Decision records (ADR-001…007) |
| [`docs/CHANGELOG.md`](https://github.com/Sidodus/JavaScript-Number-To-Word-Processor/blob/master/docs/CHANGELOG.md) | Full history |
| [`AGENTS.md`](https://github.com/Sidodus/JavaScript-Number-To-Word-Processor/blob/master/AGENTS.md) | Operating manual for AI/dev agents |

## Development

```sh
npm test          # Vitest (core + UI)
npm run lint      # ESLint (flat config)
npm run typecheck # tsc in all workspaces
npm run build     # core (ESM/CJS/IIFE) then UI (static export)
npm run verify    # all of the above
```

The suite includes golden equivalence against the published v3 lookup table
(`node scripts/extract-v3-table.mjs` regenerates the fixture) and regression
locks for every audited v3 bug. See [`docs/TESTING_STRATEGY.md`](https://github.com/Sidodus/JavaScript-Number-To-Word-Processor/blob/master/docs/TESTING_STRATEGY.md).

## Install From

- NPM: <https://www.npmjs.com/package/js-number-to-word-processor>
- GitHub: <https://github.com/Sidodus/JavaScript-Number-To-Word-Processor>
- UI: <https://sidodus.github.io/JavaScript-Number-To-Word-Processor>
- Live console: build locally with `npm run dev:ui`, or deploy `packages/ui/out`

---

> JavaScript Number To Word Processor is developed by [Saheed Odulaja](https://www.linkedin.com/in/saheed-odulaja-75111337).
> Feel free to fork this repository.
> Also be kind enough to leave a STAR 🌟 as a mark of encouragement 😃.
