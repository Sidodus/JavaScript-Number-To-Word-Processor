import { describe, expect, it } from "vitest";

import JSnumberToWordProcessor, { registerLocale } from "../../src/index.js";
import { InvalidOptionsError } from "../../src/errors.js";
import { enLocale } from "../../src/locales/en.js";

const one = (input: Parameters<typeof JSnumberToWordProcessor>[0], options?: unknown) =>
  JSnumberToWordProcessor(input, options as never)[0] as ReturnType<
    typeof JSnumberToWordProcessor
  >[number];

describe("style option (v4.1) - british (default) vs american", () => {
  it("keeps british as the default (v3-era parity unchanged)", () => {
    expect(one("123456789").displayWord).toBe(
      "One Hundred and Twenty-Three Million, Four Hundred and Fifty-Six Thousand, " +
        "Seven Hundred and Eighty-Nine",
    );
  });

  it("american drops every 'and' (group commas stay)", () => {
    expect(one("123456789", { style: "american" }).displayWord).toBe(
      "One Hundred Twenty-Three Million, Four Hundred Fifty-Six Thousand, Seven Hundred Eighty-Nine",
    );
    expect(one("9012", { style: "american" }).displayWord).toBe("Nine Thousand, Twelve");
    expect(one("1005", { style: "american" }).displayWord).toBe("One Thousand, Five");
    expect(one("1000012", { style: "american" }).displayWord).toBe("One Million, Twelve");
    expect(one("123.456", { style: "american", decimalPlaces: 3 }).displayWord).toBe(
      "One Hundred Twenty-Three (dot) Four Hundred Fifty-Six thousandths",
    );
  });

  it("rejects unknown styles", () => {
    expect(() => one("5", { style: "australian" })).toThrow(InvalidOptionsError);
  });
});

describe("ordinal output (v4.1)", () => {
  it("transforms the last word", () => {
    expect(one("1", { output: "ordinal" }).displayWord).toBe("First");
    expect(one("2", { output: "ordinal" }).displayWord).toBe("Second");
    expect(one("3", { output: "ordinal" }).displayWord).toBe("Third");
    expect(one("4", { output: "ordinal" }).displayWord).toBe("Fourth");
    expect(one("5", { output: "ordinal" }).displayWord).toBe("Fifth");
    expect(one("8", { output: "ordinal" }).displayWord).toBe("Eighth");
    expect(one("9", { output: "ordinal" }).displayWord).toBe("Ninth");
    expect(one("12", { output: "ordinal" }).displayWord).toBe("Twelfth");
    expect(one("20", { output: "ordinal" }).displayWord).toBe("Twentieth");
    expect(one("21", { output: "ordinal" }).displayWord).toBe("Twenty-First");
    expect(one("40", { output: "ordinal" }).displayWord).toBe("Fortieth");
    expect(one("0", { output: "ordinal" }).displayWord).toBe("Zeroth");
    expect(one("100", { output: "ordinal" }).displayWord).toBe("One Hundredth");
    expect(one("112", { output: "ordinal" }).displayWord).toBe("One Hundred and Twelfth");
    expect(one("1000", { output: "ordinal" }).displayWord).toBe("One Thousandth");
    expect(one("2000000", { output: "ordinal" }).displayWord).toBe("Two Millionth");
  });

  it("keeps the decimal phrase untouched and ordinals the whole part", () => {
    const r = one("21.5", { output: "ordinal", decimalPlaces: 1 });
    expect(r.displayWholeWord).toBe("Twenty-First");
    expect(r.displayWord).toBe("Twenty-First (dot) Five tenths");
    expect(r.displayNum).toBe("21.5");
    // Without explicit places, the default 2 still applies (21.50).
    expect(one("21.5", { output: "ordinal" }).displayWord).toBe(
      "Twenty-First (dot) Fifty hundredths",
    );
  });

  it("composes with style and negatives", () => {
    expect(one("112", { output: "ordinal", style: "american" }).displayWord).toBe(
      "One Hundred Twelfth",
    );
    expect(one("-3", { output: "ordinal" }).displayWord).toBe("(negative) Third");
    expect(one("-3", { output: "ordinal" }).displayWholeWord).toBe("Third");
    expect(one("-3", { output: "ordinal" }).negativeInt).toBe(true);
  });

  it("rejects unknown output values", () => {
    expect(() => one("5", { output: "hyper" })).toThrow(InvalidOptionsError);
  });
});

describe("currency mode (v4.1)", () => {
  const naira = { major: "Naira", majorPlural: "Naira", minor: "Kobo", minorPlural: "Kobo" };

  it("renders money words with 2 minor places", () => {
    const r = one("1234.56", { currency: naira });
    expect(r.displayWord).toBe(
      "One Thousand, Two Hundred and Thirty-Four Naira, Fifty-Six Kobo",
    );
    expect(r.displayNum).toBe("1,234.56");
    expect(r.currency).toEqual({
      majorLabel: "Naira",
      minorLabel: "Kobo",
      suffix: null,
    });
    expect(r.decimalPlaceWord).toBe("");
  });

  it("omits a zero minor part", () => {
    const r = one("1000.00", { currency: naira });
    expect(r.displayWord).toBe("One Thousand Naira");
    expect(r.currency?.minorLabel).toBeNull();
    expect(r.decimalPoint).toBe(false);
    expect(r.displayNum).toBe("1,000");
  });

  it("rounds half-up to the minor unit and carries", () => {
    expect(one("9.999", { currency: naira }).displayWord).toBe("Ten Naira");
    expect(one("0.995", { currency: naira }).displayWord).toBe("One Naira");
    expect(one("12.345", { currency: naira }).displayWord).toBe("Twelve Naira, Thirty-Five Kobo");
  });

  it("singular labels for value 1", () => {
    const r = one("1.01", { currency: naira });
    expect(r.displayWord).toBe("One Naira, One Kobo");
  });

  it("defaults pluralization to label + s", () => {
    expect(one("2", { currency: { major: "Dollars", minor: "Cents" } }).displayWord).toBe(
      "Two Dollars",
    );
    expect(one("2.5", { currency: { major: "Dollars", minor: "Cents" } }).displayWord).toBe(
      "Two Dollars, Fifty Cents",
    );
  });

  it("supports the check-writing suffix", () => {
    expect(one("25.50", { currency: { ...naira, suffix: "Only" } }).displayWord).toBe(
      "Twenty-Five Naira, Fifty Kobo Only",
    );
  });

  it("currencies without a minor label round to whole major units", () => {
    expect(one("10.7", { currency: { major: "Yen", majorPlural: "Yen" } }).displayWord).toBe(
      "Eleven Yen",
    );
    expect(one("10.4", { currency: { major: "Yen", majorPlural: "Yen" } }).displayWord).toBe(
      "Ten Yen",
    );
  });

  it("handles negatives and zero", () => {
    expect(one("-1234.56", { currency: naira }).displayWord).toBe(
      "(negative) One Thousand, Two Hundred and Thirty-Four Naira, Fifty-Six Kobo",
    );
    expect(one("0", { currency: naira }).displayWord).toBe("Zero Naira");
    expect(one("-0.004", { currency: naira }).displayWord).toBe("Zero Naira");
    expect(one("-0.004", { currency: naira }).negativeInt).toBe(false);
  });

  it("keeps fractional-scale arrays working with one currency option", () => {
    const results = JSnumberToWordProcessor(["10.5", "0.05"], { currency: naira });
    expect(results[0]?.displayWord).toBe("Ten Naira, Fifty Kobo");
    expect(results[1]?.displayWord).toBe("Zero Naira, Five Kobo");
  });

  it("validates currency labels strictly", () => {
    expect(() => one("5", { currency: {} as never })).toThrow(/currency.major is required/);
    expect(() => one("5", { currency: { major: "  " } })).toThrow(/non-empty string/);
    expect(() => one("5", { currency: { major: "Naira", minor: "" } })).toThrow(
      /non-empty string/,
    );
  });
});

describe("locale option (v4.1)", () => {
  it("defaults to en", () => {
    expect(one("9012", { locale: "en" }).displayWord).toBe("Nine Thousand and Twelve");
  });

  it("rejects unknown locales with a descriptive error", () => {
    expect(() => one("5", { locale: "xx" })).toThrow(/Unknown locale "xx"/);
  });

  it("supports registering custom locales", () => {
    // A tiny "demo" locale proves the extension point end-to-end.
    const demo = {
      ...enLocale,
      code: "demo",
      zeroWord: "Nought",
      thousandWord: "Grand",
      scaleWord: (groupIndex: number) =>
        groupIndex === 2 ? "Mega" : `${groupIndex}-illion`,
    };
    registerLocale(demo);

    expect(one("0", { locale: "demo" }).displayWord).toBe("Nought");
    expect(one("9012", { locale: "demo" }).displayWord).toBe("Nine Thousand and Twelve".replace("Thousand", "Grand"));
    expect(one("2000000", { locale: "demo" }).displayWord).toBe("Two Mega");
    expect(one("2000000000", { locale: "demo" }).displayWord).toBe("Two 3-illion");
  });
});
