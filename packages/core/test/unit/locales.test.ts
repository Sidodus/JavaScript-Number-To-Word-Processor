/**
 * Locale layer tests: the generic contract every registered locale must
 * satisfy (mirrors scripts/validate-locale.mjs), plus the French pilot's
 * verified samples (see docs/LOCALES.md for the source references).
 */
import { describe, expect, it } from "vitest";

import JSnumberToWordProcessor, { getLocale, localeCodes } from "../../src/index.js";
import { frLocale } from "../../src/locales/fr.js";
import { haLocale } from "../../src/locales/ha.js";
import { yoLocale } from "../../src/locales/yo.js";

const one = (input: Parameters<typeof JSnumberToWordProcessor>[0], options?: unknown) =>
  JSnumberToWordProcessor(input, options as never)[0] as ReturnType<
    typeof JSnumberToWordProcessor
  >[number];

describe("locale contract (every registered locale)", () => {
  it("registry exposes en, fr, ha and yo", () => {
    expect(localeCodes().sort()).toEqual(["en", "fr", "ha", "yo"]);
  });

  for (const code of ["en", "fr", "ha", "yo"]) {
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
          return; // locales without the hook reject ordinal output (guarded in process.ts)
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

describe("hausa locale (ha) - verified samples (docs/locales/ha-SPEC.md)", () => {
  const ha = (input: Parameters<typeof JSnumberToWordProcessor>[0], options?: unknown) =>
    one(input, { ...(options as object), locale: "ha" });

  it("builds the units, goma-sha teens and da-joined tens", () => {
    expect(haLocale.smallNumbers.slice(0, 12)).toEqual([
      "sifili", "ɗaya", "biyu", "uku", "huɗu", "biyar", "shida", "bakwai", "takwas", "tara",
      "goma", "goma sha ɗaya",
    ]);
    expect(ha("19").displayWord).toBe("goma sha tara");
    expect(ha("21").displayWord).toBe("ashirin da ɗaya");
    expect(ha("40").displayWord).toBe("arba'in");
    expect(ha("90").displayWord).toBe("casa'in");
    expect(ha("99").displayWord).toBe("casa'in da tara");
  });

  it("puts the multiplier after the scale word", () => {
    expect(ha("100").displayWord).toBe("ɗari");
    expect(ha("101").displayWord).toBe("ɗari da ɗaya");
    expect(ha("150").displayWord).toBe("ɗari da hamsin");
    expect(ha("200").displayWord).toBe("ɗari biyu");
    expect(ha("999").displayWord).toBe("ɗari tara da casa'in da tara");
    expect(ha("1000").displayWord).toBe("dubu ɗaya");
    expect(ha("1001").displayWord).toBe("dubu ɗaya da ɗaya");
    expect(ha("1100").displayWord).toBe("dubu ɗaya da ɗari");
    expect(ha("2000").displayWord).toBe("dubu biyu");
    expect(ha("2150").displayWord).toBe("dubu biyu da ɗari da hamsin");
    expect(ha("10000").displayWord).toBe("dubu goma");
    expect(ha("100000").displayWord).toBe("dubu ɗari");
  });

  it("uses the attested scale loans and joins every component with da", () => {
    expect(ha("1000000").displayWord).toBe("miliyan ɗaya");
    expect(ha("2000000").displayWord).toBe("miliyan biyu");
    expect(ha("1000000000").displayWord).toBe("biliyan ɗaya");
    expect(ha("1000000000000").displayWord).toBe("tiriliyan ɗaya");
    expect(ha("1234567").displayWord).toBe(
      "miliyan ɗaya da dubu ɗari biyu da talatin da huɗu da ɗari biyar da sittin da bakwai",
    );
  });

  it("code-switches to English scale names beyond 10^12 (SPEC §6, documented practice)", () => {
    expect(ha("1000000000000000").displayWord).toBe("quadrillion ɗaya");
  });

  it("handles negatives and rejects decimals/styles it cannot express", () => {
    expect(ha("-5").displayWord).toBe("(negative) biyar");
    expect(() => ha("5.5")).toThrow(/does not support decimal numbers yet/);
    expect(() => one("5", { locale: "ha", style: "american" })).toThrow(
      /only supports the "british" word style/,
    );
  });

  it("still works in currency mode", () => {
    const r = ha("1234.56", {
      currency: { major: "Naira", majorPlural: "Naira", minor: "Kobo", minorPlural: "Kobo" },
    });
    expect(r.displayWord).toBe(
      "dubu ɗaya da ɗari biyu da talatin da huɗu Naira, hamsin da shida Kobo",
    );
  });
});


describe("yoruba locale (yo) - verified samples (docs/locales/yo-SPEC.md)", () => {
  const yo = (input: Parameters<typeof JSnumberToWordProcessor>[0], options?: unknown) =>
    one(input, { ...(options as object), locale: "yo" });

  it("builds the units, lá-teens and the special 15", () => {
    expect(yoLocale.smallNumbers.slice(0, 20)).toEqual([
      "òdo", "ọ̀kan", "èjì", "ẹ̀ta", "ẹ̀rin", "àrún", "ẹ̀fà", "èje", "ẹ̀jọ", "ẹ̀sán",
      "ẹ̀wá", "ọ̀kanlá", "èjìlá", "ẹ̀tàlá", "ẹ̀rìnlá", "ẹ̀ẹ́dógún",
      "ẹ̀rìndínlógún", "ẹ̀tàdínlógún", "èjìdínlógún", "ọ̀kàndínlógún",
    ]);
  });

  it("applies the additive lé and subtractive dín patterns per decade", () => {
    expect(yo("20").displayWord).toBe("ogún");
    expect(yo("21").displayWord).toBe("ogún lé ọ̀kan");
    expect(yo("24").displayWord).toBe("ogún lé ẹ̀rin");
    expect(yo("25").displayWord).toBe("ẹ̀ẹ́dọ́gbọ̀n");
    expect(yo("28").displayWord).toBe("èjìdínlọ́gbọ̀n");
    expect(yo("30").displayWord).toBe("ọgbọ̀n");
    expect(yo("35").displayWord).toBe("aárùn-dínlógójì");
    expect(yo("40").displayWord).toBe("ogójì");
    expect(yo("50").displayWord).toBe("àádọ́ta");
    expect(yo("55").displayWord).toBe("aárùn-dínlọ́ta");
    expect(yo("65").displayWord).toBe("aárùn-dínlàádọ́rin");
    expect(yo("75").displayWord).toBe("aárùn-dínlọ́rin");
    expect(yo("85").displayWord).toBe("aárùn-dínlàádọ́rùn-ún");
    expect(yo("95").displayWord).toBe("aárùn-dínlọ̀rún-ún");
    expect(yo("99").displayWord).toBe("ọ̀kàndínlọ̀rún-ún");
  });

  it("uses the traditional hundreds chain", () => {
    expect(yo("100").displayWord).toBe("ọgọ́rùn-ún");
    expect(yo("200").displayWord).toBe("igba");
    expect(yo("300").displayWord).toBe("ọ̀ọ́dúrún");
    expect(yo("400").displayWord).toBe("irinwó");
    expect(yo("500").displayWord).toBe("ẹ̀ẹ́dẹ́gbẹ̀ta");
    expect(yo("600").displayWord).toBe("ẹgbẹ̀ta");
    expect(yo("700").displayWord).toBe("ẹ̀ẹ́dẹ́gbẹ̀rin");
    expect(yo("800").displayWord).toBe("ẹgbẹ̀rin");
    expect(yo("900").displayWord).toBe("ẹ̀ẹ́dẹ́gbẹ̀rún");
    expect(yo("250").displayWord).toBe("igba àádọ́ta");
    expect(yo("999").displayWord).toBe("ẹ̀ẹ́dẹ́gbẹ̀rún ọ̀kàndínlọ̀rún-ún");
  });

  it("uses the modern decimal thousands with object multipliers", () => {
    expect(yo("1000").displayWord).toBe("ẹgbẹ̀rún");
    expect(yo("2000").displayWord).toBe("ẹgbẹ̀rún méjì");
    expect(yo("3000").displayWord).toBe("ẹgbẹ̀rún mẹ́ta");
    expect(yo("10000").displayWord).toBe("ẹgbẹ̀rún mẹ́wá");
    expect(yo("11000").displayWord).toBe("ẹgbẹ̀rún ọ̀kanlá");
    expect(yo("100000").displayWord).toBe("ẹgbẹ̀rún ọgọ́rùn-ún");
  });

  it("composes loans and the traditional chain exactly", () => {
    expect(yo("1000000").displayWord).toBe("mílíọ̀nù kan");
    expect(yo("2000000").displayWord).toBe("mílíọ̀nù méjì");
    expect(yo("5000000").displayWord).toBe("mílíọ̀nù márùn-ún");
    expect(yo("1000000000").displayWord).toBe("bílíọ̀nù kan");
    expect(yo("1234567").displayWord).toBe(
      "mílíọ̀nù kan ẹgbẹ̀rún igba ọgbọ̀n lé ẹ̀rin ẹ̀ẹ́dẹ́gbẹ̀ta ẹ̀tàdínlàádọ́rin",
    );
  });

  it("code-switches to English scale names beyond 10^9 (SPEC §6, documented practice)", () => {
    expect(yo("1000000000000").displayWord).toBe("trillion kan");
  });

  it("handles negatives and rejects decimals/ordinals/styles it cannot express", () => {
    expect(yo("-5").displayWord).toBe("(negative) àrún");
    expect(() => yo("5.5")).toThrow(/does not support decimal numbers yet/);
    expect(() => yo("21", { output: "ordinal" })).toThrow(
      /does not support ordinal output yet/,
    );
    expect(() => one("5", { locale: "yo", style: "british" })).toThrow(
      /only supports the "american" word style/,
    );
  });

  it("still works in currency mode", () => {
    const r = yo("1234.56", {
      currency: { major: "Naira", majorPlural: "Naira", minor: "Kobo", minorPlural: "Kobo" },
    });
    expect(r.displayWord).toBe(
      "ẹgbẹ̀rún igba ọgbọ̀n lé ẹ̀rin Naira, ẹ̀rìndínlọ́ta Kobo",
    );
  });
});
