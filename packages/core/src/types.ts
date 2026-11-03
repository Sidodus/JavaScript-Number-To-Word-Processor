/**
 * Public types for JSnumberToWordProcessor v4.
 *
 * Design principle (see docs/ARCHITECTURE.md): the displayed number and the
 * displayed words ALWAYS describe the same digits. Every field below is
 * derived from one exact string representation of the input - never from
 * floating point arithmetic.
 */

/**
 * A single accepted input value.
 *
 * - `string`  - exact representation, preferred for big or precise decimals ("987", "-4783484773.7634656549", "1e21")
 * - `number`  - convenience for small values; converted through its shortest round-trip string
 * - `bigint`  - exact integer representation
 * - `boolean` - legacy v3 compatibility: true -> 1, false -> 0
 */
export type NumberInput = string | number | bigint | boolean;

/** Options accepted as the second argument (an object), or a bare decimal-place number (v3 style). */
export interface ProcessOptions {
  /**
   * Number of decimal digits to keep after rounding (half-up).
   * - Default: 2 (when omitted or undefined)
   * - Range: integer 0..33003; anything else throws InvalidOptionsError
   * - 0 rounds to a whole number
   * - Ignored for inputs without a decimal part (whole numbers stay whole)
   */
  decimalPlaces?: number;

  /**
   * When processing an array:
   * - false (default): the first invalid entry throws InvalidNumberError (fail fast).
   * - true: invalid entries are skipped, matching lenient v3 behaviour.
   *
   * Single (non-array) input is always validated strictly.
   */
  lenient?: boolean;
}

/**
 * The processed result for one number. Field names are identical to v3 so the
 * result object shape is backward compatible.
 */
export interface ProcessedNumber {
  /** The full formatted number, e.g. "-8,769.98,588". */
  displayNum: string;
  /** The full word sentence, e.g. "(negative) Eight Thousand ... (dot) Ninety-Eight Thousand, ... hundred-thousandths". */
  displayWord: string;

  /** Whole part, comma-grouped, no sign, e.g. "8,769". */
  displayWholeNum: string;
  /** Words for the whole part only (no "(negative)" prefix), e.g. "Eight Thousand, Seven Hundred and Sixty-Nine". */
  displayWholeWord: string;

  /** Decimal part including the leading dot, e.g. ".98,588", or "" when there is no decimal part. */
  displayDecimalNum: string;
  /** Words for the decimal digits only (no ordinal), e.g. "Ninety-Eight Thousand, Five Hundred and Eighty-Eight", or "". */
  displayDecimalWord: string;

  /** True when the (rounded) value is negative. "-0" inputs are NOT negative. */
  negativeInt: boolean;
  /** True when the result carries a decimal part. */
  decimalPoint: boolean;
  /** Ordinal name of the decimal place, e.g. "hundred-thousandths", or "". */
  decimalPlaceWord: string;
}

/** The shape returned by {@link JSnumberToWordProcessor}. */
export type ProcessResult = ProcessedNumber[];
