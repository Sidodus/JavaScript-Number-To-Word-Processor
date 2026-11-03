# Testing Strategy — "No Bug Survives The Session"

The suite is the specification. `npm test` (Vitest) must be green before any
commit, together with `npm run lint` and `npm run typecheck`.

## Layers

| Layer | Location | What it proves |
|-------|----------|----------------|
| **Golden equivalence** | `packages/core/test/unit/illions.test.ts`, `ordinals.test.ts` | The algorithmic generator reproduces ALL 33,000 published v3 scale names + 27,000 v3-derived ordinals (fixture: `test/fixtures/v3-illion-table.json`). |
| **Unit** | `packages/core/test/unit/*.test.ts` | Parsing, grouping, ordinals, word rules, rounding, options, API surface — each module's contract in isolation. |
| **Regression locks** | `packages/core/test/regression/v3-bugs.test.ts` | One tombstone per confirmed v3 defect (12). If one fails, the bug is back. |
| **v3 parity** | `packages/core/test/golden/v3-parity.test.ts` | Outputs v3 got RIGHT stay byte-identical (headline examples, vocabulary, field set). |
| **UI integration** | `packages/ui/test/*.test.tsx` | jsdom + Testing Library: decimal control rejects negatives; conversions run through the REAL core; errors surface loudly. |

## Fixtures

`v3-illion-table.json` is generated (never hand-edited):

```sh
node scripts/extract-v3-table.mjs   # reads legacy/ -> rewrites the fixture
```

It maps digit-length → v3 scale word for lengths 4..33003 with no gaps. The
golden tests translate between the table's length-based indexing and the
generator's n-based indexing via `ceil(L/3) - 1` (see `CONWAY_WECHSLER.md` §2).

## Adding tests (the house rules)

1. **Bug fix → failing test first.** Reproduce, watch it fail, fix, watch it
   pass. Add the defect to `BUG_AUDIT_v3.md` (v3-era) or the changelog (v4).
2. **New edge case → new test even when behavior is already correct.** Tests
   are the executable specification; undocumented behavior invites regressions.
3. **Every output string in a test must be independently verified** — compute
   it by hand from the rules in `ARCHITECTURE.md` §3-4, never copy the
   implementation's output.
4. **No test-only branches inside production code.** If the library needs
   special behavior for a test, that's a design smell — reconsider.

## Manual UI smoke pass (before every UI release)

`npm run dev:ui`, then verify:

1. Decimal length `-3` → inline error, badge unchanged (v3 defect fix).
2. Decimal length `4` → badge updates, session-persisted.
3. Single conversion `9.999` @4 → "9.9,990: ... Nine Thousand, Nine Hundred and Ninety ten-thousandths".
4. Array `6677, -7674.969, 0.00012` → 3 results with `(negative)` and singular "One ten-thousandth".
5. Array `1, x, 3` → error alert mentioning "index 1".
6. Result styling: red negative sign, tomato `(dot)`, gray unit.

(These exact scenarios were executed in a real browser against the static
export during the v4 rewrite.)

## Performance guards

- `illions.test.ts` asserts the full 1..11000 name sweep runs < 200ms.
- The 33003-digit conversion path is exercised in unit + regression tests.
