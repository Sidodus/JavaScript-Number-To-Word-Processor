# Adding a Locale (v4.1)

The locale layer makes every human-facing word a data decision. English (`"en"`)
ships built in, in British (default, "and") and American (no "and") styles.
**French (`"fr"`) shipped as the pilot in 4.1.0**, exercising every hook in the
layer. New locales are **additive data** — the engine never changes.

## The exactness rule (ADR-008)

Only locales whose number-naming rules can be **stated algorithmically and
verified** are accepted. Number words are the API: a locale with hand-guessed
words is a wrong-output generator. For languages with complex traditional
numeration (e.g. Yoruba's vigesimal subtraction), do not approximate —
implement the real system or wait until it can be specified properly.

## The expansion process (per locale)

```
1. SPEC      Write docs/locales/<code>-SPEC.md: the full algorithm with an
             authoritative reference for every rule, worked examples for
             0-25, 30, 40...90, 100/101/200/201, 1000, 1001, 1100, 2000,
             1e6, 2e6, 1e9, 1e12, and the ordinal rules.
             Open linguistic questions get settled HERE, in writing, before
             any code (see the per-locale roadmaps below).
2. IMPL      Copy packages/core/src/locales/_template.ts, implement the spec,
             register in src/locales/registry.ts.
3. TEST      Add a <code> describe block to test/unit/locales.test.ts with the
             spec's worked examples as assertions, plus the generic contract
             tests (they run for every registered locale automatically).
4. GATE      npm run build && node scripts/validate-locale.mjs --all
             (also enforced in CI by .github/workflows/code-quality.yml).
5. DOCS      Add a row to the shipped-locales table; note any limitations.
```

A `.github/ISSUE_TEMPLATE/locale_request.yml` issue template captures the
source-authority questions up front for community requests.

## Engine capabilities a locale can use (all hooks optional)

| Hook | Purpose | Used by |
|------|---------|---------|
| `smallNumbers` (0..99) | Units/teens/tens table | all |
| `hundredWord` / `thousandWord` | Base scale words | all |
| `andStyle` + `supportsBothStyles` | "and" joining + whether `style` may switch it | en |
| `hundredPhraseFor(h, r)` | Hundreds inflection ("deux cents" vs "deux cent un") | fr |
| `thousandPhraseFor(v)` | Thousands phrase ("mille", never "un mille") | fr |
| `scaleWordFor(i, v)` | Value-aware scale words (long scale, pluralization) | fr |
| `groupSeparator` | Inter-group join (default ", ", fr " ") | fr |
| `ordinalize(cardinal)` | Sentence-level ordinals (article rules: "un million" → "millionième") | fr, en default |
| `decimalOrdinal(place, singular)` | Localized decimal ordinals — **not yet used by any locale** | — |

## Limitations (current)

- **Decimal-place ordinals** are localized only for `en` (via the built-in
  construction). Locales without a `decimalOrdinal` hook REJECT decimal inputs
  with a descriptive `InvalidOptionsError` — mixed-language output like
  "cinq (virgule) cinq tenths" is never produced. Whole numbers and currency
  mode work everywhere.
- Scale names default to the English short-scale Conway-Wechsler system;
  long-scale locales (fr) supply `scaleWordFor`.

## Shipped locales

| Code | Styles | Scale | Ordinals | Decimals | Notes |
|------|--------|-------|----------|----------|-------|
| `en` | british (default), american | short (Conway-Wechsler to 10^33003) | full (First/-ieth) | full | The reference locale. |
| `fr` | american (no "and"; toggle rejected) | **long** (million/milliard/billion/billiard... with pluralization) | full (premier, -ième, unième, article drop) | **full** (long-scale denominators: dixième ... milliardième, pluralized) | Traditional orthography; 0-99 generated algorithmically. |
| `ha` | british with `andWord: "da"` (toggle rejected) | multiplier-AFTER ("ɗari biyu", "dubu ɗaya", "miliyan ɗaya"); loans miliyan/biliyan/tiriliyan, English code-switch beyond 10^12 | **full** (na-linker: na farko, na biyu; feminine ta-linker unmodeled) | rejected with clear error | Boko orthography with hooked letters; every component joined by "da". Spec: `docs/locales/ha-SPEC.md`. |
| `yo` | american (no joiner; toggle rejected) | vigesimal 0-99 (lé/dín), traditional hundreds chain, modern decimal thousands ("ẹgbẹ̀rún méjì"), loans mílíọ̀nù/bílíọ̀nù, English code-switch beyond 10^9 | rejected (periphrastic; SPEC §7) | rejected with clear error | **Flagship locale.** Traditional register 0-999 + modern decimal above; diacritics NFC. Spec: `docs/locales/yo-SPEC.md`. |
| `ig` | british with `andWord: "na"` (toggle rejected) | decimal multiplier-after ("iri abụọ", "narị abụọ", "puku abụọ"); loans nde/ijiri, English code-switch beyond 10^9 | **full** (nke-linker: nke mbụ, nke abụọ) | rejected with clear error | Attested asymmetry preserved: "otu narị" (100) vs "narị abụọ" (200). Spec: `docs/locales/ig-SPEC.md`. |

## Roadmap (in priority order)

### ~~`ha` — Hausa (Nigeria)~~ → SHIPPED in 4.2.0
Implemented from `docs/locales/ha-SPEC.md` (sources: languagesandnumbers.com,
Omniglot, Polyglot Club, Nkenne, Peace Corps/Sigurd). OPEN items: Hausa
ordinals (periphrastic "na"-forms need a verified source) and the negative
prefix (kept as the English loan). Contributions welcome against the SPEC.

### ~~`yo` — Yoruba (Nigeria)~~ → SHIPPED in 4.3.0 (flagship)
Implemented from `docs/locales/yo-SPEC.md` (sources: Wikipedia's Yoruba
numerals analysis citing Lounge 2009, Preply, Science in Yorùbá). Register
decision documented: traditional 0-999 + modern decimal thousands + loans.
OPEN items: ordinals (periphrastic) and the negative prefix (English loan).

### ~~`ig` — Igbo (Nigeria)~~ → SHIPPED in 4.3.0
Implemented from `docs/locales/ig-SPEC.md` (sources: emeriwo4christ tables,
Master Any Language, the ResearchGate Igbo/Chinese numerals paper). OPEN
items: ordinals (periphrastic "nke..."), the negative prefix (English loan),
the "efu" zero form.

### `fr` extensions — decimal ordinals (`decimalOrdinal` hook)
dixièmes, centièmes, millièmes... straightforward (-ième family) once the
hook is wired into the UI-facing flow; spec'd trivially from the same sources.

### Others considered
`pcm` (Nigerian Pidgin) — numerals are English-based; low differentiation
value. `ar`, `de`, `es`, `hi` — well-documented but require long-scale/lakh
grouping decisions; accept PRs via the process above.

## Checklist for a locale PR

1. `docs/locales/<code>-SPEC.md` exists with authoritative references quoted.
2. `smallNumbers` covers 0..99 exactly; index 0 === `zeroWord`; no duplicates
   (the contract test enforces this for every registered locale).
3. Unit tests: 0, 1, 7, 21, 100, 101, 9012, 1005, 1000012, negative, the
   10^6/10^9 scales, one extreme scale, ordinals (or the documented
   limitation), currency mode.
4. `style` behaviour documented (does the "and" concept exist in the language?).
5. `node scripts/validate-locale.mjs --all` passes.
6. This file gains a row in the shipped-locales table.
