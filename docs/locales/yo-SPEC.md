# Locale SPEC: `yo` (Yorùbá)

Status: **IMPLEMENTED in 4.3.0** (flagship locale — the mixed additive/subtractive
vigesimal system). Orthography: standard Yorùbá diacritics (ọ̀, ẹ̀, ẹ́, á...),
NFC precomposed.

## 1. Authoritative sources

- [Yoruba numerals — Wikipedia](https://en.wikipedia.org/wiki/Yoruba_numerals)
  (base-20 analysis citing Lounge 2009; the 1–19 table, the decade anchors, the
  hundreds chain, and the cowrie-register large numbers are quoted from it)
- [Numbers in Yoruba — Preply](https://preply.com/en/blog/numbers-in-yoruba)
  (the `lé` linker for 21–24: "ọ̀kan ... connected to ogún with lé")
- Science in Yorùbá (òdo = zero; Àád- forms as subtractions)

## 2. Register decision (documented)

Yorùbá has a traditional cowrie-register for large numbers (200-based:
*ẹgbẹ̀fà* = 1,200, *ẹgbàá* = 2,000, *ọ̀kẹ́* bags above 20,000) — beautiful but
tied to a counting register that modern prose no longer uses above a thousand.
**This locale ships the modern written register**: traditional words for
0–999 (fully authentic, table-driven) + decimal thousands (*ẹgbẹ̀rún méjì*
"thousand twice" — documented in the Wikipedia article as the newer form) +
loan scales *mílíọ̀nù* / *bílíọ̀nù* (standard in Yorùbá media). This matches
how modern Yorùbá newspapers render numbers.

## 3. 0..99 table (generated from the rules below)

- 0 òdo; 1 ọ̀kan; 2 èjì; 3 ẹ̀ta; 4 ẹ̀rin; 5 àrún; 6 ẹ̀fà; 7 èje; 8 ẹ̀jọ; 9 ẹ̀sán
- 10 ẹ̀wá; 11–14 ọ̀kanlá / èjìlá / ẹ̀tàlá / ẹ̀rìnlá
- 15 ẹ̀ẹ́dógún (5-from-20, special form)
- 16–19 ẹ̀rìndínlógún / ẹ̀tàdínlógún / èjìdínlógún / ọ̀kàndínlógún
- Decade anchors: 20 ogún · 30 ọgbọ̀n · 40 ogójì · 50 àádọ́ta · 60 ọgọ́ta ·
  70 àádọ́rin · 80 ọgọ́rin · 90 àádọ́rùn-ún
- **Anchor+1..4 (additive, lé)**: ogún lé ọ̀kan, ogún lé èjì, ogún lé ẹ̀ta,
  ogún lé ẹ̀rin ...
- **Anchor−5 (special fives)**: 25 ẹ̀ẹ́dọ́gbọ̀n; 35 aárùn-dínlógójì;
  45 aárùn-dínlàádọ́ta; 55 aárùn-dínlọ́ta; 65 aárùn-dínlàádọ́rin;
  75 aárùn-dínlọ́rin; 85 aárùn-dínlàádọ́rùn-ún; 95 aárùn-dínlọ̀rún-ún
- **Anchor−4..1 (subtractive, dín)**: 26 ẹ̀rìndínlọ́gbọ̀n · 27 ẹ̀tàdínlọ́gbọ̀n ·
  28 èjìdínlọ́gbọ̀n · 29 ọ̀kàndínlọ́gbọ̀n ... (same pattern per decade, against
  the NEXT anchor: 36–39 → lógójì, 46–49 → làádọ́ta, 56–59 → lọ́ta,
  66–69 → làádọ́rin, 76–79 → lọ́rin, 86–89 → làádọ́rùn-ún, 96–99 → lọ̀rún-ún)

## 4. Hundreds (traditional, all ten forms documented)

100 ọgọ́rùn-ún · 200 igba · 300 ọ̀ọ́dúrún (400−100) · 400 irinwó ·
500 ẹ̀ẹ́dẹ́gbẹ̀ta (600−100) · 600 ẹgbẹ̀ta · 700 ẹ̀ẹ́dẹ́gbẹ̀rin · 800 ẹgbẹ̀rin ·
900 ẹ̀ẹ́dẹ́gbẹ̀rún (1000−100). Remainder juxtaposes directly (Wikipedia: "no
àti or lé joining word is documented; compounds are built directly"):
250 = "igba àádọ́ta".

## 5. Thousands (modern decimal register)

1,000 = **ẹgbẹ̀rún** (bare). 2,000–10,000 use the documented multipliers
*ẹgbẹ̀rún méjì / mẹ́ta / mẹ́rin / márùn-ún / mẹ́fà / mèje / mẹ́jọ / mẹ́sàn-án /
mẹ́wá*. Multipliers above 10 juxtapose the traditional group word
(*ẹgbẹ̀rún ọ̀kanlá* = 11,000 — modern convention, flagged). 100,000 =
"ẹgbẹ̀rún ọgọ́rùn-ún" (thousand hundred).

## 6. Scale loans

mílíọ̀nù (10^6), bílíọ̀nù (10^9) — standard in Yorùbá media; composition
"mílíọ̀nù kan / méjì / márùn-ún" with the object-numeral multipliers
(kan, méjì, mẹ́ta, mẹ́rin, márùn-ún, mẹ́fà, mèje, mẹ́jọ, mẹ́sàn-án, mẹ́wá) for
1–10, group-word juxtaposition above 10. Beyond 10^9 the locale code-switches
to the English Conway-Wechsler name (documented media practice — *tíríliọ̀nù*
is not confidently attested).

## 7. Ordinals & decimals — OPEN (rejected loudly)

Yorùbá ordinals are periphrastic ("èyí tí ó kẹ́ta" = "the one that is third")
— a different sentence structure the engine does not model, so `ordinalize`
is NOT provided and ordinal output rejects. Decimal-place ordinals are
likewise unverified → decimal inputs reject. Currency mode works.

## 8. Worked examples → test assertions

| Input | displayWord |
|-------|-------------|
| 0 / 1 / 10 / 15 / 19 | òdo / ọ̀kan / ẹ̀wá / ẹ̀ẹ́dógún / ọ̀kàndínlógún |
| 20 / 21 / 25 / 28 / 30 | ogún / ogún lé ọ̀kan / ẹ̀ẹ́dọ́gbọ̀n / èjìdínlọ́gbọ̀n / ọgbọ̀n |
| 35 / 40 / 45 / 55 / 65 / 75 / 85 / 95 | aárùn-dínlógójì / ogójì / aárùn-dínlàádọ́ta / aárùn-dínlọ́ta / aárùn-dínlàádọ́rin / aárùn-dínlọ́rin / aárùn-dínlàádọ́rùn-ún / aárùn-dínlọ̀rún-ún |
| 99 | ọ̀kàndínlọ̀rún-ún |
| 100 / 200 / 300 / 400 / 500 / 600 / 700 / 800 / 900 | ọgọ́rùn-ún / igba / ọ̀ọ́dúrún / irinwó / ẹ̀ẹ́dẹ́gbẹ̀ta / ẹgbẹ̀ta / ẹ̀ẹ́dẹ́gbẹ̀rin / ẹgbẹ̀rin / ẹ̀ẹ́dẹ́gbẹ̀rún |
| 250 / 999 | igba àádọ́ta / ẹ̀ẹ́dẹ́gbẹ̀rún ọ̀kàndínlọ̀rún-ún |
| 1000 / 2000 / 3000 / 10000 / 11000 | ẹgbẹ̀rún / ẹgbẹ̀rún méjì / ẹgbẹ̀rún mẹ́ta / ẹgbẹ̀rún mẹ́wá / ẹgbẹ̀rún ọ̀kanlá |
| 100000 / 1000000 / 2000000 / 5000000 | ẹgbẹ̀rún ọgọ́rùn-ún / mílíọ̀nù kan / mílíọ̀nù méjì / mílíọ̀nù márùn-ún |
| 1234567 | mílíọ̀nù kan ẹgbẹ̀rún igba ọgbọ̀n lé ẹ̀rin ẹ̀ẹ́dẹ́gbẹ̀ta ẹ̀tàdínlàádọ́rin |
| 1000000000 / 1000000000000 | bílíọ̀nù kan / quadrillion kan (code-switch, SPEC §6) |
| -5 | (negative) àrún |
