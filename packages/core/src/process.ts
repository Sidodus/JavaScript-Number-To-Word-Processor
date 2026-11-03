/**
 * Processing orchestrator: validates options, parses inputs, applies exact
 * string rounding, and assembles the ProcessedNumber result objects.
 *
 * Core invariants (see docs/ARCHITECTURE.md):
 * 1. displayNum and displayWord always describe the SAME digits.
 * 2. Rounding is half-up on the exact digit string - no float arithmetic.
 * 3. A rounded value whose decimal digits are all zero renders as a whole
 *    number (e.g. 9.999 @2 -> "Ten", not "Ten (dot) Zero hundredths").
 */

import { groupDigits } from "./format.js";
import { InvalidOptionsError, InvalidNumberError } from "./errors.js";
import { decimalPlaceOrdinal, MAX_DECIMAL_PLACES } from "./ordinals.js";
import { parseInput, type ParsedNumber } from "./parse.js";
import type { NumberInput, ProcessOptions, ProcessedNumber } from "./types.js";
import { wholePartToWords } from "./words.js";

/** Rounds half-up on the exact digit string. Returns null when all kept digits are zero. */
function roundDecimalDigits(decimals: string, places: number): { digits: string | null; carry: boolean } {
  if (places === 0) {
    const first = decimals.charAt(0);
    return { digits: null, carry: first >= "5" };
  }

  const kept = decimals.slice(0, places).padEnd(places, "0");
  const rest = decimals.slice(places);

  if (rest.charAt(0) >= "5") {
    // Half-up: increment the kept digits as an exact big integer.
    const incremented = (BigInt(kept) + 1n).toString().padStart(places, "0");
    if (incremented.length > places) {
      // 0.999 @2 style overflow: the whole part absorbs the carry.
      return { digits: null, carry: true };
    }
    return { digits: isAllZeros(incremented) ? null : incremented, carry: false };
  }

  return { digits: isAllZeros(kept) ? null : kept, carry: false };
}

function addCarry(whole: string, carry: boolean): string {
  if (!carry) {
    return whole;
  }
  return (BigInt(whole) + 1n).toString();
}

function isAllZeros(digits: string): boolean {
  return /^0*$/.test(digits);
}

/** Assembles the result object for one parsed number at the given decimal precision. */
function buildResult(
  parsed: ParsedNumber,
  decimalPlaces: number | undefined,
): ProcessedNumber {
  // Whole-number inputs keep their whole shape regardless of decimalPlaces (v3 parity).
  if (parsed.decimals === null) {
    const wholeWord = wholePartToWords(parsed.whole);
    const grouped = groupDigits(parsed.whole);
    return {
      displayNum: parsed.negative ? `-${grouped}` : grouped,
      displayWord: parsed.negative ? `(negative) ${wholeWord}` : wholeWord,
      displayWholeNum: grouped,
      displayWholeWord: wholeWord,
      displayDecimalNum: "",
      displayDecimalWord: "",
      negativeInt: parsed.negative,
      decimalPoint: false,
      decimalPlaceWord: "",
    };
  }

  const places = decimalPlaces === undefined ? 2 : decimalPlaces;
  const { digits, carry } = roundDecimalDigits(parsed.decimals, places);
  const whole = addCarry(parsed.whole, carry);

  // If rounding produced an all-zero decimal the value is a whole number:
  // the sign is dropped when the entire value became zero (e.g. -0.004 @2).
  const negative = parsed.negative && !(whole === "0" && digits === null);

  const groupedWhole = groupDigits(whole);
  const wholeWord = wholePartToWords(whole);

  if (digits === null) {
    return {
      displayNum: negative ? `-${groupedWhole}` : groupedWhole,
      displayWord: negative ? `(negative) ${wholeWord}` : wholeWord,
      displayWholeNum: groupedWhole,
      displayWholeWord: wholeWord,
      displayDecimalNum: "",
      displayDecimalWord: "",
      negativeInt: negative,
      decimalPoint: false,
      decimalPlaceWord: "",
    };
  }

  // Decimal words describe exactly the displayed digits; the ordinal comes
  // from the requested place. Value 1 keeps singular grammar ("One tenth").
  const decimalValue = BigInt(digits);
  const decimalDigitWord = decimalValue === 0n ? "Zero" : wholePartToWords(digits);
  const ordinal = decimalPlaceOrdinal(places, decimalValue === 1n);

  const groupedDecimal = groupDigits(digits);
  const negativePrefix = negative ? "(negative) " : "";

  return {
    displayNum: `${negative ? "-" : ""}${groupedWhole}.${groupedDecimal}`,
    displayWord: `${negativePrefix}${wholeWord} (dot) ${decimalDigitWord} ${ordinal}`,
    displayWholeNum: groupedWhole,
    displayWholeWord: wholeWord,
    displayDecimalNum: `.${groupedDecimal}`,
    displayDecimalWord: decimalDigitWord,
    negativeInt: negative,
    decimalPoint: true,
    decimalPlaceWord: ordinal,
  };
}

/** Validates the second argument (number shorthand or options object). */
function resolveOptions(options: number | ProcessOptions | undefined): ProcessOptions {
  if (options === undefined) {
    return {};
  }

  if (typeof options === "number") {
    return validateDecimalPlaces(options);
  }

  if (typeof options !== "object" || options === null) {
    throw new InvalidOptionsError(
      `Invalid options argument: expected an options object or a decimal-place number, received ${typeof options}.`,
    );
  }

  const resolved: ProcessOptions = { ...options };
  if (options.decimalPlaces !== undefined) {
    validateDecimalPlaces(options.decimalPlaces);
  }
  return resolved;
}

function validateDecimalPlaces(value: number): ProcessOptions {
  if (typeof value !== "number" || !Number.isInteger(value) || value < 0 || value > MAX_DECIMAL_PLACES) {
    throw new InvalidOptionsError(
      `decimalPlaces must be an integer between 0 and ${MAX_DECIMAL_PLACES}, received ${String(value)}. ` +
        `Negative decimal lengths are not supported.`,
    );
  }
  return { decimalPlaces: value };
}

/** Wraps an error with array-position context when processing arrays. */
function withIndexContext(error: unknown, index: number): unknown {
  if (error instanceof InvalidNumberError && !error.message.includes("at index")) {
    return new InvalidNumberError(`Invalid input at index ${index}: ${error.message}`);
  }
  return error;
}

/**
 * Converts one input, or an array of inputs, into processed results.
 *
 * @param input    A single {@link NumberInput} or an array of them.
 * @param options  A {@link ProcessOptions} object, or a bare decimal-place
 *                 number (v3 style: `N("98.765", 3)`).
 * @returns One {@link ProcessedNumber} per processed input, in input order.
 */
export function processNumber(
  input: NumberInput | NumberInput[],
  options?: number | ProcessOptions,
): ProcessedNumber[] {
  const resolved = resolveOptions(options);

  if (Array.isArray(input)) {
    const results: ProcessedNumber[] = [];
    for (let index = 0; index < input.length; index++) {
      try {
        const parsed = parseInput(input[index]);
        results.push(buildResult(parsed, resolved.decimalPlaces));
      } catch (error) {
        if (resolved.lenient === true) {
          continue;
        }
        throw withIndexContext(error, index);
      }
    }
    return results;
  }

  const parsed = parseInput(input);
  return [buildResult(parsed, resolved.decimalPlaces)];
}
