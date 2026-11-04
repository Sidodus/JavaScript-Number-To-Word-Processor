import { describe, expect, it } from "vitest";

import { wholePartToWords } from "../../src/words.js";
import { enLocale } from "../../src/locales/en.js";

describe("wholePartToWords - base cases", () => {
  it("handles zero and single groups", () => {
    expect(wholePartToWords("0", enLocale, "british")).toBe("Zero");
    expect(wholePartToWords("5", enLocale, "british")).toBe("Five");
    expect(wholePartToWords("12", enLocale, "british")).toBe("Twelve");
    expect(wholePartToWords("100", enLocale, "british")).toBe("One Hundred");
    expect(wholePartToWords("101", enLocale, "british")).toBe("One Hundred and One");
    expect(wholePartToWords("123", enLocale, "british")).toBe("One Hundred and Twenty-Three");
    expect(wholePartToWords("007", enLocale, "british")).toBe("Seven");
  });
});

describe("wholePartToWords - the 'and' rules (v4 standard British style)", () => {
  it("uses 'and' without a comma before a final bare tens/units group", () => {
    expect(wholePartToWords("1005", enLocale, "british")).toBe("One Thousand and Five");
    expect(wholePartToWords("1012", enLocale, "british")).toBe("One Thousand and Twelve");
    expect(wholePartToWords("9012", enLocale, "british")).toBe("Nine Thousand and Twelve");
    expect(wholePartToWords("1000012", enLocale, "british")).toBe("One Million and Twelve");
    expect(wholePartToWords("100012", enLocale, "british")).toBe("One Hundred Thousand and Twelve");
    expect(wholePartToWords("1000005", enLocale, "british")).toBe("One Million and Five");
  });

  it("skips the final 'and' when the final group carries its own", () => {
    expect(wholePartToWords("1234", enLocale, "british")).toBe("One Thousand, Two Hundred and Thirty-Four");
    expect(wholePartToWords("1000156", enLocale, "british")).toBe("One Million, One Hundred and Fifty-Six");
  });

  it("skips the final 'and' when the final group is an exact hundred", () => {
    expect(wholePartToWords("1100", enLocale, "british")).toBe("One Thousand, One Hundred");
    expect(wholePartToWords("1000100", enLocale, "british")).toBe("One Million, One Hundred");
  });

  it("keeps internal group 'and' while joining groups with commas", () => {
    expect(wholePartToWords("123456789", enLocale, "british")).toBe(
      "One Hundred and Twenty-Three Million, Four Hundred and Fifty-Six Thousand, " +
        "Seven Hundred and Eighty-Nine",
    );
  });

  it("skips empty groups", () => {
    expect(wholePartToWords("1000000000000", enLocale, "british")).toBe("One Trillion");
    expect(wholePartToWords("1000000000000000000000", enLocale, "british")).toBe("One Sextillion");
    expect(wholePartToWords("2000000000000000000000000000000000", enLocale, "british")).toBe("Two Decillion");
  });

  it("reaches the 33003-digit limit with correct scale words", () => {
    // 33003 digits -> 11001 groups -> highest group "100" at index 11000
    // -> scale illionName(10999) = "Decillinovenonagintanongentillion".
    const digits = `1${"0".repeat(33002)}`;
    expect(wholePartToWords(digits, enLocale, "british")).toBe("One Hundred Decillinovenonagintanongentillion");
  });
});
