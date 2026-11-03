# The Conway-Wechsler Numbering System in JSnumberToWordProcessor v4

Reference: https://www.mrob.com/pub/math/largenum.html (Conway & Guy system,
with Miakinen's "quin" amendment — the same variant v3 published).

## 1. Why algorithmic

v3 hard-coded 33,000 scale names into a 1.3MB JS file
(`legacy/curStrLengthFunc_2.js`). v4 generates every name from ~200 lines of
pure string logic (`packages/core/src/illions.ts`):

- bundle: 19.6KB total (vs ~755KB of v3 scripts),
- no gaps or stale-state bugs (v3's ordinal lookup read stale module state for
  extreme places — `BUG_AUDIT_v3.md` bug 11),
- verified entry-for-entry against the v3 table by the golden test
  (`packages/core/test/unit/illions.test.ts`), using the fixture regenerated
  by `node scripts/extract-v3-table.mjs`.

## 2. Indexing convention

The **n-th illion** has value 10^(3n + 3): n = 1 → Million (10^6), n = 33 →
Trestrigintillion (10^102), n = 1000 → Millinillion (10^3003), n = 11000 →
Undecillinillion (10^33003). "Thousand" is not an illion; the word engine maps
group index 1 → "Thousand" and group index i ≥ 2 → `illionName(i - 1)`.

For a whole number with L digits, the highest group index is
`ceil(L / 3) - 1` — this is how the golden test aligns the length-based v3
table with the n-based generator.

## 3. Name construction (n < 1000)

Decompose n into digits: units u, tens t, hundreds h. Assemble segments in
the order **units, tens, hundreds**, then drop a final vowel and append
"illion":

- Units segments: 1 un, 2 duo, 3 tre(*), 4 quattuor, 5 quin, 6 se[sx],
  7 septe[mn], 8 octo, 9 nove[mn].
- Tens roots (+ marker sets): 10 deci{n}, 20 viginti{m,s}, 30 triginta{n,s},
  40 quadraginta{n,s}, 50 quinquaginta{n,s}, 60 sexaginta{n}, 70 septuaginta{n},
  80 octoginta{m,x}, 90 nonaginta{}.
- Hundreds roots (+ marker sets): 100 centi{n,x}, 200 ducenti{n},
  300 trecenti{n,s}, 400 quadringenti{n,s}, 500 quingenti{n,s},
  600 sescenti{n}, 700 septingenti{n}, 800 octingenti{m,x}, 900 nongenti{}.
- **Insertion rule:** between consecutive segments, insert the letter shared
  by the previous segment's trailing set and the next segment's marker set:
  - se + viginti → ses + viginti → Sesvigintillion (26)
  - se + octoginta → sex + octoginta (x match)
  - septe/nove + viginti → septem/novem (m match)
  - septe/nove + deci → septen/noven (n match)
- **tre special rule:** insert "s" when the following part is marked with
  s or x: Trestrigintillion (33), Trescentillion (103).
- Bare units (n < 10) use base roots with "-llion": mi→Million, bi→Billion,
  tri→Trillion, quadri, quinti, sexti, septi, octi, noni.
- Final vowel stripping: deci → dec, viginti → vigint, centi → cent,
  nongenti → nongent → Nongentillion.

Worked example — n = 996: units se, tens nonaginta{}, hundreds nongenti{} →
"se" + "nonaginta" + "nongenti" → strip vowel → "senonagintanongent" →
**Senonagintanongentillion**.

## 4. Name construction (n ≥ 1000) — the "Xilli" composition

Split n into 3-digit chunks (big-endian). Higher chunks append "illi"
(vowel-stripped); the final chunk takes the normal -illion ending. Zero
chunks use the "nilli"/"nillion" placeholders.

- 1000 → "milli" + "nillion" → **Millinillion**
- 1006 → "milli" + "sextillion" → **Millisextillion** (bare-unit connector:
  strip the base root's vowel first — "mi" → "m" + "illi" = "milli")
- 10996 → "decilli" + "senonagintanongentillion" →
  **Decillisenonagintanongentillion** (matches the v3 table exactly)
- 11000 → "undecilli" + "nillion" → **Undecillinillion** (10^33003, the
  library's upper limit)

The assembled name is capitalized once at the start
("Decillisenonagintanongentillion", not "DecilliNovenonaginta...").

## 5. Decimal-place ordinals

For decimal place p ≥ 3, write p = 3m + r (r = p mod 3):

- r = 0 → `{m-1 th illion}ths`     (p=3 → thousandths, p=6 → millionths)
- r = 1 → `ten-{m-1 th illion}ths`     (p=4 → ten-thousandths)
- r = 2 → `hundred-{m-1 th illion}ths` (p=5 → hundred-thousandths)

where m-1 = 0 refers to "thousand". p = 1 → tenth(s), p = 2 → hundredth(s).
Singular forms drop the final "s" ("One tenth"). Extreme examples:
p = 102 → "trestrigintillionths", p = 33003 → "undecillinillionths".

The v3 code derived ordinals through the digit-length table at p+1 with a
modulus trick — correct for most places but stateful and stale-prone at the
range edges; v4 computes them directly (equivalence test:
`packages/core/test/unit/ordinals.test.ts`, 27,000+ places vs the v3-derived
expectation).

## 6. Changing name rules

If a future standard correction is desired (e.g. adopting "quinqua" for 5),
it will **break golden equivalence with the v3 table**. The procedure is:

1. Add an ADR to `docs/DECISIONS.md` describing the deviation and its scope.
2. Update `illions.ts` and the golden test to encode the deviation explicitly
   (an allowlist of lengths whose names differ, with both spellings).
3. Major version bump + migration doc entry — published names are API.
