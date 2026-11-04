# Locale SPEC: `ig` (Igbo)

Status: **IMPLEMENTED in 4.4.0**. Orthography: standard Igbo with subscript
vowels/dots where attested (abụọ, atọ, anọ, narị, puku), NFC precomposed.

## 1. Authoritative sources

- [Numbers in Igbo — emeriwo4christ](http://emeriwo4christ.blogspot.com/2010/10/numbers-in-igbo.html)
  (full tables: units, iri-na teens, tens, otu narị / narị abụọ, otu puku /
  puku abụọ, otu nde / nde abụọ)
- [Master Any Language — Igbo Numbers](https://www.masteranylanguage.com/c/b/en/98-Igbo-Numbers-Build-Your-Vocabulary)
- [Translation of Igbo and Chinese numerals — ResearchGate](https://www.researchgate.net/publication/305639188_Translation_of_Igbo_and_Chinese_numerals)
  (the "na" coordinator analysis: *iri atọ na anọ* = 34)

## 2. System: decimal, multiplier-after, joined by "na"

- 1 otu · 2 abụọ · 3 atọ · 4 anọ · 5 ise · 6 isii · 7 asaa · 8 asatọ ·
  9 itoolu (variant spellings ịtọọlụ/ịtoolu exist — "itoolu" adopted) · 10 iri
- 11–19: **iri na X** (iri na otu ... iri na itoolu)
- 20–90: **iri + unit** (iri abụọ = 20 ... iri itoolu = 90) — multiplier-after
- 21–99 within a decade: **tens + na + unit** (iri abụọ na otu = 21;
  iri atọ na anọ = 34) — "na" is the joiner everywhere
- 100 **otu narị** (explicit otu BEFORE narị — attested); 200–900
  **narị + unit** (narị abụọ, narị atọ, narị ise ... narị itoolu) — the
  100-vs-200 asymmetry is as attested, do not "regularize" it
- 1,000 **otu puku**; 2,000–900,000 **puku + group words** (puku abụọ)
- 1,000,000 **otu nde**; 2,000,000+ **nde + group words** (nde abụọ, nde ise)
- 1,000,000,000 **otu ijiri**; ijiri + group words above

## 3. Joining

Every component boundary inside a number uses **na**: 1,234,567 →
"nde otu na puku narị abụọ na atọ na anọ na narị ise na iri isii na asaa".
Mapping: `andWord: "na"`, `groupSeparator: " na "`, `andStyle: "british"`.

## 4. Scale words beyond ijiri

Attested: nde (10^6), ijiri (10^9). Beyond 10^9 the locale code-switches to
the English Conway-Wechsler name (documented media practice, as with fr/ha/yo).

## 5. OPEN items (rejected loudly, not guessed)

- **Ordinals**: periphrastic **nke-linker** + cardinal, SHIPPED: **nke mbụ**
  (first, special lexical form), nke abụọ, nke atọ... Sources:
  [ResearchGate Igbo/Igala comparison](https://www.researchgate.net/publication/304703424_A_Comparative_Analysis_of_the_Numerals_and_CountingSystems_of_Igbo_and_Igala),
  [Harvard Igbo materials](https://elias.unix.fas.harvard.edu/languages/Igbo/Beginning/5/Numbers).
- **Decimals**: no verified Igbo decimal-place ordinal forms; decimal inputs
  reject until `decimalOrdinal` is sourced.
- **Negative prefix**: kept as the English loan "(negative) " pending a source.
- **Zero**: "efu" (attested in Igbo arithmetic teaching, e.g. "efu" = empty);
  flag if a better standard form is sourced.

## 6. Worked examples → test assertions

| Input | displayWord |
|-------|-------------|
| 0 / 1 / 10 / 11 / 19 | efu / otu / iri / iri na otu / iri na itoolu |
| 20 / 21 / 34 / 90 / 99 | iri abụọ / iri abụọ na otu / iri atọ na anọ / iri itoolu / iri itoolu na itoolu |
| 100 / 101 / 200 / 999 | otu narị / otu narị na otu / narị abụọ / narị itoolu na iri itoolu na itoolu |
| 1000 / 1001 / 1100 / 2000 / 2150 | otu puku / otu puku na otu / otu puku na otu narị / puku abụọ / puku abụọ na otu narị na ise |
| 1000000 / 2000000 / 5000000 | otu nde / nde abụọ / nde ise |
| 1000000000 | otu ijiri |
| 1234567 | nde otu na puku narị abụọ na atọ na anọ na narị ise na iri isii na asaa |
| 1000000000000 | quadrillion otu (code-switch, SPEC §4) |
| -5 | (negative) ise |
