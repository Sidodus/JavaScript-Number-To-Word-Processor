import { render, screen, fireEvent } from "@testing-library/react";
import { describe, expect, it } from "vitest";

import OptionsBar, { type ConsoleOptions } from "../components/OptionsBar";

const BASE: ConsoleOptions = {
  locale: "en",
  style: "british",
  output: "cardinal",
  currency: null,
};

describe("OptionsBar locale/style reconciliation (regression)", () => {
  it("resets the style to the new locale's default when the locale changes", () => {
    let current: ConsoleOptions = { ...BASE };
    const harness = () =>
      render(
        <OptionsBar
          options={current}
          onChange={(next) => {
            current = next;
            harness();
          }}
        />,
      );
    harness();

    fireEvent.change(screen.getByLabelText(/Locale/i), { target: { value: "fr" } });
    expect(current.locale).toBe("fr");
    expect(current.style).toBe("american"); // reconciled - fr rejects "british"
  });

  it("keeps british for locales that support the toggle", () => {
    let current: ConsoleOptions = { ...BASE };
    const harness = () =>
      render(
        <OptionsBar
          options={current}
          onChange={(next) => {
            current = next;
            harness();
          }}
        />,
      );
    harness();

    fireEvent.change(screen.getByLabelText(/Locale/i), { target: { value: "ha" } });
    expect(current.locale).toBe("ha");
    expect(current.style).toBe("british"); // ha's own default, still toggle-capable
  });
});
