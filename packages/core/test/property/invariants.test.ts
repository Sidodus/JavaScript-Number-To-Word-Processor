/**
 * Property-based tests (fast-check): invariants that must hold for EVERY
 * input, complementing the example-based suites.
 */
import fc from "fast-check";
import { describe, expect, it } from "vitest";

import JSnumberToWordProcessor from "../../src/index.js";

/** Random decimal digit strings: whole part 1..40 digits, optional fraction 1..20 digits. */
const decimalStringArb = fc
  .tuple(
    fc.array(fc.integer({ min: 0, max: 9 }), { minLength: 1, maxLength: 40 }),
    fc.option(fc.array(fc.integer({ min: 0, max: 9 }), { minLength: 1, maxLength: 20 }), {
      nil: undefined,
    }),
  )
  .map(([wholeDigits, fractionDigits]) => {
    const whole = wholeDigits.map(String).join("");
    if (fractionDigits === undefined) {
      return whole;
    }
    const fraction = fractionDigits.map(String).join("");
    return `${whole}.${fraction}`;
  });

describe("property invariants (fast-check)", () => {
  it("output never contains undefined, NaN, null, double spaces, or ', and'", () => {
    fc.assert(
      fc.property(decimalStringArb, fc.integer({ min: 0, max: 12 }), (input, places) => {
        const results = JSnumberToWordProcessor(input, places);
        for (const result of results) {
          for (const value of [
            result.displayWord,
            result.displayWholeWord,
            result.displayDecimalWord,
          ]) {
            expect(value).not.toMatch(/undefined|NaN|null/);
            expect(value).not.toMatch(/  /);
            expect(value).not.toMatch(/, and/); // ADR-001: no comma before "and"
          }
        }
      }),
      { numRuns: 300 },
    );
  });

  it("decimal words always describe exactly the displayed decimal digits", () => {
    fc.assert(
      fc.property(decimalStringArb, fc.integer({ min: 0, max: 12 }), (input, places) => {
        const [result] = JSnumberToWordProcessor(input, places);
        if (result === undefined) {
          return;
        }
        if (!result.decimalPoint) {
          expect(result.displayDecimalWord).toBe("");
          return;
        }
        // Rebuild the words for the displayed digits alone; the decimal words
        // must match (not the whole part, which is "Zero" for the rebuilt 0.x).
        const decimalDigits = result.displayDecimalNum.replace(/[.,]/g, "");
        const [recomputed] = JSnumberToWordProcessor(`0.${decimalDigits}`, decimalDigits.length);
        expect(result.displayDecimalWord).toBe(recomputed?.displayDecimalWord);
      }),
      { numRuns: 300 },
    );
  });

  it("conversion is deterministic; non-negative inputs are never flagged negative", () => {
    fc.assert(
      fc.property(decimalStringArb, fc.integer({ min: 0, max: 12 }), (input, places) => {
        const [first] = JSnumberToWordProcessor(input, places);
        const [second] = JSnumberToWordProcessor(input, places);
        expect(first?.displayWord).toBe(second?.displayWord);
        expect(first?.displayNum).toBe(second?.displayNum);
        if (first !== undefined && !input.startsWith("-")) {
          expect(first.negativeInt).toBe(false);
        }
      }),
      { numRuns: 200 },
    );
  });

  it("currency mode always names the major unit and never leaks the (dot) separator", () => {
    fc.assert(
      fc.property(decimalStringArb, (input) => {
        const [result] = JSnumberToWordProcessor(input, {
          currency: { major: "Naira", majorPlural: "Naira", minor: "Kobo", minorPlural: "Kobo" },
        });
        expect(result?.displayWord).toContain("Naira");
        expect(result?.displayWord).not.toMatch(/\(dot\)|hundredths|tenths|thousandths/);
        expect(result?.currency?.majorLabel).toBe("Naira");
      }),
      { numRuns: 200 },
    );
  });
});
