import { describe, expect, it } from "vitest";

import { groupDigits } from "../../src/format.js";

describe("groupDigits - whole part (leftmost group carries the remainder)", () => {
  it("leaves short strings untouched", () => {
    expect(groupDigits("5")).toBe("5");
    expect(groupDigits("987")).toBe("987");
  });

  it("groups long strings in threes from the right", () => {
    expect(groupDigits("8476787747")).toBe("8,476,787,747");
    expect(groupDigits("1000")).toBe("1,000");
    expect(groupDigits("100000000000000000000")).toBe("100,000,000,000,000,000,000");
  });
});

describe("groupDigits - decimal part (right-anchored visual aid, intentional v3 behaviour)", () => {
  /**
   * Decimal digits group in threes anchored at the decimal point so each
   * comma sits where the words say "Thousand," - e.g. "98,588" matches
   * "Ninety-Eight Thousand, Five Hundred and Eighty-Eight hundred-thousandths".
   * This grouping was INTENTIONAL in v3 (confirmed by the author) and is
   * documented + locked here so it is never "fixed" by mistake.
   */
  it("anchors groups at the decimal point", () => {
    expect(groupDigits("588")).toBe("588");
    expect(groupDigits("98588")).toBe("98,588");
    expect(groupDigits("1234")).toBe("1,234");
    expect(groupDigits("00012")).toBe("00,012");
    expect(groupDigits("000002")).toBe("000,002");
    expect(groupDigits("998853")).toBe("998,853");
  });

  it("keeps leading zeros inside decimal groups", () => {
    expect(groupDigits("00")).toBe("00");
    expect(groupDigits("05")).toBe("05");
    expect(groupDigits("0005")).toBe("0,005");
  });
});
