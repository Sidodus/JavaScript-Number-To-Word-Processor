/**
 * English locale - the library's default and the vocabulary that has defined
 * its public output since v1. Both British ("and") and American (no "and")
 * styles are supported through the `style` option; British is the default.
 */

import { smallNumberWord } from "../scales.js";
import type { LocaleDefinition } from "./types.js";

export const enLocale: LocaleDefinition = {
  code: "en",
  zeroWord: "Zero",
  // smallNumberWord returns 0..99; index 0 is "Zero" (same as zeroWord).
  smallNumbers: Array.from({ length: 100 }, (_, value) => smallNumberWord(value) as string),
  hundredWord: "Hundred",
  thousandWord: "Thousand",
  negativePrefix: "(negative) ",
  dotSeparator: " (dot) ",
  andStyle: "british",
  supportsBothStyles: true,
};
