/**
 * Locale registry. Locales are additive data: register a LocaleDefinition and
 * pass `locale: "<code>"` in the options. Unknown codes throw
 * InvalidOptionsError (strict error contract - never a silent fallback).
 */

import { InvalidOptionsError } from "../errors.js";
import { enLocale } from "./en.js";
import { frLocale } from "./fr.js";
import { haLocale } from "./ha.js";
import { yoLocale } from "./yo.js";
import type { LocaleDefinition } from "./types.js";

const registry = new Map<string, LocaleDefinition>();

registry.set(enLocale.code, enLocale);
registry.set(frLocale.code, frLocale);
registry.set(haLocale.code, haLocale);
registry.set(yoLocale.code, yoLocale);

/** Registers (or replaces) a locale definition. Returns the registry size. */
export function registerLocale(definition: LocaleDefinition): number {
  if (!definition || typeof definition.code !== "string" || definition.code.length === 0) {
    throw new InvalidOptionsError("A locale definition requires a non-empty code.");
  }
  registry.set(definition.code, definition);
  return registry.size;
}

/** Returns the registered locale for a code, or throws a descriptive error. */
export function getLocale(code: string): LocaleDefinition {
  const found = registry.get(code);
  if (found === undefined) {
    throw new InvalidOptionsError(
      `Unknown locale "${code}". Registered locales: ${[...registry.keys()].join(", ")}. ` +
        `Register custom locales with registerLocale() - see docs/LOCALES.md.`,
    );
  }
  return found;
}

/** Read-only list of registered locale codes (for docs and UIs). */
export function localeCodes(): string[] {
  return [...registry.keys()];
}
