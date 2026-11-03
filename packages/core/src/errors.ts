/**
 * Error types thrown by JSnumberToWordProcessor v4.
 *
 * v3 had no error contract: empty strings silently became "Zero", invalid
 * entries were silently dropped, null crashed with a raw TypeError and
 * Infinity crashed with a raw RangeError. v4 throws descriptive, typed errors
 * for every invalid input (see docs/MIGRATION_v3_to_v4.md).
 */

/** Base class for all errors thrown by this library. */
export class NumberToWordError extends Error {
  public constructor(message: string) {
    super(message);
    this.name = "NumberToWordError";
    // Maintains proper stack trace when constructed via Object.setPrototypeOf
    // in environments that compile class fields down.
    Object.setPrototypeOf(this, new.target.prototype);
  }
}

/** Thrown for any input that is not a valid number (NaN, "abc", "1,234", null, undefined, ...). */
export class InvalidNumberError extends NumberToWordError {
  public constructor(message: string) {
    super(message);
    this.name = "InvalidNumberError";
  }
}

/** Thrown when the whole part exceeds the supported 10^33003 limit. */
export class NumberTooLargeError extends NumberToWordError {
  public readonly maxDigits: number;

  public constructor(digits: number, maxDigits: number) {
    super(
      `Number with ${digits} digits exceeds the supported limit of ${maxDigits} digits (10^33003). ` +
        `Largest supported value: 10^33003 - 1.`,
    );
    this.name = "NumberTooLargeError";
    this.maxDigits = maxDigits;
  }
}

/** Thrown for an invalid `decimalPlaces` option (negative, non-integer, or > 33003). */
export class InvalidOptionsError extends NumberToWordError {
  public constructor(message: string) {
    super(message);
    this.name = "InvalidOptionsError";
  }
}
