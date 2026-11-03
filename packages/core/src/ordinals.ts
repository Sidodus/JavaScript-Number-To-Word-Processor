/**
 * Ordinal names for decimal places: 1 -> "tenths", 2 -> "hundredths",
 * 3 -> "thousandths", 4 -> "ten-thousandths", 5 -> "hundred-thousandths",
 * 6 -> "millionths", ... up to place 33003 ("ten-...illionths" territory).
 *
 * The mapping: place p = 3m + r (r = p % 3), with m = (p - r) / 3.
 * - r = 0 -> "{m-1 th illion}ths"  (10^-3 -> thousandths)
 * - r = 1 -> "ten-{m-1 th illion}ths"      (10^-4 -> ten-thousandths)
 * - r = 2 -> "hundred-{m-1 th illion}ths"  (10^-5 -> hundred-thousandths)
 * m - 1 = 0 refers to "thousand" (which is not an -illion).
 *
 * v3 computed this through the digit-length table with an off-by-one offset;
 * leading zeros in the decimal collapsed the place value (docs/BUG_AUDIT_v3.md
 * bug #1). v4 derives the ordinal directly from the requested decimal place.
 */

import { illionName } from "./illions.js";

export const MAX_DECIMAL_PLACES = 33003;

/**
 * Returns the ordinal word for a decimal place.
 *
 * @param place     Decimal place index, 1..33003.
 * @param singular  When true returns the singular form ("tenth") - used when
 *                  the decimal value is exactly 1 ("One tenth").
 */
export function decimalPlaceOrdinal(place: number, singular = false): string {
  if (!Number.isInteger(place) || place < 1 || place > MAX_DECIMAL_PLACES) {
    throw new RangeError(
      `decimalPlaceOrdinal expects an integer between 1 and ${MAX_DECIMAL_PLACES}, received ${place}`,
    );
  }

  let word: string;
  if (place === 1) {
    word = "tenth";
  } else if (place === 2) {
    word = "hundredth";
  } else {
    const remainder = place % 3;
    const quotient = (place - remainder) / 3;
    const scaleN = quotient - 1;
    const scale = scaleN === 0 ? "thousand" : illionName(scaleN).toLowerCase();
    const prefix = remainder === 1 ? "ten-" : remainder === 2 ? "hundred-" : "";
    word = `${prefix}${scale}th`;
  }

  return singular ? word : `${word}s`;
}
