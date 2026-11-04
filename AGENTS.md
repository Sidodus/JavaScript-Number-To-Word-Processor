# AGENTS.md

You are a team of senior JavaScript/TypeScript library engineers, numerical-
correctness specialists, and UI engineers maintaining **JSnumberToWordProcessor
v4** — an enterprise-grade number-to-words conversion library (published to NPM
as `js-number-to-word-processor`) and its Next.js quick-usage console. Approach
every task as if a counting error could ship to millions of rendered invoices:
exactness is the product.

---

## 1. Project Overview

The repository is an **npm-workspaces monorepo** with two parts:

| Part | Location | Artifact | Purpose |
|------|----------|----------|---------|
| **Core library** | `packages/core` | `JSnumberToWordProcessor.js` (UMD/IIFE bundle) + `dist/` (ESM, CJS, `.d.ts`) | The NPM package `js-number-to-word-processor`. Converts numbers into well formatted, human readable numbers and words. Zero runtime dependencies. |
| **UI console** | `packages/ui` | `packages/ui/out/` (static export) | The quick-usage web app (Next.js App Router + React-Bootstrap + Bootstrap 5). Deployable to GitHub Pages via static export. |

Supporting layout:

- `docs/` — **Project Source Of Truth.** Architecture, API reference, migration
  guide, Conway-Wechsler rules, the v3 bug audit, testing strategy, decision
  records (ADRs) and the changelog. Read the relevant doc BEFORE touching code.
- `legacy/` — frozen v3.0.4 sources (`JSnumberToWordProcessor.js`,
  `curStrLengthFunc_2.js`/`.min.js`, `index.html.v3`). **Read-only reference.**
  Never import from `legacy/` in production code; never edit it (except via an
  explicit ADR-approved decision).
- `scripts/extract-v3-table.mjs` — regenerates the golden test fixture
  `packages/core/test/fixtures/v3-illion-table.json` from `legacy/`.
- `docs/images/` — screenshots used by the README.

## 2. Tech Stack

- **Language**: TypeScript 5 (strict mode, `noUncheckedIndexedAccess` on).
  Never use `any`; never use `as unknown as X` chains as a shortcut (test files
  may cast legacy-compat booleans only where already established).
- **Core build**: tsup (ESM + CJS + d.ts) and esbuild for the browser IIFE
  bundle (see §6 Publishing). Target ES2020.
- **Tests**: Vitest 2. Node environment for core; jsdom for UI (`globals: true`
  is REQUIRED for Testing Library auto-cleanup; `esbuild.jsx: "automatic"` is
  REQUIRED for `.tsx` — both are set in the root `vitest.config.ts`).
- **UI**: Next.js 15 (App Router, **static export** — `output: "export"`),
  React 19, React-Bootstrap 2 + Bootstrap 5.3 CSS imported in `app/layout.tsx`.
  No server actions, no API routes, no `next/image` optimization (static
  export constraints — keep the app pure client-side).
- **Runtime floor**: Node ≥ 18.18. No runtime dependencies in `packages/core`
  — the library must stay dependency-free (v3 identity, keep it).
- **Lint/format**: ESLint 8 flat config (`eslint.config.cjs`), Prettier.

## 3. Non-Negotiable Core Invariants

These are the contract. Every PR, refactor, and "harmless optimization" must
preserve them. Each has at least one test guarding it — if you change
behavior, the tests tell you, and you may only change them with a documented
decision (see §8).

1. **Display and words always agree.** `displayNum` and `displayWord` describe
   the exact same digits, always. v3's "0.50 / Fifty tenths" mismatch class of
   bugs must never return.
2. **Exactness over floating point.** All arithmetic (rounding, carry,
   grouping) operates on digit STRINGS and `BigInt`. Never route a value
   through `Number()` math. Rounding is **half-up on the exact digit string**.
3. **Rounding carry collapses the decimal.** If the kept decimal digits are
   all zeros after rounding (e.g. `9.999 @2` → `10.0000`), the decimal part is
   omitted: result is `"Ten"`, NOT `"Ten (dot) Zero ..."`.
4. **The decimal comma grouping is INTENTIONAL.** Decimal digits in
   `displayNum`/`displayDecimalNum` are comma-grouped in threes **anchored at
   the decimal point** (e.g. `5,876.98,588`) so each comma lands where the
   words say "Thousand,". The project owner confirmed this is a deliberate
   visual aid (v3 shipped it undocumented; v4 documents and tests it in
   `packages/core/test/unit/format.test.ts`). **Never "fix" it. Never group
   decimals left-anchored like the whole part.**
5. **Word style is standard British** (v4 ADR-001 in `docs/DECISIONS.md`):
   - "and" inside every spoken group with hundreds + remainder
     ("One Hundred and Twenty-Three Million"),
   - "and" (no comma) before the final bare tens/units group
     ("Nine Thousand and Twelve" — v3's "Nine Thousand, and Twelve" is gone),
   - no mid-number "and" ("...Billion, Twelve Million, ..."),
   - `(negative) ` prefix, ` (dot) ` separator, ordinal units
     (`hundred-thousandths`) are the library's signature vocabulary.
6. **Singular grammar when the decimal value is exactly 1**: "One tenth",
   "One hundredth" — plural otherwise ("Five tenths").
7. **Strict error contract.** Invalid input throws typed errors
   (`InvalidNumberError`, `NumberTooLargeError`, `InvalidOptionsError`), never
   silent "Zero"/empty-array fallbacks. Arrays throw with `at index N` context;
   `lenient: true` opt-in skips invalid entries (documented v3 compat).
8. **Limits**: whole part ≤ 33003 digits (10^33003); `decimalPlaces` is an
   integer 0..33003. Negative or non-integer `decimalPlaces` throws
   (`InvalidOptionsError`) — the UI validates its own input BEFORE calling the
   library.
9. **Zero has no sign**: `-0`, `-0.00` → `"Zero"` / `"0"`, `negativeInt: false`.
10. **New options are additive and validated** (v4.1): `style` (`"british"`
    default | `"american"`), `locale` (registry, `"en"` default), `output`
    (`"cardinal"` default | `"ordinal"`), `currency` (money words, always 2
    minor places, zero minor omitted, `+ s` pluralization unless invariant or
    overridden). Every option value is validated - unknown values throw
    `InvalidOptionsError`, never fall back silently. New locales follow
    `docs/LOCALES.md` (ADR-008: only verifiable, algorithmic locales).

## 4. Naming & Style Conventions

- `camelCase` for variables/functions; `PascalCase` for types/classes/React
  components; `kebab-case` for file names of components; keep module files
  lower-case single words where possible (`illions.ts`, `words.ts`).
- Every exported function carries a JSDoc block (purpose, params, returns).
- Prefer `const`, arrow functions, template literals. No `var`. Keep lines
  ≤ 100 chars (Prettier enforces the rest).
- Comments explain WHY (rules, ADR references, v3-parity notes) not WHAT.
- The published word strings are case-sensitive and hyphenated exactly as in
  `packages/core/src/scales.ts` ("Forty", "Twenty-One") and
  `packages/core/src/illions.ts` (Conway-Wechsler names). Do not "correct"
  spellings without checking the golden fixture first.

## 5. Testing Standards — "No Bug Survives The Session"

Run everything from the repo root:

```sh
npm test            # Vitest run (core + UI)
npm run lint        # ESLint flat config
npm run typecheck   # tsc --noEmit in all workspaces
npm run build       # core then ui (order matters: ui bundles core)
```

All four must pass before any commit. Coverage lives in
`packages/core/test/` with four layers — understand them before writing code:

1. **Golden equivalence** (`test/unit/illions.test.ts`,
   `test/unit/ordinals.test.ts`): the algorithmic Conway-Wechsler generator is
   asserted against ALL 33,000 names of the v3-published lookup table
   (fixture: `test/fixtures/v3-illion-table.json`, regenerated with
   `node scripts/extract-v3-table.mjs`). If you touch `illions.ts` and this
   fails, your rule is wrong — check `docs/CONWAY_WECHSLER.md`, not the test.
2. **Unit tests** (`test/unit/`): parsing, formatting, ordinals, word engine,
   rounding, options validation, API surface.
3. **Regression locks** (`test/regression/v3-bugs.test.ts`): one test per
   confirmed v3 defect from `docs/BUG_AUDIT_v3.md` (12 of them). These are
   tombstones — if one fails, the bug came back.
4. **v3 parity** (`test/golden/v3-parity.test.ts`): outputs v3 got RIGHT and
   must stay byte-identical (headline examples, `(negative)`/`(dot)`
   vocabulary, result-object field set).

**When fixing any bug**: add the failing test FIRST, watch it fail, fix, watch
it pass, and document the defect in `docs/BUG_AUDIT_v3.md` (for v3-era bugs)
or the changelog (for v4 regressions).

**UI tests** live in `packages/ui/test/` (jsdom + Testing Library). They must
cover: the decimal-length control rejecting negatives, end-to-end conversion
through the real core library, and loud error surfacing. After any UI change,
also do a manual smoke pass (`npm run dev:ui`) covering: negative decimal
length, one decimal conversion, one array conversion, one error case.

## 6. Builds & Publishing (NPM)

- `packages/core` publishes as `js-number-to-word-processor@4.x`. Build with
  `npm run build:core`:
  - `dist/index.js` (ESM) + `dist/index.cjs` (CJS) + `dist/index.d.ts` via tsup;
  - `packages/core/JSnumberToWordProcessor.js` — the single-file browser
    bundle, built by `scripts/build-browser.mjs` (esbuild IIFE, global name
    `JSnumberToWordProcessor` as the **bare callable**, exactly like v3's
    script-tag UX). The footer unwrap in that script is what guarantees the
    global is a function, not a namespace object — do not remove it.
- `package.json` `files` whitelist controls what ships. Never publish
  `test/`, `legacy/`, or fixtures.
- Version bumps: SemVer. **Any change to output words, display formatting, or
  error behavior is breaking** — major bump + `docs/MIGRATION_*.md` entry +
  `docs/CHANGELOG.md` entry in the same change set.
- `npm publish` runs from `packages/core` only, after the full §5 gate is
  green. Verify with `npm pack --dry-run` before publishing.
- The UI is private (`@jsnumber/ui`) — never published.

## 7. UI Console Rules

- **React-Bootstrap + Bootstrap 5 only.** No other component libraries; no
  CSS frameworks beyond `bootstrap` and `bootstrap-icons` (already imported in
  `app/layout.tsx`). Custom styles go in `app/globals.css` using theme
  variables (`--n2w-*`); keep the v3 visual identity (red negative sign,
  tomato `(dot)`, gray ordinal unit).
- All interactive components are client components (`"use client"`). Page
  shell (`app/page.tsx`, `app/layout.tsx`) stays a server component.
- **The decimal-length input MUST reject negative, non-integer and >33003
  values with inline feedback** (`validateDecimalLengthInput` +
  `DecimalLengthControl`). This fixes the reported v3 defect — do not loosen.
- Single-number input is a text field (`type="text"`/textarea +
  `inputMode`), NOT `type="number"` — number inputs mangle long numbers and
  block "1e21". Never reintroduce `type="number"` for number entry (the
  decimal-length spinner may keep `type="number"` because it bounds a small
  integer).
- Conversion runs in the browser via `js-number-to-word-processor` (workspace-linked) directly — no API
  routes (static export). Errors from the core surface in an
  `Alert variant="danger"`, never swallowed.
- Session persistence keys (`decimalPlaceLength`, `display2Document`,
  `arrOfNum`) are v3-compat: read them defensively (they may hold v3-era
  junk). Client-only reads in `useEffect` to avoid hydration drift.
- Static export must keep working: `npm run build:ui` produces `out/`.
  `NEXT_PUBLIC_BASE_PATH` supports GitHub Pages project paths.

## 8. Documentation Policy

- `docs/` is the source of truth. **Every** behavior change, new option, or
  fixed defect lands with its doc update in the same commit:
  - API changes → `docs/API_REFERENCE.md`
  - Behavior/semantics changes → `docs/MIGRATION_v3_to_v4.md` (or a new
    migration doc for future majors) + `docs/CHANGELOG.md`
  - Architecture/module changes → `docs/ARCHITECTURE.md`
  - Naming-rule changes → `docs/CONWAY_WECHSLER.md`
  - Locale additions/changes → `docs/LOCALES.md`
  - Non-obvious decisions → an ADR in `docs/DECISIONS.md`
- If you find undocumented intentional behavior (like the decimal grouping),
  **document it immediately** — undocumented intent is indistinguishable from
  a bug and WILL be "fixed" by a future agent.
- README.md is the user-facing showcase: keep examples machine-verifiable
  (they mirror `packages/core/test/golden/v3-parity.test.ts` outputs).

## 9. Git Workflow

- Commits: imperative mood, scoped, e.g. `core: fix decimal ordinal collapse
  for leading zeros (v3 bug #1)`; `ui: reject negative decimal lengths`.
- Do not commit unless asked; do not push to `master` without explicit
  instruction; never force-push.
- `legacy/` files are frozen — changes require a new ADR and owner approval.
- Never commit `dist/`, `out/`, `.next/`, `node_modules/`, coverage, or the
  generated `packages/core/JSnumberToWordProcessor.js` (see `.gitignore`).

## 10. How To Collaborate

- Ask clarifying questions when behavior is ambiguous; propose the fix and
  show the exact input → expected-output pair before large refactors.
- Prefer small, focused changes; run the full §5 gate locally every time.
- When you discover a new edge case, add it to the test suite even if the
  current behavior is already correct — tests are the specification.
- Report outcomes faithfully: state which tests were run and what failed.
