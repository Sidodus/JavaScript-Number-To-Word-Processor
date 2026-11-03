# Bug Audit — JSnumberToWordProcessor v3.0.4

Every defect below was **empirically confirmed against the published v3.0.4
build** (run from `legacy/` in Node, November 2026) during the v4 rewrite.
Each one is locked by a regression test in
`packages/core/test/regression/v3-bugs.test.ts` so it can never silently
return. Where applicable the v3 output is quoted verbatim.

> Not listed here: v3's lack of documentation for the intentional decimal
> comma grouping (see `API_REFERENCE.md` § Display formatting) — an
> undocumented feature, confirmed intentional by the project owner, not a bug.

## Bug 1 — Leading zeros collapse the decimal place value ⚠️ (the "forgotten bug")

**Symptom.** The ordinal word for a decimal with leading zeros was computed
from `String(Number(digits)).length`, erasing leading zeros:

| Input | v3 output | Correct (v4) |
|-------|-----------|--------------|
| `0.0005 @4` | "Five **tenths**" | "Five **ten-thousandths**" |
| `0.00012 @5` | "Twelve **hundredths**" | "Twelve **hundred-thousandths**" |
| `26.00002 @5` | "Two **tenths**" (the v3.0.4 "fix") | "Two **hundred-thousandths**" |
| `0.00123 @5` | "One Hundred and Twenty-Three **thousandths**" | "... **hundred-thousandths**" |

The v3.0.4 changelog framed "26.00002, 5 → Twenty-Six (dot) Two tenths" as a
fixed crash — the crash was fixed but the place value stayed wrong.

**Root cause.** `processDecimalNumber` recomputed `decimalPlace` from the
numeric value of the kept digits instead of the requested digit count.

**v4 rule.** The ordinal is derived directly from the requested decimal place
(`decimalPlaceOrdinal`); kept digits are exactly `decimalPlaces` wide.

## Bug 2 — Rounding into a whole number still says "(dot) Zero ..."

| Input | v3 output | Correct (v4) |
|-------|-----------|--------------|
| `9.999 @2` | "10.00: **Ten (dot) Zero hundredths**" | "10: Ten" |
| `0.999 @2` | "1.00: One (dot) Zero hundredths" | "1: One" |
| `123.999 @0` | "124.00: One Hundred and Twenty-Four (dot) Zero hundredths" | "124: One Hundred and Twenty-Four" |

The rounding carry correctly bumped the whole part but left the all-zero
decimal in place and verbalized it.

**v4 rule.** After rounding, an all-zero decimal part is dropped entirely
(display and words).

## Bug 3 — Binary float rounding artifacts (`toFixed`)

| Input | v3 output | Correct (v4) |
|-------|-----------|--------------|
| `0.995 @2` | "0.99" | "1.00" → whole "1" |
| `2.675 @2` | "2.67" | "2.68" |

v3 rounded via `Number("0." + digits).toFixed(n)`, inheriting binary floating
point error (`0.995` is stored as `0.99499999...`).

**v4 rule.** Half-up rounding on the exact digit string; no float arithmetic
anywhere in the conversion path.

## Bug 4 — Display and words disagree on padded decimals

| Input | v3 output |
|-------|-----------|
| `.5` (default 2 places) | display `0.50` but words "Fifty **tenths**" |
| `-0.5 @2` | display `-0.50` but words "Fifty **tenths**" |

The display padded to the requested places while the words described the
unpadded significant value.

**v4 rule.** Invariant: display and words always describe the same digits
(`0.50` → "Fifty hundredths").

## Bug 5 — Scientific notation mangled or crashing

| Input | v3 output |
|-------|-----------|
| `2 ** 70` (number → "1.1805916207174113e+21") | "One (dot) Zero hundredths" (catastrophic garbage: the `e+21` fragment landed in the decimal part) |
| `"1e21"` (string) | **RangeError crash** (`BigInt("1e21")` rejects exponent strings) |
| `1e21` (number) | worked by luck (`BigInt(1e21)` accepts the number) |

**v4 rule.** Exponent notation is parsed and expanded exactly for both
strings and numbers ("1e21" → One Sextillion; `2**70` → its honest
round-trip value `1,180,591,620,717,411,300,000`).

## Bug 6 — Junk output for all-zero decimals and dotted literals

| Input | v3 output | v4 |
|-------|-----------|-----|
| `"5."` | "Five (dot) Zero " (dangling space, no unit) | "Five" / "5" |
| `"0.00"` | "Zero (dot) Zero " | "Zero" / "0" |
| `26.00000232 @5` | "26.00: Twenty-Six (dot) Zero " | "26: Twenty-Six" |

**v4 rule.** All-zero decimals are omitted cleanly (see invariant 3).

## Bug 7 — No error contract

| Input | v3 behavior |
|-------|-------------|
| `""`, `" "` | Silently converted to "Zero" (`Number("") === 0`) |
| `"abc"`, `"12abc"`, `"1,234"`, `NaN` | Silently returned `[]` |
| `null` | Raw `TypeError: Cannot convert null to a BigInt` |
| `Infinity` | Raw `RangeError` from `BigInt(Infinity)` |

**v4 rule.** Typed, descriptive errors (`InvalidNumberError` with actionable
messages); arrays throw with `at index N`; `lenient: true` restores the v3
skip behavior explicitly.

## Bug 8 — Negative zero is negative

| Input | v3 output | v4 |
|-------|-----------|-----|
| `"-0"` | "(negative) Zero" | "Zero", `negativeInt: false` |

## Bug 9 — Non-standard "comma + and"

| Input | v3 output | v4 |
|-------|-----------|-----|
| `9012` | "Nine Thousand**,** and Twelve" | "Nine Thousand and Twelve" |
| `1000012` | "One Million**,** and Twelve" | "One Million and Twelve" |
| `123456789012345680` | "...Billion**,** and Twelve Million..." | "...Billion, Twelve Million..." |

Deliberate v4 style decision (ADR-001 in `docs/DECISIONS.md`).

## Bug 10 — Negative decimal lengths silently accepted

The v3 UI accepted any value in the "Change Decimal Length" field, including
negatives; the library silently redirected out-of-range values to 2 places.

**v4.** The library throws `InvalidOptionsError` for negative/non-integer/
>33003 places; the UI validates inline before calling the library.

## Bug 11 — Decimal ordinals ≥ 33002 read stale module state

`decimalPlaceWordFunc` called `curStrLengthFunc(place + 1)`; for place + 1 >
33003 the lookup fell through **without assigning**, so the module-level
`largeNumbers` variable still held the PREVIOUS call's value (shared mutable
state) — producing arbitrarily wrong ordinals for extreme places.

**v4.** `decimalPlaceOrdinal` is pure and covers 1..33003
(`33003` → "undecillinillionths").

## Bug 12 — Oversized numbers returned a fake "SORRY" word sentence

Inputs longer than 33003 digits returned `displayWord:
"SORRY..., YOU JUST EXCEEDED THE SUPPORTED LENGTH OF (10³⁰⁰⁰³) NUMBERS"` as
if it were a conversion result — indistinguishable from real output for
consumers who don't string-match.

**v4.** Throws `NumberTooLargeError` (typed, with `maxDigits` metadata); the
UI renders it as an error alert.

## Near-miss (investigated, NOT a bug)

The 1.3MB `curStrLengthFunc_2.js` table was suspected of an off-by-one illion
shift at its 103-digit boundary. Systematic extraction (33,000 entries) and
independent recomputation proved the table **mathematically correct**
(`docs/CONWAY_WECHSLER.md`). The v4 generator reproduces it entry-for-entry.
The only related error was hard-coded UI header text in v3's `index.html`
calling 10^33003 "Decillinillion" (it is a millinillion-scale value); v4's UI
derives no such claim from static text.
