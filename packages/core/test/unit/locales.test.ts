/**
 * Locale layer tests: the generic contract every registered locale must
 * satisfy (mirrors scripts/validate-locale.mjs), plus the French pilot's
 * verified samples (see docs/LOCALES.md for the source references).
 */
import { describe, expect, it } from "vitest";

import JSnumberToWordProcessor, { getLocale, localeCodes } from "../../src/index.js";
import { frLocale } from "../../src/locales/fr.js";

const one = (input: Parameters<typeof JSnumberToWordProcessor>[0], options?: unknown) =>
  JSnumberToWordProcessor(input, options as never)[0] as ReturnType<
    typeof JSnumberToWordProcessor
  >[number];

describe("locale contract (every registered locale)", () => {
  it("registry exposes en and fr", () => {
    expect(localeCodes().sort()).toEqual(["en", "fr"]);
  });

  for (const code of ["en", "fr"]) {
    describe(`contract: ${code}`, () => {
      const locale = getLocale(code);

      it("has exactly 100 unique small-number words aligned with zeroWord", () => {
        expect(locale.smallNumbers).toHaveLength(100);
        expect(locale.smallNumbers[0]).toBe(locale.zeroWord);
        const unique = new Set(locale.smallNumbers);
        expect(unique.size).toBe(100);
        for (const word of locale.smallNumbers) {
          expect(typeof word).toBe("string");
          expect(word.trim().length).toBeGreaterThan(0);
          expect(word).toBe(word.trim());
        }
      });

      it("has non-empty core vocabulary", () => {
        for (const field of ["zeroWord", "hundredWord", "thousandWord", "negativePrefix", "dotSeparator"] as const) {
          expect((locale[field] as string).length).toBeGreaterThan(0);
        }
      });

      it("ordinalizes every small-number cardinal without throwing (when the locale provides the hook)", () => {
        if (locale.ordinalize === undefined) {
          expect(locale.code).toBe("en"); // en uses the engine's default rules
          return;
        }
        for (const word of locale.smallNumbers) {
          const ordinal = locale.ordinalize(word);
          expect(typeof ordinal).toBe("string");
          expect(ordinal.length).toBeGreaterThan(0);
        }
      });
    });
  }
});

describe("french locale (fr) - verified samples", () => {
  const fr = (input: Parameters<typeof JSnumberToWordProcessor>[0], options?: unknown) =>
    one(input, { ...(options as object), locale: "fr" });

  it("builds the units, teens and tens per the verified rules", () => {
    expect(frLocale.smallNumbers.slice(0, 20)).toEqual([
      "zéro", "un", "deux", "trois", "quatre", "cinq", "six", "sept", "huit", "neuf",
      "dix", "onze", "douze", "treize", "quatorze", "quinze", "seize",
      "dix-sept", "dix-huit", "dix-neuf",
    ]);
  });

  it("handles the soixante/quatre-vingt families exactly", () => {
    expect(fr("20").displayWord).toBe("vingt");
    expect(fr("21").displayWord).toBe("vingt et un");
    expect(fr("22").displayWord).toBe("vingt-deux");
    expect(fr("70").displayWord).toBe("soixante-dix");
    expect(fr("71").displayWord).toBe("soixante et onze");
    expect(fr("79").displayWord).toBe("soixante-dix-neuf");
    expect(fr("80").displayWord).toBe("quatre-vingts");
    expect(fr("81").displayWord).toBe("quatre-vingt-un");
    expect(fr("89").displayWord).toBe("quatre-vingt-neuf");
    expect(fr("90").displayWord).toBe("quatre-vingt-dix");
    expect(fr("91").displayWord).toBe("quatre-vingt-onze");
    expect(fr("99").displayWord).toBe("quatre-vingt-dix-neuf");
  });

  it("applies the cent/cents and mille rules", () => {
    expect(fr("100").displayWord).toBe("cent");
    expect(fr("101").displayWord).toBe("cent un");
    expect(fr("200").displayWord).toBe("deux cents");
    expect(fr("201").displayWord).toBe("deux cent un");
    expect(fr("1000").displayWord).toBe("mille");
    expect(fr("1001").displayWord).toBe("mille un");
    expect(fr("1100").displayWord).toBe("mille cent");
    expect(fr("2000").displayWord).toBe("deux mille");
    expect(fr("2100").displayWord).toBe("deux mille cent");
  });

  it("uses the long scale with pluralization", () => {
    expect(fr("1000000").displayWord).toBe("un million");
    expect(fr("2000000").displayWord).toBe("deux millions");
    expect(fr("1000000000").displayWord).toBe("un milliard");
    expect(fr("2000000000").displayWord).toBe("deux milliards");
    expect(fr("1000000000000").displayWord).toBe("un billion"); // 10^12 long scale
    expect(fr("1000000000000000").displayWord).toBe("un billiard");
    expect(fr("1000000000000000000").displayWord).toBe("un trillion");
  });

  it("converts the README-style compound exactly", () => {
    expect(fr("123456789").displayWord).toBe(
      "cent vingt-trois millions quatre cent cinquante-six mille sept cent quatre-vingt-neuf",
    );
    expect(fr("123456789").displayNum).toBe("123,456,789");
  });

  it("handles negatives with the localized prefix", () => {
    expect(fr("-5").displayWord).toBe("(négatif) cinq");
    expect(fr("-5").negativeInt).toBe(true);
  });

  it("produces French ordinals including the premier/unième split", () => {
    expect(fr("1", { output: "ordinal" }).displayWord).toBe("premier");
    expect(fr("2", { output: "ordinal" }).displayWord).toBe("deuxième");
    expect(fr("9", { output: "ordinal" }).displayWord).toBe("neuvième");
    expect(fr("5", { output: "ordinal" }).displayWord).toBe("cinquième");
    expect(fr("21", { output: "ordinal" }).displayWord).toBe("vingt et unième");
    expect(fr("71", { output: "ordinal" }).displayWord).toBe("soixante et onzième");
    expect(fr("80", { output: "ordinal" }).displayWord).toBe("quatre-vingtième");
    expect(fr("100", { output: "ordinal" }).displayWord).toBe("centième");
    expect(fr("1000", { output: "ordinal" }).displayWord).toBe("millième");
    expect(fr("1000000", { output: "ordinal" }).displayWord).toBe("millionième");
  });

  it("rejects decimals loudly (no decimalOrdinal hook yet) - never mixed-language output", () => {
    expect(() => fr("5.5")).toThrow(/does not support decimal numbers yet/);
  });

  it("rejects the british style (no 'and' concept in French)", () => {
    expect(() => one("5", { locale: "fr", style: "british" })).toThrow(
      /only supports the "american" word style/,
    );
  });

  it("still works in currency mode (labels are caller-provided)", () => {
    const r = fr("25.50", {
      currency: { major: "euros", majorPlural: "euros", minor: "centimes", minorPlural: "centimes" },
    });
    // Money words need no ordinal hook: whole + minor words only.
    expect(r.displayWord).toBe("vingt-cinq euros, cinquante centimes");
    expect(r.currency?.majorLabel).toBe("euros");
  });
});
