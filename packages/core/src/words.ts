/**
 * Word engine: converts canonical digit strings into English words.
 *
 * Style (v4, "standard British" - see docs/DECISIONS.md):
 * - "and" inside every spoken group with hundreds and a remainder:
 *   "One Hundred and Twenty-Three Million".
 * - "and" (no comma) before the final spoken group when that group is a bare
 *   tens/units value (< 100): "Nine Thousand and Twelve".
 * - No comma before "and" - this is the deliberate v4 change from v3's
 *   "Nine Thousand, and Twelve".
 * - Empty groups are skipped: 1,000,005 -> "One Million and Five".
 */

import { groupDigits } from "./format.js";
import { illionName } from "./illions.js";
import { smallNumberWord } from "./scales.js";

/** Words for a single 3-digit group (1..999): "Seven Hundred and Eighty-Nine". */
function groupWord(group: number): string {
  const hundreds = Math.floor(group / 100);
  const remainder = group % 100;

  if (hundreds === 0) {
    return smallNumberWord(remainder) as string;
  }

  const hundredsWord = `${smallNumberWord(hundreds)} Hundred`;
  if (remainder === 0) {
    return hundredsWord;
  }
  return `${hundredsWord} and ${smallNumberWord(remainder)}`;
}

/** Splits a canonical digit string into 3-digit numeric groups indexed from the units side. */
function toGroups(digits: string): number[] {
  const grouped = groupDigits(digits).split(",");
  // groupDigits yields big-endian string order; scale indices count from the
  // units side, so reverse into little-endian numeric groups.
  return grouped.map(Number).reverse();
}

/** Scale word for a group index: 1 -> "Thousand", 2 -> "Million", 33 -> "Trestrigintillion"... */
function scaleWord(groupIndex: number): string {
  return groupIndex === 1 ? "Thousand" : illionName(groupIndex - 1);
}

/**
 * Converts a canonical whole-part digit string ("0", "987", "123456789012")
 * into English words.
 */
export function wholePartToWords(digits: string): string {
  if (digits === "0") {
    return "Zero";
  }

  const groups = toGroups(digits);
  const spoken: { index: number; word: string }[] = [];

  for (let index = groups.length - 1; index >= 0; index--) {
    const value = groups[index] as number;
    if (value === 0) {
      continue;
    }
    const word = index === 0 ? groupWord(value) : `${groupWord(value)} ${scaleWord(index)}`;
    spoken.push({ index, word });
  }

  const last = spoken[spoken.length - 1] as { index: number; word: string };
  const lastGroupValue = groups[last.index] as number;
  const needsFinalAnd = spoken.length > 1 && last.index === 0 && lastGroupValue < 100;

  const head = spoken
    .slice(0, -1)
    .map((entry) => entry.word)
    .join(", ");

  if (spoken.length === 1) {
    return last.word;
  }
  return needsFinalAnd ? `${head} and ${last.word}` : `${head}, ${last.word}`;
}
