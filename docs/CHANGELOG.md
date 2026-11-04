# Changelog

All notable changes are documented here. Format based on
[Keep a Changelog](https://keepachangelog.com/); versioning: SemVer.
**Any change to output words, display formatting, or error behavior is a
breaking change → major bump.**

## [4.6.0] — 2026-11-04

### Added
- **`es` locale (Español)** — RAE-sourced: irregular hundreds chain
  (quinientos/seiscientos/setecientos/ochocientos/novecientos), the cien vs
  ciento split, veinti- contractions, the apocope before mil (veintiún mil,
  treinta y un mil, ciento un mil), the long-scale million family (un millón /
  dos millones / mil millones / un billón = 10¹² per RAE), and **localized
  decimal ordinals with feminine agreement** (una décima, veintiuna
  centésimas, doscientas milésimas). Spec: `docs/locales/es-SPEC.md`.
  Cardinal-style ordinals (primero/segundo) are periphrastic-preferred and
  reject loudly (SPEC §6).
- **`decimalDigitWord` locale hook** — locale-styled words for the decimal
  digits themselves, enabling the Spanish feminine fraction agreement.
  Masculine-forms caveat: the engine has no gender context (SPEC §1).

## [4.5.0] — 2026-11-04

### Added
- **Hausa & Igbo ordinals** (closing both locales' OPEN items): periphrastic
  linkers implemented — Hausa **na**-linker with the special *na farko*
  (feminine *ta*-paradigm documented but unmodeled), Igbo **nke**-linker with
  the special *nke mbụ*. Sources quoted in the two SPECs.
  Examples: `N("21", { locale: "ha", output: "ordinal" })` → "na ashirin da
  ɗaya"; `N("21", { locale: "ig", output: "ordinal" })` → "nke iri abụọ na otu".

## [4.4.0] — 2026-11-04

### Added
- **`ig` locale (Igbo)** — decimal multiplier-after system joined by "na"
  (*iri atọ na anọ* = 34), the attested *otu narị* / *narị abụọ* asymmetry,
  *otu puku/nde/ijiri* scales, English code-switch beyond 10^9. Spec:
  `docs/locales/ig-SPEC.md`. Ordinals ("nke..." periphrastic) and decimals
  rejected at this release (shipped in 4.5.0); currency mode works.
- **French decimal ordinals** (`decimalOrdinal` hook): long-scale denominators
  (*dixième, centième, millième, milliardième, billionième, billiardième*...)
  with singular/plural agreement — French decimals now localize instead of
  rejecting.
- **`yo` locale (Yorùbá)** — the flagship locale: the authentic mixed
  additive/subtractive vigesimal system for 0..99 (*ogún lé ọ̀kan*,
  *ẹ̀ẹ́dọ́gbọ̀n* = 25, *ẹ̀rìndínlọ́gbọ̀n* = 26, *aárùn-dínlógójì* = 35...),
  the full traditional hundreds chain (*igba*, *irinwó*, *ọ̀ọ́dúrún*,
  *ẹ̀ẹ́dẹ́gbẹ̀ta*...), and the modern decimal register for thousands
  (*ẹgbẹ̀rún méjì*) with *mílíọ̀nù/bílíọ̀nù* loans. Spec with sources:
  `docs/locales/yo-SPEC.md`. Ordinals and decimals rejected at this release
  (ordinals shipped in 4.5.0); currency mode works.
- UI locale selector labels ("Français (fr)", "Hausa (ha)", "Yorùbá (yo)").

## [4.3.0] — 2026-11-04 (npm snapshot)

Infrastructure release aligned with the CI/developer-experience fixes below;
locale content identical to 4.2.0.

### Added
- **npm README**: the package page now ships the full documentation
  (packages/core/README.md, links absolutized).
- **Code-quality workflow** (MATCHMASTER-AI pattern): typecheck → lint →
  coverage-gated tests → locale contract gate → builds → Trivy (pinned
  v0.33.1, advisory) → npm audit → depcheck; added to this repo and the
  proforma-invoice-calculator repo.

### Fixed
- CI: `npm ci` lock-file sync after the workspace rename/version bump; UI
  typecheck now resolves the workspace core by building it first
  (`verify`/`typecheck`/`dev:ui` all self-sufficient on fresh clones).

## [4.2.0] — 2026-11-04

Additive feature release: Hausa locale + locale-inflection hooks. Defaults
remain byte-identical (parity suite green).

### Added
- **`ha` locale (Hausa)** — the multiplier-after scale pattern ("ɗari biyu",
  "dubu ɗaya", "miliyan ɗaya") with every component joined by "da";
  attested scale loans miliyan/biliyan/tiriliyan and documented English
  code-switching beyond 10^12. Spec: `docs/locales/ha-SPEC.md`.
- **Locale engine hooks**: `andWord` (localized "and": Hausa "da"),
  `thousandPhraseFor(value, groupWords)` and `scaleWordFor(index, value,
  groupWords)` now receive the pre-rendered group words and OWN the whole
  group phrase (enables multiplier-after orders); `groupSeparator` finalized.
- **Loud capability guards**: `output: "ordinal"` with a locale lacking
  `ordinalize` throws (no English suffixes on non-English words).

## [4.1.0] — 2026-11-03

Additive feature release: the default output of every v4.0.0 call is
byte-identical (verified by the golden parity suite). New capabilities are
opt-in options.

### Added
- **Currency mode** (`currency` option): money words instead of the decimal
  sentence — `N("1234.56", { currency: { major: "Naira", minor: "Kobo",
  majorPlural: "Naira" } })` → "One Thousand, Two Hundred and Thirty-Four
  Naira, Fifty-Six Kobo". Money is always 2 minor places (or whole major
  units when no minor label); zero minor parts are omitted; labels pluralize
  with "+ s" unless already invariant or overridden; optional `suffix`
  ("... Only") supports the check-writing convention. Results carry a new
  additive `currency` field (`{ majorLabel, minorLabel, suffix } | null`).
- **`style` option**: `"british"` (default, unchanged) or `"american"` (no
  "and" anywhere: "One Hundred Twenty-Three Million...").
- **`output: "ordinal"`**: whole words become ordinals ("21" → "Twenty-First",
  "0" → "Zeroth", "112" → "One Hundred and Twelfth"); decimal phrases are
  unaffected.
- **`locale` option + locale registry**: `registerLocale()` / `getLocale()` /
  `localeCodes()`; **`en` and `fr` ship built in**. French is the pilot locale:
  long scale (million/milliard/billion/billiard), cent/cents/mille inflection,
  premier/-ième/unième ordinals with the article-drop rule, locale-aware group
  separator, and capability declarations (it rejects the "british" style and
  decimal inputs with descriptive errors instead of mixed-language output).
  Locale engine hooks: `hundredPhraseFor`, `thousandPhraseFor`,
  `scaleWordFor`, `groupSeparator`, `ordinalize`, `decimalOrdinal`,
  `supportsBothStyles`. Extension guide + per-locale roadmap:
  `docs/LOCALES.md` (ADR-008: only verifiable, algorithmic locales are
  accepted); locale contract gate (`scripts/validate-locale.mjs`) runs in CI.
- **`illionName` memoization** — repeated/huge conversions reuse composed
  scale names.
- **Property-based tests** (fast-check): display==word invariant, no
  "undefined"/", and"/double-space leakage, determinism, currency sentence
  shape — 1,000 randomized cases per run.
- **Coverage gate**: 90% lines/functions/statements, 85% branches (measured:
  98.2% lines).
- **CI/CD**: GitHub Actions (verify gate), GitHub Pages deploy for the UI,
  npm publish with provenance, Dependabot, CodeQL.

### UI (packages/ui)
- Dark mode (Bootstrap 5.3 native `data-bs-theme`), persisted per browser.
- Copy-to-clipboard on every result.
- Shareable URLs (`?n=…&dp=…&style=…&currency=…`) with replaceState updates.
- Currency, style and ordinal controls with Naira/Dollar/Euro/Pound presets.

## [4.0.0] — 2026-11-03

Modern rewrite of the 2019 v3 library (TypeScript, monorepo, strict
semantics). Call signature and result-object shape are v3-compatible;
outputs changed where v3 was wrong. Full guide: `MIGRATION_v3_to_v4.md`.

### Fixed (see `BUG_AUDIT_v3.md` for evidence)
- Decimal place value with leading zeros no longer collapses
  (`0.0005 @4` → "Five ten-thousandths", was "Five tenths").
- Rounding into a whole number no longer says "(dot) Zero ..."
  (`9.999 @2` → "Ten", was "Ten (dot) Zero hundredths").
- Exact half-up rounding on digit strings — no float `toFixed` artifacts
  (`0.995 @2` → "1"; `2.675 @2` → "2.68").
- Display and words always agree (`.5` → `0.50` / "Fifty hundredths").
- Scientific notation: `"1e21"` string no longer crashes; number-form
  exponents expand exactly (`2**70` no longer mangles).
- All-zero decimals render cleanly (`"5."` → "Five"; `"0.00"` → "Zero").
- Typed error contract: `InvalidNumberError` (with array index context),
  `NumberTooLargeError`, `InvalidOptionsError` — replaces silent "Zero"/`[]`
  fallbacks and raw crashes (`null`, `Infinity`).
- `-0` → "Zero" (no "(negative)").
- Decimal ordinals ≥ 33002 no longer read stale module state.
- Oversized input throws `NumberTooLargeError` instead of returning a fake
  "SORRY..." word sentence.
- UI: "Change Decimal Length" rejects negative/non-integer/>33003 values
  with inline feedback (previously accepted negatives silently).

### Changed (deliberate, breaking)
- Standard British word style: "Nine Thousand and Twelve" (v3: "Nine
  Thousand, and Twelve"); no mid-number "and" (ADR-001).
- Singular decimal grammar when the value is exactly 1 ("One tenth", "One
  hundredth").
- All-zero decimals are omitted entirely (`26.00000232 @5` → "26" /
  "Twenty-Six", was "26.00" with junk words).
- Requested `decimalPlaces` is authoritative (digits shown = digits
  described; padding to the requested place).
- AMD support dropped; true ESM + CJS + types shipped; `unpkg`/`jsdelivr`
  point at the single-file browser bundle.

### Added
- TypeScript rewrite with generated `.d.ts` (strict mode).
- `{ lenient: true }` option: skip invalid array entries (v3 behavior,
  explicit).
- Named exports: error classes, `decimalPlaceOrdinal`, `illionName`,
  `MAX_DECIMAL_PLACES`, `MAX_WHOLE_DIGITS`.
- Algorithmic Conway-Wechsler generator — 19.6KB bundle replacing the 1.3MB
  lookup table; verified entry-for-entry against the published v3 table
  (33,000 names) by golden tests.
- Monorepo UI: Next.js 15 + React-Bootstrap 5 console with static export
  (GitHub Pages compatible), text-based inputs (paste any size number),
  loud error alerts, v3 visual identity.
- Documentation set: `ARCHITECTURE.md`, `API_REFERENCE.md`,
  `MIGRATION_v3_to_v4.md`, `CONWAY_WECHSLER.md`, `BUG_AUDIT_v3.md`,
  `TESTING_STRATEGY.md`, `DECISIONS.md` (ADR-001..007) and this changelog.
- Enterprise `AGENTS.md` governing future development.
- Test suite: 101 tests across unit / regression / golden-parity / UI
  integration layers.

## [3.0.4] — 2020
- Fixed display of multiple zeros greater than 2 length (fallback to .00).
- "Corrected" decimal place word with starting zeros (26.00002 @5 → "Two
  tenths") — later identified as still wrong (place-value collapse, bug #1
  in `BUG_AUDIT_v3.md`); properly fixed in 4.0.0.

## [3.0.3] — 2020
- Corrected dismissal of starting zeros after a decimal point.

## [3.0.2] — 2020
- Decimal/fraction support with a second decimal-place argument (default 2).
- Negative number support.
- Arithmetic expression outputs.

## [2.0.6 / 2.0.5 / 2.0.4] — 2019/2020
- Code optimization; README corrections; support up to 10^33003 via the
  Conway-Wechsler lookup (hard-coded table); pure vanilla JS.

## [1.1.0] — 2019
- Numbers beyond 2^53-1 up to 10^126; spelling fixes.
