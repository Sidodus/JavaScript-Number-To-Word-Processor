import { describe, expect, it } from "vitest";

import { illionName } from "../../src/illions.js";
import v3Table from "../fixtures/v3-illion-table.json";

describe("illionName - Conway-Wechsler spot checks", () => {
  it("names the small scales identically to standard English", () => {
    expect(illionName(1)).toBe("Million");
    expect(illionName(2)).toBe("Billion");
    expect(illionName(3)).toBe("Trillion");
    expect(illionName(4)).toBe("Quadrillion");
    expect(illionName(5)).toBe("Quintillion");
    expect(illionName(6)).toBe("Sextillion");
    expect(illionName(7)).toBe("Septillion");
    expect(illionName(8)).toBe("Octillion");
    expect(illionName(9)).toBe("Nonillion");
  });

  it("applies the unit-segment insertion rules (v3 table names)", () => {
    // tre -> tres before roots marked s/x
    expect(illionName(13)).toBe("Tredecillion");
    expect(illionName(23)).toBe("Tresvigintillion");
    expect(illionName(33)).toBe("Trestrigintillion");
    // se -> sed/ses variants
    expect(illionName(16)).toBe("Sedecillion");
    expect(illionName(26)).toBe("Sesvigintillion");
    expect(illionName(36)).toBe("Sestrigintillion");
    // septe/nove take m or n
    expect(illionName(17)).toBe("Septendecillion");
    expect(illionName(27)).toBe("Septemvigintillion");
    expect(illionName(19)).toBe("Novendecillion");
    expect(illionName(29)).toBe("Novemvigintillion");
  });

  it("names the hundreds tier (mrob examples)", () => {
    expect(illionName(103)).toBe("Trescentillion"); // 10^312
    expect(illionName(200)).toBe("Ducentillion"); // 10^603
    expect(illionName(300)).toBe("Trecentillion"); // 10^903
  });

  it("composes names for n >= 1000 (XilliYilliZillion)", () => {
    expect(illionName(1000)).toBe("Millinillion"); // 10^3003
    expect(illionName(10996)).toBe("Decillisenonagintanongentillion");
    expect(illionName(11000)).toBe("Undecillinillion"); // 10^33003
  });

  it("rejects invalid scale indices", () => {
    expect(() => illionName(0)).toThrow(RangeError);
    expect(() => illionName(-1)).toThrow(RangeError);
    expect(() => illionName(1.5)).toThrow(RangeError);
  });
});

describe("illionName - golden equivalence with the published v3 table", () => {
  const { table } = v3Table as { table: Record<string, string> };

  it("fixture sanity: covers lengths 4..33003 with 33000 entries", () => {
    const lengths = Object.keys(table).map(Number);
    expect(lengths.length).toBe(33000);
    expect(Math.min(...lengths)).toBe(4);
    expect(Math.max(...lengths)).toBe(33003);
  });

  /**
   * For an L-digit whole number the scale word sits at group index
   * k = ceil(L / 3) - 1; group 1 is "Thousand", group k >= 2 is
   * illionName(k - 1). Every one of the 33,000 legacy entries must match.
   */
  it("reproduces all 33,000 published v3 names exactly", () => {
    const mismatches: string[] = [];

    for (const [lengthText, v3Name] of Object.entries(table)) {
      const length = Number(lengthText);
      const groupIndex = Math.ceil(length / 3) - 1;
      const v4Name = groupIndex === 1 ? "Thousand" : illionName(groupIndex - 1);
      if (v4Name !== v3Name) {
        mismatches.push(`L=${length}: v3="${v3Name}" v4="${v4Name}"`);
      }
    }

    expect(
      mismatches,
      `${mismatches.length} mismatches:\n${mismatches.slice(0, 20).join("\n")}`,
    ).toHaveLength(0);
  });

  it("runs the full equivalence sweep fast (algorithmic, no 1.3MB lookup)", () => {
    const started = process.hrtime.bigint();
    for (let n = 1; n <= 11000; n++) {
      illionName(n);
    }
    const elapsedMs = Number(process.hrtime.bigint() - started) / 1e6;
    expect(elapsedMs).toBeLessThan(200);
  });
});
