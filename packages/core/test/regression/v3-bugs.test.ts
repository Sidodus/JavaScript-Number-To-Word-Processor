/**
 * v3 regression suite - every defect confirmed against the published v3.0.4
 * build (see docs/BUG_AUDIT_v3.md for the full evidence table) is locked here
 * with its v4-correct expectation. If any of these ever fail again, the bug
 * has returned.
 */
import { describe, expect, it } from "vitest";

import JSnumberToWordProcessor from "../../src/index.js";
import { InvalidNumberError, NumberTooLargeError } from "../../src/errors.js";

const one = (input: Parameters<typeof JSnumberToWordProcessor>[0], options?: unknown) =>
  JSnumberToWordProcessor(input, options as never)[0] as ReturnType<
    typeof JSnumberToWordProcessor
  >[number];

describe("BUG AUDIT v3 - regression locks", () => {
  it("bug 1: leading zeros no longer collapse the decimal place value", () => {
    // v3: 0.0005 @4  -> "Zero (dot) Five tenths"            (wrong place)
    // v3: 0.00012 @5 -> "Zero (dot) Twelve hundredths"      (wrong place)
    // v3: 26.00002 @5 -> "Twenty-Six (dot) Two tenths"      (wrong place)
    expect(one("0.0005", 4).displayWord).toBe("Zero (dot) Five ten-thousandths");
    expect(one("0.00012", 5).displayWord).toBe("Zero (dot) Twelve hundred-thousandths");
    expect(one("26.00002", 5).displayWord).toBe("Twenty-Six (dot) Two hundred-thousandths");
    expect(one("0.00123", 5).displayWord).toBe(
      "Zero (dot) One Hundred and Twenty-Three hundred-thousandths",
    );
  });

  it("bug 2: rounding into a whole number no longer says '(dot) Zero ...'", () => {
    // v3: 9.999 @2 -> "10.00: Ten (dot) Zero hundredths"
    expect(one("9.999", 2).displayWord).toBe("Ten");
    expect(one("0.999", 2).displayWord).toBe("One");
    expect(one("123.999", 0).displayWord).toBe("One Hundred and Twenty-Four");
    expect(one("999999.999", 2).displayWord).toBe("One Million");
  });

  it("bug 3: no float toFixed precision artifacts", () => {
    // v3: 0.995 @2 -> "0.99" (binary float 0.99499999...)
    expect(one("0.995", 2).displayNum).toBe("1");
    expect(one("2.675", 2).displayNum).toBe("2.68");
  });

  it("bug 4: display and word always agree on the digits", () => {
    // v3: .5 -> display "0.50" but word "Fifty tenths"
    const r = one(".5");
    expect(r.displayNum).toBe("0.50");
    expect(r.displayWord).toBe("Zero (dot) Fifty hundredths");
  });

  it("bug 5: scientific notation inputs no longer mangle or crash", () => {
    // v3: 2**70 -> "One (dot) Zero hundredths"; string "1e21" -> raw crash
    expect(one("1e21").displayWord).toBe("One Sextillion");
    expect(one("1e21").displayNum).toBe("1,000,000,000,000,000,000,000");
    expect(one(2 ** 70).displayNum).toBe("1,180,591,620,717,411,300,000");
    expect(one("5e-7", 7).displayWord).toBe("Zero (dot) Five ten-millionths");
  });

  it("bug 6: no dangling '(dot) Zero ' junk for all-zero decimals", () => {
    // v3: "5." -> "Five (dot) Zero ", "0.00" -> "Zero (dot) Zero "
    expect(one("5.").displayWord).toBe("Five");
    expect(one("0.00").displayWord).toBe("Zero");
    expect(one("26.00000232", 5).displayWord).toBe("Twenty-Six");
  });

  it("bug 7: strict, descriptive error contract", () => {
    // v3: "" -> "Zero", "abc" -> [] silently, null -> TypeError, Infinity -> RangeError
    expect(() => one("")).toThrow(InvalidNumberError);
    expect(() => one("   ")).toThrow(InvalidNumberError);
    expect(() => one("abc")).toThrow(InvalidNumberError);
    expect(() => one(null)).toThrow(InvalidNumberError);
    expect(() => one(undefined)).toThrow(InvalidNumberError);
    expect(() => one(Number.NaN)).toThrow(InvalidNumberError);
    expect(() => one(Infinity)).toThrow(InvalidNumberError);
    expect(() => JSnumberToWordProcessor(["1", "x"])).toThrow(/index 1/);
  });

  it("bug 8: negative zero is zero", () => {
    // v3: "-0" -> "(negative) Zero"
    const r = one("-0");
    expect(r.displayWord).toBe("Zero");
    expect(r.negativeInt).toBe(false);
  });

  it("bug 9: no comma before 'and' (standard British style)", () => {
    // v3: "Nine Thousand, and Twelve"
    expect(one("9012").displayWord).toBe("Nine Thousand and Twelve");
    expect(one("1000012").displayWord).toBe("One Million and Twelve");
    expect(one("1005").displayWord).toBe("One Thousand and Five");
  });

  it("bug 10: negative decimalPlace option is rejected, not silently redirected", () => {
    // v3 UI accepted -3 which silently fell back to 2 places.
    expect(() => one("123.456", -3)).toThrow(/decimalPlaces must be an integer between 0 and/);
  });

  it("bug 11: decimal ordinals at extreme places no longer read stale module state", () => {
    // v3: places >= 33002 read the leftover `largeNumbers` global (stale state).
    const fraction = `${"0".repeat(33002)}1`;
    const input = `0.${fraction}`;
    expect(one(input, 33003).displayWord).toBe("Zero (dot) One undecillinillionth");
    // Decimal digits keep the intentional point-anchored comma grouping.
    expect(one(input, 33003).displayNum).toBe(`0.${"000,".repeat(11000)}001`);
  });

  it("bug 12: the value limit is an error, not a 'SORRY...' word sentence", () => {
    // v3 returned displayWord "SORRY..., YOU JUST EXCEEDED THE SUPPORTED LENGTH..."
    expect(() => one(`1${"0".repeat(33003)}`)).toThrow(NumberTooLargeError);
  });
});
