/**
 * Locale definition contract.
 *
 * v4.1 introduces the locale layer: all human-facing vocabulary is supplied by
 * a LocaleDefinition instead of being hard-coded in the word engine. English
 * ("en") ships built in, in both British ("and") and American (no "and")
 * styles. Additional locales are additive data - see docs/LOCALES.md.
 *
 * IMPORTANT (docs/DECISIONS.md, ADR-008): only locales whose number-naming
 * rules can be stated algorithmically and verified are accepted. A locale with
 * hand-guessed words would violate the project's exactness contract.
 */

export interface LocaleDefinition {
  /** Registry key, e.g. "en". Lower-case BCP-47-ish language tag. */
  readonly code: string;

  /** Word for zero ("Zero" / "Zeroth" is derived via ordinalizeLastWord). */
  readonly zeroWord: string;

  /** Words for 0..99, index by value. Index 0 should equal {@link zeroWord}. */
  readonly smallNumbers: readonly string[];

  /** "Hundred". */
  readonly hundredWord: string;

  /** Scale word for group index 1 (10^3): "Thousand". */
  readonly thousandWord: string;

  /** Prefix rendered before the whole words for negative values: "(negative) ". */
  readonly negativePrefix: string;

  /** Separator between whole words and decimal words: " (dot) ". */
  readonly dotSeparator: string;

  /**
   * Whether the language uses the British "and" joining ("One Hundred and
   * Twenty-Three") or the American plain joining ("One Hundred Twenty-Three").
   * The `style` option can override this per call for locales that support both.
   */
  readonly andStyle: "british" | "american";

  /**
   * The joiner word used in british-style positions (v4.2). Defaults to
   * "and" (English); Hausa joins with "da": "ɗari da hamsin", "dubu ɗaya da
   * ɗari". Only meaningful when `andStyle` is "british".
   */
  readonly andWord?: string;

  /**
   * True when the language supports BOTH joining styles so the `style` option
   * may switch them (English: yes; French: no - it has no "and" concept).
   * When false, passing a `style` different from `andStyle` throws
   * InvalidOptionsError instead of producing impossible output.
   */
  readonly supportsBothStyles?: boolean;

  /**
   * Ordinal word for a decimal place ("tenths"/"hundred-thousandths"),
   * localized. When absent, decimals are only supported for the built-in
   * English construction; other locales REJECT decimal inputs with a
   * descriptive InvalidOptionsError (exactness over mixed-language output).
   */
  readonly decimalOrdinal?: (place: number, singular: boolean) => string;

  /**
   * Scale word for group index i >= 2 (10^(3i)). Defaults to the short-scale
   * Conway-Wechsler name `illionName(i - 1)`.
   */
  readonly scaleWord?: (groupIndex: number) => string;

  /**
   * Scale word with the group VALUE and the pre-rendered group words
   * (v4.1: French "un million" vs "deux millions" and its long scale;
   * v4.2: Hausa's multiplier-after order - "miliyan ɗaya", "ɗari biyu" style).
   * `groupWords` is the value spoken as a standalone group (1..999) in this
   * locale. When present, the hook owns the WHOLE group phrase - it decides
   * where the group words sit (French group-first: "cent vingt-trois
   * millions"; Hausa scale-first: "miliyan ɗaya"). Group index 1 is handled
   * by `thousandPhraseFor`.
   */
  readonly scaleWordFor?: (
    groupIndex: number,
    groupValue: number,
    groupWords: string,
  ) => string;

  /**
   * Full phrase for the hundreds part of a group (v4.1). Lets locales express
   * inflection that depends on whether a remainder follows
   * (French: "deux cents" but "deux cent un"). When absent the engine renders
   * `${smallNumberWord(hundreds)} ${hundredWord}`.
   */
  readonly hundredPhraseFor?: (hundreds: number, remainder: number) => string;

  /**
   * Full phrase for the thousands group (v4.1). Lets locales absorb the
   * unit word (French: "mille", never "un mille") or inflect
   * ("deux mille"). When absent the engine renders
   * `${smallNumberWord(value)} ${thousandWord}`.
   */
  readonly thousandPhraseFor?: (groupValue: number, groupWords: string) => string;

  /**
   * Separator between spoken scale groups (default ", "). French joins with
   * a plain space: "cent vingt-trois millions quatre cent cinquante-six
   * mille sept cent quatre-vingt-neuf".
   */
  readonly groupSeparator?: string;

  /**
   * Ordinal form of a cardinal sentence (v4.1): "Twenty-One" -> "Twenty-First".
   * Sentence-level so locales can apply article rules
   * (French: "un million" -> "millionième" - the "un" article disappears).
   * When absent the engine applies the English last-word rules
   * (tens -> -ieth, irregular First/Second/Third/Fifth/Eighth/Ninth/Twelfth).
   */
  readonly ordinalize?: (cardinal: string) => string;
}
