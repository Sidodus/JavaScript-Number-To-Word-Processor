/**
 * Processing orchestrator: validates options, parses inputs, applies exact
 * string rounding, and assembles the ProcessedNumber result objects.
 *
 * Core invariants (see docs/ARCHITECTURE.md):
 * 1. displayNum and displayWord always describe the SAME digits.
 * 2. Rounding is half-up on the exact digit string - no float arithmetic.
 * 3. A rounded value whose decimal digits are all zero renders as a whole
 *    number (e.g. 9.999 @2 -> "Ten", not "Ten (dot) Zero hundredths").
 *
 * v4.1 additions (all additive, default behaviour unchanged):
 * - style: "british" (default) | "american"
 * - locale: registry key (default "en")
 * - output: "cardinal" (default) | "ordinal"
 * - currency: money words ("One Thousand, Two Hundred and Thirty-Four Naira,
 *   Fifty-Six Kobo") instead of the "(dot) ... hundredths" sentence.
 */

import { groupDigits } from "./format.js";
import { InvalidOptionsError, InvalidNumberError } from "./errors.js";
import { decimalPlaceOrdinal, MAX_DECIMAL_PLACES } from "./ordinals.js";
import { parseInput, type ParsedNumber } from "./parse.js";
import { getLocale } from "./locales/registry.js";
import type { LocaleDefinition } from "./locales/types.js";
import type {
  CurrencyLabels,
  NumberInput,
  ProcessOptions,
  ProcessedNumber,
} from "./types.js";
import { wholePartToWords, type WordStyle } from "./words.js";
import { wholePartToOrdinalWords } from "./ordinalWords.js";

interface ResolvedOptions {
  decimalPlaces?: number;
  lenient: boolean;
  locale: LocaleDefinition;
  style: WordStyle;
  output: "cardinal" | "ordinal";
  currency?: CurrencyLabels;
}

/** Rounds half-up on the exact digit string. Returns null when all kept digits are zero. */
function roundDecimalDigits(
  decimals: string,
  places: number,
): { digits: string | null; carry: boolean } {
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

/** Whole (or ordinal) words for a canonical digit string in the resolved locale/style. */
function wordsForDigits(
  digits: string,
  options: ResolvedOptions,
): string {
  return options.output === "ordinal"
    ? wholePartToOrdinalWords(digits, options.locale, options.style)
    : wholePartToWords(digits, options.locale, options.style);
}

/** Assembles the result object for one parsed number. */
function buildResult(parsed: ParsedNumber, options: ResolvedOptions): ProcessedNumber {
  if (options.currency !== undefined) {
    return buildCurrencyResult(parsed, options);
  }

  // Whole-number inputs keep their whole shape regardless of decimalPlaces (v3 parity).
  if (parsed.decimals === null) {
    const wholeWord = wordsForDigits(parsed.whole, options);
    const grouped = groupDigits(parsed.whole);
    return {
      displayNum: parsed.negative ? `-${grouped}` : grouped,
      displayWord: parsed.negative ? `${options.locale.negativePrefix}${wholeWord}` : wholeWord,
      displayWholeNum: grouped,
      displayWholeWord: wholeWord,
      displayDecimalNum: "",
      displayDecimalWord: "",
      negativeInt: parsed.negative,
      decimalPoint: false,
      decimalPlaceWord: "",
      currency: null,
    };
  }

  const places = options.decimalPlaces === undefined ? 2 : options.decimalPlaces;
  const { digits, carry } = roundDecimalDigits(parsed.decimals, places);
  const whole = addCarry(parsed.whole, carry);

  // If rounding produced an all-zero decimal the value is a whole number:
  // the sign is dropped when the entire value became zero (e.g. -0.004 @2).
  const negative = parsed.negative && !(whole === "0" && digits === null);

  const groupedWhole = groupDigits(whole);
  const wholeWord = wordsForDigits(whole, options);

  if (digits === null) {
    return {
      displayNum: negative ? `-${groupedWhole}` : groupedWhole,
      displayWord: negative ? `${options.locale.negativePrefix}${wholeWord}` : wholeWord,
      displayWholeNum: groupedWhole,
      displayWholeWord: wholeWord,
      displayDecimalNum: "",
      displayDecimalWord: "",
      negativeInt: negative,
      decimalPoint: false,
      decimalPlaceWord: "",
      currency: null,
    };
  }

  // Decimal words describe exactly the displayed digits; the ordinal comes
  // from the requested place. Value 1 keeps singular grammar ("One tenth").
  // Locales without a decimalOrdinal hook (non-English, v4.1) reject decimals
  // rather than emitting mixed-language ordinals.
  if (options.locale.decimalOrdinal === undefined && options.locale.code !== "en") {
    throw new InvalidOptionsError(
      `Locale "${options.locale.code}" does not support decimal numbers yet ` +
        `(no decimalOrdinal hook) - use whole numbers or currency mode, or see docs/LOCALES.md.`,
    );
  }
  const decimalValue = BigInt(digits);
  const decimalDigitWord = decimalValue === 0n ? "Zero" : wholePartToWords(digits, options.locale, options.style);
  const ordinal = decimalPlaceOrdinal(places, decimalValue === 1n);

  const groupedDecimal = groupDigits(digits);
  const negativePrefix = negative ? options.locale.negativePrefix : "";

  return {
    displayNum: `${negative ? "-" : ""}${groupedWhole}.${groupedDecimal}`,
    displayWord: `${negativePrefix}${wholeWord}${options.locale.dotSeparator}${decimalDigitWord} ${ordinal}`,
    displayWholeNum: groupedWhole,
    displayWholeWord: wholeWord,
    displayDecimalNum: `.${groupedDecimal}`,
    displayDecimalWord: decimalDigitWord,
    negativeInt: negative,
    decimalPoint: true,
    decimalPlaceWord: ordinal,
    currency: null,
  };
}

/** Default plural for a currency label: invariable when it already ends in "s" ("Naira" stays "Naira"). */
function defaultPlural(label: string): string {
  return label.toLowerCase().endsWith("s") ? label : `${label}s`;
}

/**
 * Currency mode (v4.1): money words instead of the decimal sentence.
 * Money is always 2 minor places when a minor label is provided, else whole
 * major units. A zero minor part is omitted from the sentence.
 */
function buildCurrencyResult(parsed: ParsedNumber, options: ResolvedOptions): ProcessedNumber {
  const currency = options.currency as CurrencyLabels;
  const hasMinor = currency.minor !== undefined;
  const places = hasMinor ? 2 : 0;
  const decimals = parsed.decimals ?? "0";

  const { digits, carry } = roundDecimalDigits(decimals, places);
  const whole = addCarry(parsed.whole, carry);
  const negative = parsed.negative && !(whole === "0" && digits === null);

  const groupedWhole = groupDigits(whole);
  const majorWords = wordsForDigits(whole, options);
  const majorValue = BigInt(whole);
  const majorLabel =
    majorValue === 1n ? currency.major : (currency.majorPlural ?? defaultPlural(currency.major));

  let displayWord = `${majorWords} ${majorLabel}`;
  let minorWords = "";
  let minorLabel: string | null = null;

  if (digits !== null) {
    const minorValue = BigInt(digits);
    if (minorValue > 0n && currency.minor !== undefined) {
      minorWords = wholePartToWords(digits, options.locale, options.style);
      minorLabel =
        minorValue === 1n ? currency.minor : (currency.minorPlural ?? defaultPlural(currency.minor));
      displayWord += `, ${minorWords} ${minorLabel}`;
    }
  }

  if (currency.suffix !== undefined) {
    displayWord += ` ${currency.suffix}`;
  }

  const negativePrefix = negative ? options.locale.negativePrefix : "";
  const groupedDecimal = digits !== null ? groupDigits(digits) : "";

  return {
    displayNum: `${negative ? "-" : ""}${groupedWhole}${digits !== null ? `.${groupedDecimal}` : ""}`,
    displayWord: `${negativePrefix}${displayWord}`,
    displayWholeNum: groupedWhole,
    displayWholeWord: majorWords,
    displayDecimalNum: digits !== null ? `.${groupedDecimal}` : "",
    displayDecimalWord: minorWords,
    negativeInt: negative,
    decimalPoint: digits !== null,
    decimalPlaceWord: "",
    currency: { majorLabel, minorLabel, suffix: currency.suffix ?? null },
  };
}

/** Validates the second argument (number shorthand or options object). */
function resolveOptions(options: number | ProcessOptions | undefined): ResolvedOptions {
  if (options === undefined) {
    return {
      lenient: false,
      locale: getLocale("en"),
      style: "british",
      output: "cardinal",
    };
  }

  if (typeof options === "number") {
    return {
      ...validateDecimalPlaces(options),
      lenient: false,
      locale: getLocale("en"),
      style: "british",
      output: "cardinal",
    };
  }

  if (typeof options !== "object" || options === null) {
    throw new InvalidOptionsError(
      `Invalid options argument: expected an options object or a decimal-place number, received ${typeof options}.`,
    );
  }

  const locale = getLocale(options.locale ?? "en");
  const resolved: ResolvedOptions = {
    lenient: options.lenient === true,
    locale,
    // The default style comes FROM the locale (French has no "and"); an
    // explicit `style` is a request that the locale may veto.
    style: validateStyle(options.style ?? locale.andStyle),
    output: validateOutput(options.output),
  };

  // Capability guards (ADR-008): a locale that cannot express a requested
  // feature rejects the call instead of producing impossible output.
  if (
    resolved.output === "ordinal" &&
    resolved.locale.ordinalize === undefined &&
    resolved.locale.code !== "en"
  ) {
    throw new InvalidOptionsError(
      `Locale "${resolved.locale.code}" does not support ordinal output yet ` +
        `(no ordinalize hook) - see docs/LOCALES.md.`,
    );
  }
  if (
    options.style !== undefined &&
    options.style !== locale.andStyle &&
    locale.supportsBothStyles !== true
  ) {
    throw new InvalidOptionsError(
      `Locale "${locale.code}" only supports the "${locale.andStyle}" ` +
        `word style; requested ${JSON.stringify(options.style)}.`,
    );
  }

  if (options.decimalPlaces !== undefined) {
    Object.assign(resolved, validateDecimalPlaces(options.decimalPlaces));
  }

  if (options.currency !== undefined && options.currency !== null) {
    resolved.currency = validateCurrency(options.currency);
  }

  return resolved;
}

function validateDecimalPlaces(value: number): { decimalPlaces: number } {
  if (typeof value !== "number" || !Number.isInteger(value) || value < 0 || value > MAX_DECIMAL_PLACES) {
    throw new InvalidOptionsError(
      `decimalPlaces must be an integer between 0 and ${MAX_DECIMAL_PLACES}, received ${String(value)}. ` +
        `Negative decimal lengths are not supported.`,
    );
  }
  return { decimalPlaces: value };
}

function validateStyle(style: "british" | "american" | undefined): WordStyle {
  if (style === undefined) {
    return "british";
  }
  if (style !== "british" && style !== "american") {
    throw new InvalidOptionsError(
      `style must be "british" or "american", received ${JSON.stringify(style)}.`,
    );
  }
  return style;
}

function validateOutput(output: "cardinal" | "ordinal" | undefined): "cardinal" | "ordinal" {
  if (output === undefined) {
    return "cardinal";
  }
  if (output !== "cardinal" && output !== "ordinal") {
    throw new InvalidOptionsError(
      `output must be "cardinal" or "ordinal", received ${JSON.stringify(output)}.`,
    );
  }
  return output;
}

function validateCurrency(currency: CurrencyLabels): CurrencyLabels {
  if (typeof currency !== "object") {
    throw new InvalidOptionsError("currency must be an object with a major label.");
  }
  const requiredString = (value: unknown, field: string): string | undefined => {
    if (value === undefined) {
      return undefined;
    }
    if (typeof value !== "string" || value.trim().length === 0) {
      throw new InvalidOptionsError(`currency.${field} must be a non-empty string.`);
    }
    return value;
  };

  const major = requiredString(currency.major, "major");
  if (major === undefined) {
    throw new InvalidOptionsError("currency.major is required (e.g. { major: \"Naira\", minor: \"Kobo\" }).");
  }

  const validated: CurrencyLabels = { major };
  const minor = requiredString(currency.minor, "minor");
  if (minor !== undefined) {
    validated.minor = minor;
  }
  const majorPlural = requiredString(currency.majorPlural, "majorPlural");
  if (majorPlural !== undefined) {
    validated.majorPlural = majorPlural;
  }
  const minorPlural = requiredString(currency.minorPlural, "minorPlural");
  if (minorPlural !== undefined) {
    validated.minorPlural = minorPlural;
  }
  const suffix = requiredString(currency.suffix, "suffix");
  if (suffix !== undefined) {
    validated.suffix = suffix;
  }
  return validated;
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
        results.push(buildResult(parsed, resolved));
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
  return [buildResult(parsed, resolved)];
}

export { MAX_DECIMAL_PLACES };
