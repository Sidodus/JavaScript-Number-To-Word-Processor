/**
 * Word engine: converts canonical digit strings into words for a locale.
 *
 * Joining styles (ADR-001, extended in v4.1 by the `style` option):
 * - British: "and" inside every spoken group with hundreds and a remainder
 *   ("One Hundred and Twenty-Three Million"), plus "and" (no comma) before the
 *   final bare tens/units group ("Nine Thousand and Twelve").
 * - American: no "and" anywhere ("One Hundred Twenty-Three Million", "Nine
 *   Thousand Twelve").
 * - Empty groups are skipped: 1,000,005 -> "One Million and Five".
 */

import { groupDigits } from "./format.js";
import { illionName } from "./illions.js";
import type { LocaleDefinition } from "./locales/types.js";

export type WordStyle = "british" | "american";

/** Words for a single 3-digit group (1..999) in the locale's style. */
function groupWord(group: number, locale: LocaleDefinition, style: WordStyle): string {
  const hundreds = Math.floor(group / 100);
  const remainder = group % 100;
  const small = (value: number): string => locale.smallNumbers[value] as string;

  if (hundreds === 0) {
    return small(remainder);
  }

  // v4.1 hook: locales whose hundreds phrase inflects with the remainder
  // (French "deux cents" vs "deux cent un").
  const hundredsPart =
    locale.hundredPhraseFor !== undefined
      ? locale.hundredPhraseFor(hundreds, remainder)
      : `${small(hundreds)} ${locale.hundredWord}`;

  if (remainder === 0) {
    return hundredsPart;
  }
  return style === "british"
    ? `${hundredsPart} and ${small(remainder)}`
    : `${hundredsPart} ${small(remainder)}`;
}

/** Splits a canonical digit string into 3-digit numeric groups indexed from the units side. */
function toGroups(digits: string): number[] {
  const grouped = groupDigits(digits).split(",");
  // groupDigits yields big-endian string order; scale indices count from the
  // units side, so reverse into little-endian numeric groups.
  return grouped.map(Number).reverse();
}

/** Scale word for a group index >= 2: 2 -> "Million", 33 -> "Trestrigintillion"... */
function scaleWord(groupIndex: number, groupValue: number, locale: LocaleDefinition): string {
  // v4.1 hook: value-aware scale words (French long scale + pluralization).
  if (locale.scaleWordFor !== undefined) {
    return locale.scaleWordFor(groupIndex, groupValue);
  }
  return locale.scaleWord !== undefined ? locale.scaleWord(groupIndex) : illionName(groupIndex - 1);
}

/**
 * Converts a canonical whole-part digit string ("0", "987", "123456789012")
 * into words for the given locale and style.
 */
export function wholePartToWords(
  digits: string,
  locale: LocaleDefinition,
  style: WordStyle,
): string {
  if (digits === "0") {
    return locale.zeroWord;
  }

  const groups = toGroups(digits);
  const spoken: { index: number; word: string }[] = [];

  for (let index = groups.length - 1; index >= 0; index--) {
    const value = groups[index] as number;
    if (value === 0) {
      continue;
    }
    let word: string;
    if (index === 0) {
      word = groupWord(value, locale, style);
    } else if (index === 1) {
      // Thousands: the hook (French "mille"/"deux mille") replaces the whole
      // "group + scale" composition when present.
      word =
        locale.thousandPhraseFor !== undefined
          ? locale.thousandPhraseFor(value)
          : `${groupWord(value, locale, style)} ${locale.thousandWord}`;
    } else {
      word = `${groupWord(value, locale, style)} ${scaleWord(index, value, locale)}`;
    }
    spoken.push({ index, word });
  }

  const last = spoken[spoken.length - 1] as { index: number; word: string };
  const lastGroupValue = groups[last.index] as number;
  const needsFinalAnd =
    style === "british" && spoken.length > 1 && last.index === 0 && lastGroupValue < 100;

  // v4.1: the inter-group separator is locale-aware (French joins with spaces).
  const separator = locale.groupSeparator ?? ", ";

  const head = spoken
    .slice(0, -1)
    .map((entry) => entry.word)
    .join(separator);

  if (spoken.length === 1) {
    return last.word;
  }
  return needsFinalAnd ? `${head} and ${last.word}` : `${head}${separator}${last.word}`;
}
