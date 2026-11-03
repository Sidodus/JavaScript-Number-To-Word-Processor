import { describe, expect, it } from "vitest";

import JSnumberToWordProcessor from "../../src/index.js";
import {
  InvalidNumberError,
  InvalidOptionsError,
  NumberTooLargeError,
} from "../../src/errors.js";

/** Helper: process a single input and return its single result object. */
const one = (input: Parameters<typeof JSnumberToWordProcessor>[0], options?: unknown) =>
  JSnumberToWordProcessor(input, options as never)[0] as ReturnType<
    typeof JSnumberToWordProcessor
  >[number];

describe("whole numbers", () => {
  it("processes small numbers", () => {
    const r = one("987");
    expect(r.displayNum).toBe("987");
    expect(r.displayWord).toBe("Nine Hundred and Eighty-Seven");
    expect(r.displayWholeNum).toBe("987");
    expect(r.displayWholeWord).toBe("Nine Hundred and Eighty-Seven");
    expect(r.displayDecimalNum).toBe("");
    expect(r.displayDecimalWord).toBe("");
    expect(r.negativeInt).toBe(false);
    expect(r.decimalPoint).toBe(false);
    expect(r.decimalPlaceWord).toBe("");
  });

  it("processes zero in every accepted representation", () => {
    for (const input of [0, "0", 0n, false, "00", "-0"]) {
      const r = one(input as string);
      expect(r.displayNum).toBe("0");
      expect(r.displayWord).toBe("Zero");
      expect(r.negativeInt).toBe(false);
    }
    expect(one(true).displayWord).toBe("One"); // boolean legacy compatibility
  });

  it("groups large numbers with commas", () => {
    const r = one(8476787747);
    expect(r.displayNum).toBe("8,476,787,747");
    expect(r.displayWord).toBe(
      "Eight Billion, Four Hundred and Seventy-Six Million, Seven Hundred and " +
        "Eighty-Seven Thousand, Seven Hundred and Forty-Seven",
    );
  });

  it("handles bigint exactly beyond 2^53", () => {
    const r = one(5876985876950n);
    expect(r.displayNum).toBe("5,876,985,876,950");
    expect(r.displayWord).toBe(
      "Five Trillion, Eight Hundred and Seventy-Six Billion, Nine Hundred and " +
        "Eighty-Five Million, Eight Hundred and Seventy-Six Thousand, Nine Hundred and Fifty",
    );
  });

  it("handles negatives", () => {
    const r = one("-876950");
    expect(r.displayNum).toBe("-876,950");
    expect(r.displayWord).toBe("(negative) Eight Hundred and Seventy-Six Thousand, Nine Hundred and Fifty");
    expect(r.displayWholeNum).toBe("876,950");
    expect(r.displayWholeWord).toBe("Eight Hundred and Seventy-Six Thousand, Nine Hundred and Fifty");
    expect(r.negativeInt).toBe(true);
  });
});

describe("decimals", () => {
  it("uses 2 decimal places by default", () => {
    const r = one("5876.98587695");
    expect(r.displayNum).toBe("5,876.99");
    expect(r.displayWord).toBe(
      "Five Thousand, Eight Hundred and Seventy-Six (dot) Ninety-Nine hundredths",
    );
    expect(r.decimalPoint).toBe(true);
    expect(r.decimalPlaceWord).toBe("hundredths");
    expect(r.displayDecimalNum).toBe(".99");
    expect(r.displayDecimalWord).toBe("Ninety-Nine");
  });

  it("honors a requested decimal place length (number shorthand)", () => {
    const r = one("5876.985876950", 5);
    expect(r.displayNum).toBe("5,876.98,588"); // intentional decimal grouping
    expect(r.displayWord).toBe(
      "Five Thousand, Eight Hundred and Seventy-Six (dot) Ninety-Eight Thousand, " +
        "Five Hundred and Eighty-Eight hundred-thousandths",
    );
  });

  it("honors the options-object form", () => {
    const r = one("-8769.5", { decimalPlaces: 1 });
    expect(r.displayNum).toBe("-8,769.5");
    expect(r.displayWord).toBe(
      "(negative) Eight Thousand, Seven Hundred and Sixty-Nine (dot) Five tenths",
    );
  });

  it("keeps decimal digits the words describe (display == word invariant)", () => {
    const r = one("0.5", 2);
    expect(r.displayNum).toBe("0.50");
    expect(r.displayWord).toBe("Zero (dot) Fifty hundredths");
  });

  it("supports decimalPlace 0 (round to whole) and 1", () => {
    expect(one("123.456", 0).displayWord).toBe("One Hundred and Twenty-Three"); // 0.456 < 0.5 rounds down
    expect(one("123.456", 0).displayNum).toBe("123");
    expect(one("123.999", 0).displayNum).toBe("124");
    expect(one("123.456", 1).displayWord).toBe("One Hundred and Twenty-Three (dot) Five tenths");
    expect(one("123.456", 1).displayNum).toBe("123.5");
  });

  it("pads to the requested place when the input has fewer digits", () => {
    const r = one("0.5", 5);
    expect(r.displayNum).toBe("0.50,000"); // decimal grouping mirrors "Fifty Thousand"
    expect(r.displayWord).toBe("Zero (dot) Fifty Thousand hundred-thousandths");
  });

  it("keeps singular grammar when the decimal value is exactly 1", () => {
    expect(one("0.01").displayWord).toBe("Zero (dot) One hundredth");
    expect(one("0.1", 1).displayWord).toBe("Zero (dot) One tenth");
    expect(one("0.001", 3).displayWord).toBe("Zero (dot) One thousandth");
    expect(one("0.001", 3).displayNum).toBe("0.001");
  });

  it("omits an all-zero decimal part instead of saying '(dot) Zero'", () => {
    const r = one("26.00000232", 5);
    expect(r.displayNum).toBe("26");
    expect(r.displayWord).toBe("Twenty-Six");
    expect(r.decimalPoint).toBe(false);
    expect(one(55.999999 / 8).displayWord).toBe("Seven"); // 6.999999875 @2 -> "Seven"
  });

  it("handles negatives with decimals", () => {
    const r = one("-0.5");
    expect(r.displayNum).toBe("-0.50");
    expect(r.displayWord).toBe("(negative) Zero (dot) Fifty hundredths");
    expect(r.negativeInt).toBe(true);
    expect(r.displayWholeNum).toBe("0");
  });

  it("drops the sign when rounding lands exactly on zero", () => {
    const r = one("-0.004", 2);
    expect(r.displayNum).toBe("0");
    expect(r.displayWord).toBe("Zero");
    expect(r.negativeInt).toBe(false);
  });

  it("processes small float arithmetic expressions", () => {
    expect(one(55 / 11).displayWord).toBe("Five");
    expect(one(55 * 11).displayWord).toBe("Six Hundred and Five");
    expect(one(555n * 111n).displayWord).toBe("Sixty-One Thousand, Six Hundred and Five");
    expect(one(55 + -8).displayWord).toBe("Forty-Seven");
    expect(one(55.1 / 3 - 8.2).displayNum).toBe("10.17");
  });
});

describe("rounding (exact, half-up, on the digit string)", () => {
  it("carries into the whole part and drops the vanished decimal", () => {
    expect(one("0.999", 2).displayWord).toBe("One");
    expect(one("0.999", 2).displayNum).toBe("1");
    expect(one("9.999", 2).displayWord).toBe("Ten");
    expect(one("9.999", 2).displayNum).toBe("10");
    expect(one("999999.999", 2).displayNum).toBe("1,000,000");
    expect(one("999999.999", 2).displayWord).toBe("One Million");
  });

  it("rounds half-up deterministically (no float artifacts)", () => {
    expect(one("0.995", 2).displayNum).toBe("1");
    expect(one("0.994", 2).displayNum).toBe("0.99");
    expect(one("0.985", 2).displayNum).toBe("0.99");
    expect(one("0.9849", 2).displayNum).toBe("0.98");
    expect(one("2.675", 2).displayNum).toBe("2.68"); // float toFixed says 2.67
  });

  it("carries across decimal place boundaries", () => {
    expect(one("0.0099", 2).displayNum).toBe("0.01");
    expect(one("0.0099", 2).displayWord).toBe("Zero (dot) One hundredth");
    expect(one("9.9949999", 2).displayNum).toBe("9.99");
  });

  it("carries into higher scales through the words", () => {
    const r = one("999.999", 2);
    expect(r.displayNum).toBe("1,000");
    expect(r.displayWord).toBe("One Thousand");
  });
});

describe("arrays", () => {
  it("processes mixed arrays in order", () => {
    const results = JSnumberToWordProcessor(["6677", -7674.969, "0.00"]);
    expect(results).toHaveLength(3);
    expect(results[0]?.displayWord).toBe("Six Thousand, Six Hundred and Seventy-Seven");
    expect(results[1]?.displayNum).toBe("-7,674.97");
    expect(results[2]?.displayNum).toBe("0");
    expect(results[2]?.displayWord).toBe("Zero");
  });

  it("applies the decimal place to every decimal entry", () => {
    const results = JSnumberToWordProcessor(["123.98765", "445.556", "84974"], 3);
    expect(results[0]?.displayNum).toBe("123.988");
    expect(results[1]?.displayNum).toBe("445.556");
    expect(results[2]?.displayNum).toBe("84,974"); // whole inputs ignore decimalPlaces
  });

  it("throws on the first invalid entry (strict default) with index context", () => {
    expect(() => JSnumberToWordProcessor(["1", "abc", "3"])).toThrow(InvalidNumberError);
    expect(() => JSnumberToWordProcessor(["1", "abc", "3"])).toThrow(/index 1/);
  });

  it("skips invalid entries in lenient mode (v3 behaviour)", () => {
    const results = JSnumberToWordProcessor(["6677", "abc", "", "0.00"], { lenient: true });
    expect(results).toHaveLength(2);
    expect(results[0]?.displayNum).toBe("6,677");
    expect(results[1]?.displayNum).toBe("0");
  });

  it("returns an empty array for an empty input array", () => {
    expect(JSnumberToWordProcessor([])).toEqual([]);
  });

  it("throws for single invalid input even in lenient mode", () => {
    expect(() => JSnumberToWordProcessor("abc", { lenient: true })).toThrow(InvalidNumberError);
  });
});

describe("options validation", () => {
  it("rejects negative decimal places (v3 silently fell back to 2)", () => {
    expect(() => JSnumberToWordProcessor("123.456", -1)).toThrow(InvalidOptionsError);
    expect(() => JSnumberToWordProcessor("123.456", { decimalPlaces: -3 })).toThrow(
      /Negative decimal lengths/,
    );
  });

  it("rejects non-integer and oversized decimal places", () => {
    expect(() => JSnumberToWordProcessor("123.456", 1.5)).toThrow(InvalidOptionsError);
    expect(() => JSnumberToWordProcessor("123.456", 33004)).toThrow(InvalidOptionsError);
  });

  it("rejects nonsense options", () => {
    expect(() => JSnumberToWordProcessor("123.456", "x" as never)).toThrow(InvalidOptionsError);
  });
});

describe("size limits", () => {
  it("converts a full 33003-digit number", () => {
    const digits = `1${"0".repeat(33002)}`;
    const r = one(digits);
    expect(r.displayWord).toBe("One Hundred Decillinovenonagintanongentillion");
  });

  it("throws a dedicated error beyond the limit", () => {
    const digits = `1${"0".repeat(33003)}`;
    expect(() => JSnumberToWordProcessor(digits)).toThrow(NumberTooLargeError);
  });
});

describe("public API surface", () => {
  it("supports default and named import forms", async () => {
    const mod = await import("../../src/index.js");
    expect(mod.default).toBe(mod.JSnumberToWordProcessor);
    expect(mod.default("7")[0]?.displayWord).toBe("Seven");
  });

  it("exposes error classes for consumer instanceof checks", async () => {
    const mod = await import("../../src/index.js");
    try {
      mod.default("bogus");
      expect.unreachable();
    } catch (error) {
      expect(error).toBeInstanceOf(mod.InvalidNumberError);
      expect(error).toBeInstanceOf(mod.NumberToWordError);
    }
  });
});
