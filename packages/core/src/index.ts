/**
 * JSnumberToWordProcessor v4.0.0
 * Purpose: Improving Number / Number-Word Readability.
 * Copyright (c) 2019-2026 Saheed Odulaja
 *
 * NPM @ https://www.npmjs.com/package/js-number-to-word-processor
 * GitHub @ https://github.com/Sidodus/JavaScript-Number-To-Word-Processor
 */

import { processNumber } from "./process.js";
import {
  InvalidNumberError,
  InvalidOptionsError,
  NumberTooLargeError,
  NumberToWordError,
} from "./errors.js";
import type {
  NumberInput,
  ProcessOptions,
  ProcessResult,
} from "./types.js";

/**
 * Converts a number (or an array of numbers) into a well formatted, human
 * readable number with its corresponding words.
 *
 * @example
 * JSnumberToWordProcessor("987");
 * // [{ displayNum: "987", displayWord: "Nine Hundred and Eighty-Seven", ... }]
 *
 * @example
 * JSnumberToWordProcessor("-8769.5", 1);
 * // [{ displayNum: "-8,769.5", displayWord: "(negative) Eight Thousand, Seven Hundred and Sixty-Nine (dot) Five tenths", ... }]
 *
 * @example
 * JSnumberToWordProcessor(["6677", "-7674.969", "0.00"], { lenient: true });
 */
export function JSnumberToWordProcessor(
  input: NumberInput | NumberInput[],
  options?: number | ProcessOptions,
): ProcessResult {
  return processNumber(input, options);
}

export default JSnumberToWordProcessor;

// Public API surface
export {
  InvalidNumberError,
  InvalidOptionsError,
  NumberTooLargeError,
  NumberToWordError,
};
export { MAX_DECIMAL_PLACES } from "./ordinals.js";
export { MAX_WHOLE_DIGITS } from "./parse.js";
export { decimalPlaceOrdinal } from "./ordinals.js";
export { illionName } from "./illions.js";
export type {
  NumberInput,
  ProcessOptions,
  ProcessResult,
  ProcessedNumber,
} from "./types.js";
