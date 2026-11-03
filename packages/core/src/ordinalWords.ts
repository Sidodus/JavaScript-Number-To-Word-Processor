/**
 * Whole-number ordinals ("Twenty-First", "One Hundred and Twelfth").
 *
 * The cardinal is produced by the normal word engine; only the LAST word is
 * transformed into its ordinal form:
 * - tens ending in "y" -> "ieth"  ("Forty" -> "Fortieth")
 * - irregular: One->First, Two->Second, Three->Third, Five->Fifth,
 *   Eight->Eighth, Nine->Ninth, Twelve->Twelfth
 * - everything else takes "th" ("Zero" -> "Zeroth", "Seven" -> "Seventh",
 *   "Hundred" -> "Hundredth", "Trestrigintillion" -> "...illionth")
 * Hyphenated compounds keep their prefix ("Twenty-One" -> "Twenty-First").
 */

import type { LocaleDefinition } from "./locales/types.js";
import { wholePartToWords } from "./words.js";

const IRREGULAR_ORDINALS: Readonly<Record<string, string>> = {
  One: "First",
  Two: "Second",
  Three: "Third",
  Five: "Fifth",
  Eight: "Eighth",
  Nine: "Ninth",
  Twelve: "Twelfth",
};

/** Transforms one cardinal word into its ordinal form. */
export function ordinalizeWord(word: string): string {
  if (word.endsWith("y")) {
    return `${word.slice(0, -1)}ieth`;
  }
  const irregular = IRREGULAR_ORDINALS[word];
  if (irregular !== undefined) {
    return irregular;
  }
  return `${word}th`;
}

/**
 * Converts a canonical whole-part digit string into ordinal words
 * ("21" -> "Twenty-First", "0" -> "Zeroth", "112" -> "One Hundred and Twelfth").
 * Locales with an `ordinalize` hook own the whole sentence (French article
 * rules); otherwise the English last-word rules apply.
 */
export function wholePartToOrdinalWords(
  digits: string,
  locale: LocaleDefinition,
  style: "british" | "american",
): string {
  const cardinal = wholePartToWords(digits, locale, style);

  if (locale.ordinalize !== undefined) {
    return locale.ordinalize(cardinal);
  }

  const words = cardinal.split(" ");
  const lastWord = words[words.length - 1];
  if (lastWord === undefined || lastWord.length === 0) {
    return cardinal;
  }
  const hyphenParts = lastWord.split("-");
  hyphenParts[hyphenParts.length - 1] = ordinalizeWord(
    hyphenParts[hyphenParts.length - 1] as string,
  );
  words[words.length - 1] = hyphenParts.join("-");
  return words.join(" ");
}
