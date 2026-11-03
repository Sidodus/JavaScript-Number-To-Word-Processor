/**
 * Input parsing: normalizes any accepted input into an exact digit-string
 * representation. All arithmetic downstream operates on these strings -
 * floating point never touches the conversion itself.
 *
 * Accepts (single input): "987", "-4783484773.7634656549", "1e21", "007",
 * 987, -987.5, 987n, true. Rejects everything else with InvalidNumberError.
 */

import { InvalidNumberError, NumberTooLargeError } from "./errors.js";

/** Canonical parsed form of one number. */
export interface ParsedNumber {
  /** True when the value is negative. Never true when the value is zero. */
  negative: boolean;
  /** Whole-part digits without sign or leading zeros ("0" for zero). */
  whole: string;
  /** Decimal digits exactly as written (no rounding), or null for whole numbers. */
  decimals: string | null;
}

/** Largest supported whole part, in digits (v3 parity: numbers up to 10^33003). */
export const MAX_WHOLE_DIGITS = 33003;

/**
 * Matches a plain decimal string: optional sign, optional integer digits,
 * optional .fraction digits (fraction may be empty to accept "5."), optional
 * exponent. At least one digit must be present overall (validated after the
 * match - ".", "-", and "" are rejected).
 */
const DECIMAL_STRING_PATTERN = /^([+-]?)(\d*)(?:\.(\d*))?(?:[eE]([+-]?\d+))?$/;

/**
 * Expands scientific notation into plain digits, exactly.
 * "1.5e3" -> { whole: "1500", decimals: null }
 * "5e-7"  -> { whole: "0", decimals: "0000005" }
 */
function expandExponent(
  negative: boolean,
  intDigits: string,
  fracDigits: string,
  exponent: number,
): { negative: boolean; whole: string; decimals: string | null } {
  const allDigits = intDigits + fracDigits;
  const pointPosition = intDigits.length + exponent; // digits before the decimal point

  let whole: string;
  let decimals: string;

  if (pointPosition <= 0) {
    whole = "0";
    decimals = "0".repeat(-pointPosition) + allDigits;
  } else if (pointPosition >= allDigits.length) {
    whole = allDigits + "0".repeat(pointPosition - allDigits.length);
    decimals = "";
  } else {
    whole = allDigits.slice(0, pointPosition);
    decimals = allDigits.slice(pointPosition);
  }

  return { whole, decimals: decimals.length > 0 ? decimals : null, negative };
}

/** Normalizes a whole-part digit string: strips leading zeros, keeps single "0". */
function normalizeWhole(whole: string): string {
  const stripped = whole.replace(/^0+(?=\d)/, "");
  return stripped;
}

/** Parses one input value into its exact digit-string form. */
export function parseInput(value: unknown): ParsedNumber {
  if (typeof value === "boolean") {
    // Documented v3 compatibility: booleans are the result of comparisons.
    return { negative: false, whole: value ? "1" : "0", decimals: null };
  }

  if (typeof value === "bigint") {
    const negative = value < 0n;
    const whole = normalizeWhole((negative ? -value : value).toString());
    return { negative, whole, decimals: null };
  }

  if (typeof value === "number") {
    if (Number.isNaN(value)) {
      throw new InvalidNumberError(
        "Input is NaN, which is not a valid number. Pass a number, string, bigint, or boolean.",
      );
    }
    if (!Number.isFinite(value)) {
      throw new InvalidNumberError(
        `Input is ${value === Infinity ? "Infinity" : "-Infinity"}, which is not a valid number.`,
      );
    }
    // Shortest round-trip representation; exponent notation is expanded exactly below.
    return parseString(String(value));
  }

  if (typeof value === "string") {
    return parseString(value);
  }

  const received =
    value === null ? "null" : typeof value === "object" ? "an object" : `type ${typeof value}`;
  throw new InvalidNumberError(
    `Invalid input: expected a number, numeric string, bigint, or boolean, but received ${received}.`,
  );
}

/** Parses a numeric string (trimmed, optional sign/dot/exponent) into exact digits. */
export function parseString(raw: string): ParsedNumber {
  const trimmed = raw.trim();
  if (trimmed.length === 0) {
    throw new InvalidNumberError(
      'Invalid input: empty string. Pass a number like "987", "-98.7", or "1e21".',
    );
  }

  const match = DECIMAL_STRING_PATTERN.exec(trimmed);
  // (\d*) always participates (possibly as ""), so require at least one
  // integer digit or at least one fractional digit - ".", "-", and "" fail.
  const hasDigits =
    match !== null &&
    ((match[2] !== undefined && match[2].length > 0) ||
      (match[3] !== undefined && match[3].length > 0));
  if (match === null || !hasDigits) {
    throw new InvalidNumberError(
      `Invalid number: ${JSON.stringify(raw)}. Expected digits with an optional sign, ` +
        `a single decimal point, and an optional exponent (e.g. "987", "-98.7", "1e21"). ` +
        `Comma separators and currency symbols are not accepted - pass plain digits.`,
    );
  }

  // Explicit extraction: match indexes are string | undefined under
  // noUncheckedIndexedAccess even when the match has succeeded.
  const sign = match[1] ?? "";
  const rawIntDigits = match[2] ?? "";
  const fracDigits = match[3];
  const expText = match[4];
  const intDigits = rawIntDigits === "" ? "0" : rawIntDigits;
  const negativeBase = sign === "-";
  const exponent = expText === undefined ? 0 : Number(expText);

  let normalized: { negative: boolean; whole: string; decimals: string | null };
  if (exponent === 0) {
    normalized = {
      negative: negativeBase,
      whole: normalizeWhole(intDigits),
      decimals: fracDigits !== undefined && fracDigits.length > 0 ? fracDigits : null,
    };
  } else {
    normalized = expandExponent(
      negativeBase,
      intDigits,
      fracDigits !== undefined ? fracDigits : "",
      exponent,
    );
    normalized.whole = normalizeWhole(normalized.whole);
  }

  // "-0", "-0.00": value is zero, so the sign is dropped (v3 showed "(negative) Zero").
  const isZero = normalized.whole === "0" && isAllZeros(normalized.decimals);
  const negative = normalized.negative && !isZero;

  if (normalized.whole.length > MAX_WHOLE_DIGITS) {
    throw new NumberTooLargeError(normalized.whole.length, MAX_WHOLE_DIGITS);
  }

  return { negative, whole: normalized.whole, decimals: normalized.decimals };
}

function isAllZeros(decimals: string | null): boolean {
  return decimals === null || /^0*$/.test(decimals);
}
