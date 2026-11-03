/**
 * v3 parity suite - cases where the published v3.0.4 build was CORRECT and
 * whose exact output v4 must preserve (byte-identical), taken from the live
 * v3 build and the v3 README.
 */
import { describe, expect, it } from "vitest";

import JSnumberToWordProcessor from "../../src/index.js";

const one = (input: Parameters<typeof JSnumberToWordProcessor>[0], options?: unknown) =>
  JSnumberToWordProcessor(input, options as never)[0] as ReturnType<
    typeof JSnumberToWordProcessor
  >[number];

describe("v3 parity - outputs that must not change", () => {
  it("keeps the headline README example (with the documented v4 'and'-style fix)", () => {
    // v3 said "...Eighty-Nine Billion, and Twelve Million..." - v4 drops the
    // mid-sentence "and" (regression bug 9), everything else is identical.
    expect(one("123456789012345680").displayWord).toBe(
      "One Hundred and Twenty-Three Quadrillion, Four Hundred and Fifty-Six Trillion, " +
        "Seven Hundred and Eighty-Nine Billion, Twelve Million, Three Hundred and " +
        "Forty-Five Thousand, Six Hundred and Eighty",
    );
    expect(one("123456789012345680").displayNum).toBe("123,456,789,012,345,680");
  });

  it("keeps v3-correct negative examples", () => {
    expect(one("-876950").displayNum).toBe("-876,950");
    expect(one("-876950").displayWord).toBe(
      "(negative) Eight Hundred and Seventy-Six Thousand, Nine Hundred and Fifty",
    );
    expect(one("-8769.5", 1).displayNum).toBe("-8,769.5");
    expect(one("-8769.5", 1).displayWord).toBe(
      "(negative) Eight Thousand, Seven Hundred and Sixty-Nine (dot) Five tenths",
    );
  });

  it("keeps v3-correct decimal examples", () => {
    expect(one("5876.98587695").displayNum).toBe("5,876.99");
    expect(one("5876.98587695").displayWord).toBe(
      "Five Thousand, Eight Hundred and Seventy-Six (dot) Ninety-Nine hundredths",
    );
    expect(one("5876.985876950", 5).displayNum).toBe("5,876.98,588");
    expect(one("5876.985876950", 5).displayWord).toBe(
      "Five Thousand, Eight Hundred and Seventy-Six (dot) Ninety-Eight Thousand, " +
        "Five Hundred and Eighty-Eight hundred-thousandths",
    );
    // README: 55.1 - 8.2 @3 -> float 46.900000000000006 -> "46.900"
    expect(one(55.1 - 8.2, 3).displayNum).toBe("46.900");
    expect(one(55.1 - 8.2, 3).displayWord).toBe("Forty-Six (dot) Nine Hundred thousandths");
  });

  it("keeps v3-correct boolean examples", () => {
    expect(one(55 > 26).displayWord).toBe("One");
    expect(one(55 < 26).displayWord).toBe("Zero");
    expect(one(55 === ("55" as unknown as number)).displayWord).toBe("Zero");
    expect(one(55 !== ("55" as unknown as number)).displayWord).toBe("One");
  });

  it("keeps v3-correct bigint arithmetic examples", () => {
    expect(one(55n ** 18n).displayWord).toBe(
      "Twenty-One Nonillion, Two Hundred and Nine Octillion, Four Hundred and One " +
        "Septillion, Three Hundred and Seventy-Two Sextillion, Eight Hundred and " +
        "Seventy-Nine Quintillion, Nine Hundred and Eleven Quadrillion, Three Hundred " +
        "and Fifty Trillion, Two Hundred and Fifty Billion, Two Hundred and Forty-Four " +
        "Million, One Hundred and Forty Thousand, Six Hundred and Twenty-Five",
    );
    expect(one((BigInt(55) / BigInt(11)) * BigInt(10)).displayWord).toBe("Fifty");
  });

  it("keeps the v3 result-object field set", () => {
    const r = one("-4783484773.7634656549", 9);
    expect(Object.keys(r).sort()).toEqual([
      "decimalPlaceWord",
      "decimalPoint",
      "displayDecimalNum",
      "displayDecimalWord",
      "displayNum",
      "displayWholeNum",
      "displayWholeWord",
      "displayWord",
      "negativeInt",
    ]);
    expect(r.displayNum).toBe("-4,783,484,773.763,465,655");
    expect(r.displayWord).toBe(
      "(negative) Four Billion, Seven Hundred and Eighty-Three Million, Four Hundred " +
        "and Eighty-Four Thousand, Seven Hundred and Seventy-Three (dot) Seven Hundred " +
        "and Sixty-Three Million, Four Hundred and Sixty-Five Thousand, Six Hundred " +
        "and Fifty-Five billionths",
    );
  });
});
