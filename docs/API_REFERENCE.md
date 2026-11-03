# API Reference — js-number-to-word-processor v4

## Installation

```sh
npm i js-number-to-word-processor
```

```ts
// ESM / TypeScript
import JSnumberToWordProcessor from "js-number-to-word-processor";

// CommonJS
const JSnumberToWordProcessor = require("js-number-to-word-processor");

// Browser <script> tag (single file, no other script needed)
// <script src=".../JSnumberToWordProcessor.js"></script>
// window.JSnumberToWordProcessor(...) — the bare callable, like v3.
```

## Signature

```ts
function JSnumberToWordProcessor(
  input: NumberInput | NumberInput[],
  options?: number | ProcessOptions,
): ProcessedNumber[];
```

- **input** — one value or an array:
  - `string` (preferred): exact digits, optional sign, decimal point, exponent
    — `"987"`, `"-98.7"`, `"1e21"`, `"007"`, `".5"`.
  - `number`: convenience for small values; converted via its shortest
    round-trip string (`2**70` yields its honest float value — pass a string
    or `bigint` beyond 2^53 for exactness).
  - `bigint`: exact integers.
  - `boolean`: legacy v3 compatibility — `true` → 1, `false` → 0.
- **options** — a `ProcessOptions` object, or a bare number meaning
  `decimalPlaces` (v3 style: `N("98.765", 3)`).

```ts
interface ProcessOptions {
  decimalPlaces?: number; // integer 0..33003; default 2; 0 = round to whole
  lenient?: boolean;      // arrays: skip invalid entries (default: throw)
}
```

## Result object

One `ProcessedNumber` per processed input, in input order. Field names are
identical to v3.

```ts
interface ProcessedNumber {
  displayNum: string;        // "-8,769.98,588"  (full number, grouped)
  displayWord: string;       // "(negative) Eight Thousand ... (dot) ... hundred-thousandths"
  displayWholeNum: string;   // "8,769"          (no sign)
  displayWholeWord: string;  // no "(negative)" prefix
  displayDecimalNum: string; // ".98,588" or ""
  displayDecimalWord: string;// decimal digit words only (no ordinal), or ""
  negativeInt: boolean;
  decimalPoint: boolean;
  decimalPlaceWord: string;  // "hundred-thousandths" or ""
}
```

### Display formatting (documented v4 — intentional since v3)

- Whole part: comma-grouped in threes from the right → `5,876`.
- **Decimal part: also comma-grouped in threes, anchored at the decimal
  point** → `.98,588`. Each decimal comma therefore lands exactly where the
  words say "Thousand," — a visual aid mapping digit groups onto the words.
  This grouping is intentional and tested; do not "fix" it (see AGENTS.md §3).
- The number of decimal digits shown always equals the requested
  `decimalPlaces`, and the words always describe exactly those digits
  ("display == words" invariant).

## Worked examples (all outputs are asserted by the test suite)

```js
JSnumberToWordProcessor("987");
// 987: Nine Hundred and Eighty-Seven

JSnumberToWordProcessor("123456789012345680");
// 123,456,789,012,345,680: One Hundred and Twenty-Three Quadrillion, Four Hundred and
// Fifty-Six Trillion, Seven Hundred and Eighty-Nine Billion, Twelve Million, Three
// Hundred and Forty-Five Thousand, Six Hundred and Eighty

JSnumberToWordProcessor("-876950");
// -876,950: (negative) Eight Hundred and Seventy-Six Thousand, Nine Hundred and Fifty

JSnumberToWordProcessor("-8769.5", 1);
// -8,769.5: (negative) Eight Thousand, Seven Hundred and Sixty-Nine (dot) Five tenths

JSnumberToWordProcessor("5876.98587695");
// 5,876.99: Five Thousand, Eight Hundred and Seventy-Six (dot) Ninety-Nine hundredths

JSnumberToWordProcessor("5876.985876950", 5);
// 5,876.98,588: ... (dot) Ninety-Eight Thousand, Five Hundred and Eighty-Eight hundred-thousandths

JSnumberToWordProcessor("0.00012", 5);
// 0.00,012: Zero (dot) Twelve hundred-thousandths   (v3 said "Twelve hundredths")

JSnumberToWordProcessor("9.999", 2);
// 10: Ten                                           (v3 said "Ten (dot) Zero hundredths")

JSnumberToWordProcessor("0.995", 2);
// 1: One                                            (exact half-up; v3 float-rounded to 0.99)

JSnumberToWordProcessor("1e21");
// 1,000,000,000,000,000,000,000: One Sextillion     (v3 crashed on the string form)

JSnumberToWordProcessor("0.01");
// 0.01: Zero (dot) One hundredth                    (singular when the value is 1)

JSnumberToWordProcessor(5876985876950n);
// 5,876,985,876,950: Five Trillion, ... (exact beyond 2^53)

JSnumberToWordProcessor(55 > 26);
// 1: One                                            (boolean legacy compat)

JSnumberToWordProcessor(["6677", "-7674.969", "0.00"]);
// [ Six Thousand..., (negative) Seven Thousand..., Zero ]

JSnumberToWordProcessor(["123.98765", "445.556", "84974"], 3);
// 123.988 / 445.556 / 84,974   (whole inputs ignore decimalPlaces)
```

## Errors

All errors extend `NumberToWordError`.

| Error | Thrown when |
|-------|-------------|
| `InvalidNumberError` | Input is not a valid number: `""`, `"   "`, `"abc"`, `"1,234"`, `"$5"`, `NaN`, `Infinity`, `null`, `undefined`, objects. Array inputs include `at index N` context. |
| `NumberTooLargeError` | Whole part exceeds 33003 digits (10^33003 − 1). Carries `maxDigits`. |
| `InvalidOptionsError` | `decimalPlaces` is negative, non-integer, or > 33003; or the options argument has a wrong type. |

`lenient: true` skips invalid **array** entries (v3 behavior). Single inputs
are always validated strictly.

## Named exports

```ts
export default JSnumberToWordProcessor;
export { JSnumberToWordProcessor,                       // named form
         InvalidNumberError, InvalidOptionsError,
         NumberTooLargeError, NumberToWordError,
         decimalPlaceOrdinal, illionName,               // advanced/internals
         MAX_DECIMAL_PLACES,                            // 33003
         MAX_WHOLE_DIGITS };                            // 33003
export type { NumberInput, ProcessOptions, ProcessedNumber, ProcessResult };
```

## Limits

- Whole part: up to **33003 digits** (10^33003 − 1) — the largest
  Conway-Wechsler standard dictionary number range v3 supported.
- Decimal places: 0..33003 (ordinals up to "hundred-decillinovenonagintanongentillionths"
  and beyond, generated algorithmically).
- No dependency on `Intl`, ICU, or network resources; English (short scale) only.

## Migration

See `MIGRATION_v3_to_v4.md` for the complete list of behavior changes and how
to adapt v3 consumers.
