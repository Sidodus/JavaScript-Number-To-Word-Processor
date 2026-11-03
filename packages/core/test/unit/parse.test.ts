import { describe, expect, it } from "vitest";

import { InvalidNumberError, NumberTooLargeError } from "../../src/errors.js";
import { MAX_WHOLE_DIGITS, parseInput } from "../../src/parse.js";

describe("parseInput - accepted inputs", () => {
  it("parses plain digit strings, stripping leading zeros", () => {
    expect(parseInput("987")).toEqual({ negative: false, whole: "987", decimals: null });
    expect(parseInput("007")).toEqual({ negative: false, whole: "7", decimals: null });
    expect(parseInput("00")).toEqual({ negative: false, whole: "0", decimals: null });
  });

  it("parses signed strings, dropping the sign of zero values", () => {
    expect(parseInput("-987")).toEqual({ negative: true, whole: "987", decimals: null });
    expect(parseInput("-0")).toEqual({ negative: false, whole: "0", decimals: null });
    expect(parseInput("-0.00")).toEqual({ negative: false, whole: "0", decimals: "00" });
    expect(parseInput("+234")).toEqual({ negative: false, whole: "234", decimals: null });
  });

  it("parses decimals, preserving exact fractional digits", () => {
    expect(parseInput("98.7")).toEqual({ negative: false, whole: "98", decimals: "7" });
    expect(parseInput("-8769.5")).toEqual({ negative: true, whole: "8769", decimals: "5" });
    expect(parseInput("0.0005")).toEqual({ negative: false, whole: "0", decimals: "0005" });
    expect(parseInput("26.00002")).toEqual({ negative: false, whole: "26", decimals: "00002" });
  });

  it("accepts leading-dot and trailing-dot strings", () => {
    expect(parseInput(".5")).toEqual({ negative: false, whole: "0", decimals: "5" });
    expect(parseInput("-.5")).toEqual({ negative: true, whole: "0", decimals: "5" });
    expect(parseInput("5.")).toEqual({ negative: false, whole: "5", decimals: null });
  });

  it("expands scientific notation exactly (v3 crashed on string exponents)", () => {
    expect(parseInput("1e21")).toEqual({
      negative: false,
      whole: "1000000000000000000000",
      decimals: null,
    });
    expect(parseInput("1.5e3")).toEqual({ negative: false, whole: "1500", decimals: null });
    expect(parseInput("5e-7")).toEqual({ negative: false, whole: "0", decimals: "0000005" });
    expect(parseInput("-1.5e-3")).toEqual({ negative: true, whole: "0", decimals: "0015" });
    expect(parseInput("2.5E2")).toEqual({ negative: false, whole: "250", decimals: null });
  });

  it("parses numbers via their shortest round-trip string", () => {
    expect(parseInput(987)).toEqual({ negative: false, whole: "987", decimals: null });
    expect(parseInput(-98.7)).toEqual({ negative: true, whole: "98", decimals: "7" });
    expect(parseInput(1e21)).toEqual({
      negative: false,
      whole: "1000000000000000000000",
      decimals: null,
    });
  });

  it("parses bigint and boolean inputs", () => {
    expect(parseInput(987n)).toEqual({ negative: false, whole: "987", decimals: null });
    expect(parseInput(-987n)).toEqual({ negative: true, whole: "987", decimals: null });
    expect(parseInput(0n)).toEqual({ negative: false, whole: "0", decimals: null });
    expect(parseInput(true)).toEqual({ negative: false, whole: "1", decimals: null });
    expect(parseInput(false)).toEqual({ negative: false, whole: "0", decimals: null });
  });

  it("surrounding whitespace is tolerated on strings", () => {
    expect(parseInput("  987 ")).toEqual({ negative: false, whole: "987", decimals: null });
  });
});

describe("parseInput - rejected inputs (strict error contract)", () => {
  const expectInvalid = (value: unknown, fragment?: string) => {
    expect(() => parseInput(value)).toThrow(InvalidNumberError);
    if (fragment) {
      expect(() => parseInput(value)).toThrow(new RegExp(fragment));
    }
  };

  it("rejects empty and non-numeric strings", () => {
    expectInvalid("");
    expectInvalid("   ");
    expectInvalid("abc");
    expectInvalid("12abc");
    expectInvalid("1,234", "Comma");
    expectInvalid("$5");
    expectInvalid("-");
    expectInvalid(".");
  });

  it("rejects non-finite numbers", () => {
    expectInvalid(Number.NaN, "NaN");
    expectInvalid(Infinity, "Infinity");
    expectInvalid(-Infinity);
  });

  it("rejects non-number types", () => {
    expectInvalid(null);
    expectInvalid(undefined);
    expectInvalid({});
    expectInvalid([]);
    expectInvalid(Symbol("x"));
  });

  it("rejects whole parts beyond 10^33003 with a dedicated error", () => {
    const digits = "1".repeat(MAX_WHOLE_DIGITS + 1);
    let caught: unknown;
    try {
      parseInput(digits);
    } catch (error) {
      caught = error;
    }
    expect(caught).toBeInstanceOf(NumberTooLargeError);
    expect((caught as NumberTooLargeError).maxDigits).toBe(MAX_WHOLE_DIGITS);
  });

  it("accepts a whole part of exactly 33003 digits", () => {
    const parsed = parseInput(`1${"0".repeat(MAX_WHOLE_DIGITS - 1)}`);
    expect(parsed.whole).toHaveLength(MAX_WHOLE_DIGITS);
  });
});
