# Decision Records (ADR) — JSnumberToWordProcessor

Lightweight ADR log. Each entry: context → decision → consequences. New
non-obvious decisions must be appended here (see AGENTS.md §8).

---

## ADR-001 — Standard British word style; drop v3's comma before "and" (v4.0.0)

**Context.** v3 emitted "Nine Thousand, and Twelve" / "One Million, and
Twelve" — a comma immediately before "and" for groups without a hundreds
digit. This is non-standard English and was flagged during the v4 rewrite.
The per-group "and" ("One Hundred and Twenty-Three Million") is standard
British and stays.

**Decision.** Adopt standard British joining: "and" (no comma) before the
final spoken group when that group is a bare tens/units value (< 100) and a
higher group was spoken; no mid-number "and" ("...Billion, Twelve Million,
..."). Selected by the project owner among presented options.

**Consequences.** Outputs differ from v3 for these cases (major bump);
documented in `MIGRATION_v3_to_v4.md`; locked by tests
(`words.test.ts`, regression bug 9).

---

## ADR-002 — Strict typed errors replace silent fallbacks (v4.0.0)

**Context.** v3 silently converted `""` → "Zero", dropped invalid array
entries, and crashed with raw TypeError/RangeError on `null`/`Infinity`.
Silent wrong output is worse than a loud error for a conversion library.

**Decision.** Throw typed errors (`InvalidNumberError`,
`NumberTooLargeError`, `InvalidOptionsError`) with actionable messages.
Arrays include `at index N`. Add `lenient: true` to restore v3's
skip-invalid-entries behavior explicitly. Single inputs always validate
strictly.

**Consequences.** v3 consumers relying on silent filtering must opt into
`lenient` or pre-filter. The UI surfaces errors as alerts.

---

## ADR-003 — Exact string/BigInt arithmetic; half-up rounding on digits (v4.0.0)

**Context.** v3 routed decimals through `Number(...).toFixed()`, producing
binary-float artifacts ("0.995 @2" → "0.99") and display/word mismatches.

**Decision.** All value math on digit strings + BigInt. Rounding is half-up
on the exact digit string at the requested place, with carry into the whole
part; an all-zero kept decimal is dropped (whole result). Display digits and
words must always describe the same digits.

**Consequences.** Deterministic across platforms; float inputs are converted
via their shortest round-trip string (documented honest representation);
`2.675 @2` → "2.68" (differs from `toFixed` — intentional).

---

## ADR-004 — Algorithmic Conway-Wechsler generator replaces the 1.3MB table (v4.0.0)

**Context.** v3 shipped 33,000 hard-coded scale names (1.3MB source / 718KB
min) and a stale-state bug at the range edges (bug 11).

**Decision.** Generate names from the Conway-Wechsler rules (mrob.com
reference, Miakinen "quin" variant — same as v3). Verify entry-for-entry
against the extracted v3 table (golden fixture, 33,000 lengths) in CI.
Deviation procedure is defined in `CONWAY_WECHSLER.md` §6.

**Consequences.** Bundle shrinks ~97% (19.6KB); names stay byte-identical to
v3's published vocabulary; the fixture becomes the compatibility oracle.

---

## ADR-005 — Decimal comma grouping is intentional; documented, not "fixed" (v4.0.0)

**Context.** v3 renders decimals as e.g. `5,876.98,588` — commas inside the
decimal digits. During the audit this looked like a formatting bug, but the
project owner confirmed it is a deliberate visual aid: right-anchored groups
put each comma exactly where the words say "Thousand,".

**Decision.** Keep the grouping; document it in `API_REFERENCE.md` and
`ARCHITECTURE.md`; lock it with tests (`format.test.ts`); record it in
AGENTS.md §3 so future agents never "fix" it.

**Consequences.** None for consumers — behavior is unchanged, now specified.

---

## ADR-006 — Monorepo: TypeScript core + Next.js static-export UI (v4.0.0)

**Context.** v3 was a single root script pair with a hand-written HTML page.
The owner requested modernization with Next.js or plain JS, keeping
Bootstrap/React-Bootstrap, and chose Next.js + TypeScript via the kickoff
questions.

**Decision.** npm-workspaces monorepo: `packages/core` (TypeScript library,
tsup + esbuild builds) and `packages/ui` (Next.js 15 App Router,
React-Bootstrap 2 / Bootstrap 5.3, `output: "export"` for GitHub Pages).
Vitest for both; ESLint flat config at the root.

**Consequences.** Core must be built before the UI (`npm run build` orders
this); the UI stays fully client-side (no API routes) to keep static export.

---

## ADR-007 — The browser bundle global stays the bare callable (v4.0.0)

**Context.** tsup's IIFE format wraps exports in `__toCommonJS`, which would
expose `window.JSnumberToWordProcessor` as a namespace object
(`{ default: fn }`), breaking v3's script-tag UX.

**Decision.** Build the browser bundle with esbuild directly
(`packages/core/scripts/build-browser.mjs`) plus a deterministic footer that
unwraps a namespace object to its `.default` function. The published
`JSnumberToWordProcessor.js` therefore exposes the callable itself, exactly
like v3.

**Consequences.** One extra build script; verified by the packaging checks in
the final gate.
