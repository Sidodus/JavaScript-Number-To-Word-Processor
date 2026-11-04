# Locale SPEC: <code> (<Language>)

> This file is the ONLY place implementation starts. Fill every section with
> quoted rules from the authoritative source(s) before writing `src/locales/<code>.ts`.
> See docs/LOCALES.md for the process and ADR-008 for the exactness contract.

## 1. Authoritative sources

- Reference 1: <title, publisher, section covering numerals>
- Reference 2: <...>

## 2. Orthography & script decisions

- Alphabet/diacritics (NFC precomposed?), capitalization convention,
  regional variant chosen (and why).

## 3. 0..99 table

Derive the generation algorithm (units, teens, tens, the "et"-style joins,
elisions, pluralizations) - fr.ts `buildSmallNumbers()` is the reference shape.

## 4. Hundreds / thousands rules

cent/cents-style inflection? "un mille"-style article rules?
(=> `hundredPhraseFor`, `thousandPhraseFor`)

## 5. Scale system

Short scale / long scale / vigesimal / lakh-crore? Names for 10^6, 10^9,
10^12, ... with pluralization rules. (=> `scaleWordFor`; default is the
English Conway-Wechsler generator.)

## 6. Joining & separators

Does an "and"-like joiner exist? Inter-group separator: comma, space, "wa"/"na"/"et"?
(=> `andStyle`, `supportsBothStyles`, `groupSeparator`)

## 7. Ordinals

Irregulars (premier/neuvième/cinquième-family), article rules
("un million" -> "millionième"), compound forms. (=> `ordinalize`)

## 8. Negatives & decimals

Negative prefix; decimal separator word ("virgule"/"point"); if decimal-place
ordinals can be localized now, define `decimalOrdinal` - otherwise state the
limitation (decimal inputs will be rejected).

## 9. Worked examples (these become the test assertions)

| Input | Expected displayWord |
|-------|----------------------|
| 0 | |
| 1 | |
| 21 | |
| 80 / 81 / 90 / 91 / 99 | |
| 100 / 101 / 200 / 201 | |
| 1000 / 1001 / 1100 / 2000 | |
| 1e6 / 2e6 / 1e9 / 2e9 / 1e12 | |
| 123456789 | |
| -5 | |
| ordinal: 1, 21, 100, 1e6 | |
