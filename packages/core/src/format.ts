/**
 * Digit formatting for displayNum fields.
 *
 * Grouping conventions (both intentional since v3, see docs/API_REFERENCE.md):
 * - Whole part: comma-grouped in threes from the right, e.g. "5,876".
 * - Decimal part: ALSO comma-grouped in threes from the right, so the groups
 *   anchor at the decimal point, e.g. ".98,588". Each decimal comma therefore
 *   lands exactly where the words say "Thousand," - a visual aid that helps
 *   readers map digit groups onto the words (v3 shipped this intentionally but
 *   never documented it; v4 documents and tests it).
 */

/** Groups a digit string with commas every 3 digits, anchored at the right end. */
export function groupDigits(digits: string): string {
  if (digits.length <= 3) {
    return digits;
  }
  const groups: string[] = [];
  for (let end = digits.length; end > 0; end -= 3) {
    groups.unshift(digits.slice(Math.max(0, end - 3), end));
  }
  return groups.join(",");
}
