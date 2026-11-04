# Locale SPEC: `ha` (Hausa)

Status: **IMPLEMENTED in 4.2.0** (pilot for the multiplier-after scale pattern).
Orthography: standard Boko with hooked letters (ɗ, ɓ, ƙ), NFC precomposed.

## 1. Authoritative sources

- [Counting in Hausa — languagesandnumbers.com](https://www.languagesandnumbers.com/how-to-count-in-hausa/en/hau) (systematic generative rules)
- [Numbers in Hausa — Omniglot](https://www.omniglot.com/language/numbers/hausa.htm) (full tables; documents `zambar ɗari` variant for 100,000 — not adopted)
- [Hausa Vocabulary: Numbers — Polyglot Club](https://polyglotclub.com/wiki/Language/Hausa/Vocabulary/Numbers) (`da` conjunction examples)
- [Numbers 1–100 — Nkenne](https://www.nkenne.com/blog/numbers-1-to-100-and-telling-time-in-hausa) (tens table)
- Peace Corps/Niger Hausa lessons & Sigurd (1973): *dubu da ɗari* (1,100) — the "da"-joining analysis.

## 2. Orthography decisions

- Hooked letters mandatory: **ɗ** (ɗaya, huɗu, ɗari), not "d".
- Arabic-loan tens keep the apostrophe: arba'in, saba'in, casa'in.
- Number words lowercase mid-sentence (French-style convention); 90 = **casa'in**
  (the Omniglot "gomiya" variant is a dialect transcription — not adopted).
- Negative prefix: **kept as the English loan "(negative) "** — OPEN ITEM: no
  confidently attested Hausa math-media term was found; do not guess.
- Decimal separator word: unlocalized placeholder "(dot) " — UNREACHABLE,
  because this locale rejects decimals until `decimalOrdinal` is spec'd.

## 3. 0..99 table (generated, not hand-typed)

- 0 sifili; 1 ɗaya; 2 biyu; 3 uku; 4 huɗu; 5 biyar; 6 shida; 7 bakwai; 8 takwas; 9 tara
- 10 goma; 11–19: **goma sha X** (goma sha ɗaya ... goma sha tara) — "sha" is the fused ten-and marker
- Tens: 20 ashirin, 30 talatin, 40 arba'in, 50 hamsin, 60 sittin, 70 saba'in, 80 tamanin, 90 casa'in
- 21–99: **tens + da + unit** (ashirin da ɗaya ... casa'in da tara)

## 4. Scale system: multiplier AFTER the scale word

| Value | Form |
|-------|------|
| 100 | ɗari (bare — no "ɗaya") |
| 200 / 900 | ɗari biyu / ɗari tara |
| 101 / 150 / 999 | ɗari da ɗaya / ɗari da hamsin / ɗari tara da casa'in da tara |
| 1,000 | dubu ɗaya (multiplier spoken — Legit.ng: "dubu daya da daya" = 1001) |
| 2,000 / 10,000 / 100,000 | dubu biyu / dubu goma / dubu ɗari |
| 1,100 | dubu ɗaya da ɗari |
| 1,000,000 | miliyan ɗaya |
| 2,150 | dubu biyu da ɗari da hamsin |

## 5. Joining

EVERY nonzero component is joined by **da** — scale groups and within-group
parts alike: 1,234,567 → "miliyan ɗaya da dubu ɗari biyu da talatin da huɗu da
ɗari biyu da sittin da bakwai". Mapping: `andWord: "da"` (within-group +
final-group join), `groupSeparator: " da "` (between scale groups),
`andStyle: "british"`, `supportsBothStyles: false`.

## 6. Scale names beyond miliyan

Attested loans: miliyan (10^6), biliyan (10^9), tiriliyan (10^12) — as used in
Hausa news media. **Beyond 10^12 the locale code-switches to the English
Conway-Wechsler name** (documented media practice), e.g. 10^15 → "quadrillion
ɗaya". This is a documented practice choice, not an invented word.

## 7. Ordinals & decimals — OPEN (rejected loudly)

No authoritative Hausa ordinal formation was verified (Hausa ordinals are
periphrastic, often using the English loan "na" + number in media). Therefore:
`ordinalize` is NOT provided (the engine's English default would only be
reached for `en`), and decimal inputs REJECT with a descriptive error.
Currency mode works (no ordinals needed).

## 8. Worked examples → test assertions (test/unit/locales.test.ts)

| Input | displayWord |
|-------|-------------|
| 0 / 1 / 10 | sifili / ɗaya / goma |
| 11 / 19 | goma sha ɗaya / goma sha tara |
| 21 / 40 / 90 / 99 | ashirin da ɗaya / arba'in / casa'in / casa'in da tara |
| 100 / 101 / 150 / 200 / 999 | ɗari / ɗari da ɗaya / ɗari da hamsin / ɗari biyu / ɗari tara da casa'in da tara |
| 1000 / 1001 / 1100 / 2000 / 2150 | dubu ɗaya / dubu ɗaya da ɗaya / dubu ɗaya da ɗari / dubu biyu / dubu biyu da ɗari da hamsin |
| 10,000 / 100,000 | dubu goma / dubu ɗari |
| 1e6 / 2e6 / 1e9 / 1e12 / 1e15 | miliyan ɗaya / miliyan biyu / biliyan ɗaya / tiriliyan ɗaya / quadrillion ɗaya |
| 1,234,567 | miliyan ɗaya da dubu ɗari biyu da talatin da huɗu da ɗari biyu da sittin da bakwai |
| -5 | (negative) biyar |
