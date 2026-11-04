/**
 * Public types for JSnumberToWordProcessor.
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

/** Currency labels for money amounts (v4.1). */
export interface CurrencyLabels {
  /** Major unit label, e.g. "Naira", "Dollars". Required, non-empty. */
  major: string;
  /** Minor unit label, e.g. "Kobo", "Cents". Omit for currencies without one. */
  minor?: string;
  /**
   * Plural form of the major label. Defaults to `major + "s"` - override for
   * invariable currency names ("Naira", "Yen", "Cedis" is already plural...).
   */
  majorPlural?: string;
  /** Plural form of the minor label. Defaults to `minor + "s"`. */
  minorPlural?: string;
  /**
   * Sentence suffix appended after everything, e.g. "Only" for the Nigerian
   * check-writing convention ("... Naira, Fifty Kobo Only").
   */
  suffix?: string;
}

/** Options accepted as the second argument (an object), or a bare decimal-place number (v3 style). */
export interface ProcessOptions {
  /**
   * Number of decimal digits to keep after rounding (half-up).
   * - Default: 2 (when omitted or undefined)
   * - Range: integer 0..33003; anything else throws InvalidOptionsError
   * - 0 rounds to a whole number
   * - Ignored for inputs without a decimal part (whole numbers stay whole)
   * - Ignored in currency mode (money is always 2 minor places)
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

  /**
   * Word joining style (v4.1):
   * - "british" (default): "and" joins hundreds and remainders and the final
   *   tens/units group ("Nine Thousand and Twelve").
   * - "american": no "and" anywhere ("One Hundred Twenty-Three").
   */
  style?: "british" | "american";

  /**
   * Locale registry key (v4.1). Default "en". Unknown keys throw
   * InvalidOptionsError. Extend with registerLocale() - see docs/LOCALES.md.
   */
  locale?: string;

  /**
   * Output form for the whole part (v4.1):
   * - "cardinal" (default)
   * - "ordinal": the whole words become ordinals ("21" -> "Twenty-First",
   *   "0" -> "Zeroth"). Decimal parts are unaffected.
   */
  output?: "cardinal" | "ordinal";

  /**
   * Currency mode (v4.1): renders the value as money words instead of the
   * "(dot) ... hundredths" sentence.
   * e.g. N("1234.56", { currency: { major: "Naira", minor: "Kobo", majorPlural: "Naira" } })
   * -> "One Thousand, Two Hundred and Thirty-Four Naira, Fifty-Six Kobo".
   * Money is always rounded to 2 minor places (decimalPlaces is ignored);
   * a zero minor part is omitted from the sentence.
   */
  currency?: CurrencyLabels;
}

/**
 * Currency metadata attached to a result processed in currency mode
 * (v4.1). Lets consumers render the sentence with their own styling.
 */
export interface CurrencyResult {
  majorLabel: string;
  /** Present when the minor part is rendered; null when it was omitted. */
  minorLabel: string | null;
  /** The suffix option, if provided (e.g. "Only"). */
  suffix: string | null;
}

/**
 * The processed result for one number. Field names are identical to v3 so the
 * result object shape is backward compatible (`currency` was added in v4.1).
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
  /** Currency metadata when processed with the `currency` option, else null. */
  currency: CurrencyResult | null;
}

/** The shape returned by {@link JSnumberToWordProcessor}. */
export type ProcessResult = ProcessedNumber[];
