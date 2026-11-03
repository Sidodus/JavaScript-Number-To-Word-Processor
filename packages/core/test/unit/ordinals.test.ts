import { describe, expect, it } from "vitest";

import { decimalPlaceOrdinal } from "../../src/ordinals.js";
import v3Table from "../fixtures/v3-illion-table.json";

describe("decimalPlaceOrdinal", () => {
  it("names the base places", () => {
    expect(decimalPlaceOrdinal(1)).toBe("tenths");
    expect(decimalPlaceOrdinal(1, true)).toBe("tenth");
    expect(decimalPlaceOrdinal(2)).toBe("hundredths");
    expect(decimalPlaceOrdinal(2, true)).toBe("hundredth");
    expect(decimalPlaceOrdinal(3)).toBe("thousandths");
    expect(decimalPlaceOrdinal(3, true)).toBe("thousandth");
  });

  it("applies ten-/hundred- prefixes in the correct cycle", () => {
    expect(decimalPlaceOrdinal(4)).toBe("ten-thousandths");
    expect(decimalPlaceOrdinal(5)).toBe("hundred-thousandths");
    expect(decimalPlaceOrdinal(6)).toBe("millionths");
    expect(decimalPlaceOrdinal(7)).toBe("ten-millionths");
    expect(decimalPlaceOrdinal(8)).toBe("hundred-millionths");
    expect(decimalPlaceOrdinal(9)).toBe("billionths");
    // README v3 example: 11 decimal digits -> "hundred-billionths"; 12 -> "trillionths"
    expect(decimalPlaceOrdinal(11)).toBe("hundred-billionths");
    expect(decimalPlaceOrdinal(12)).toBe("trillionths");
  });

  it("uses illion-scale names far beyond everyday places", () => {
    expect(decimalPlaceOrdinal(102)).toBe("trestrigintillionths");
    expect(decimalPlaceOrdinal(103)).toBe("ten-trestrigintillionths");
    expect(decimalPlaceOrdinal(104)).toBe("hundred-trestrigintillionths");
    expect(decimalPlaceOrdinal(105)).toBe("quattuortrigintillionths");
  });

  it("reaches the supported limit without crashing (v3 crashed/staled here)", () => {
    expect(decimalPlaceOrdinal(33001)).toBe("ten-decillinovenonagintanongentillionths");
    expect(decimalPlaceOrdinal(33002)).toBe("hundred-decillinovenonagintanongentillionths");
    expect(decimalPlaceOrdinal(33003)).toBe("undecillinillionths");
  });

  it("rejects out-of-range places", () => {
    expect(() => decimalPlaceOrdinal(0)).toThrow(RangeError);
    expect(() => decimalPlaceOrdinal(-4)).toThrow(RangeError);
    expect(() => decimalPlaceOrdinal(33004)).toThrow(RangeError);
    expect(() => decimalPlaceOrdinal(2.5)).toThrow(RangeError);
  });
});

describe("decimalPlaceOrdinal - equivalence with v3 length-table lookup", () => {
  const { table } = v3Table as { table: Record<string, string> };

  /**
   * v3 derived the ordinal for place p from the digit-length table at p+1:
   * scale = table(p + 1) lowercased, prefix cycle p % 3. For every place where
   * the legacy lookup is in range (p + 1 <= 33003), v4 must agree exactly.
   */
  it("matches the v3-derived ordinal for all in-range places 3..33001", () => {
    const mismatches: string[] = [];

    for (let place = 3; place <= 33001; place++) {
      const v3Scale = (table[String(place + 1)] ?? "").toLowerCase();
      const prefixCycle = place % 3;
      const v3Prefix = prefixCycle === 1 ? "ten-" : prefixCycle === 2 ? "hundred-" : "";
      const v3Ordinal = `${v3Prefix}${v3Scale}ths`;
      if (v3Scale.length === 0) {
        continue; // gap guard - fixture has none, but stay defensive
      }
      const v4Ordinal = decimalPlaceOrdinal(place);
      if (v4Ordinal !== v3Ordinal) {
        mismatches.push(`p=${place}: v3="${v3Ordinal}" v4="${v4Ordinal}"`);
      }
    }

    expect(
      mismatches,
      `${mismatches.length} mismatches:\n${mismatches.slice(0, 20).join("\n")}`,
    ).toHaveLength(0);
  });
});
