import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";

import NumberForms from "../components/NumberForms";
import type { ConsoleOptions } from "../components/OptionsBar";

const DEFAULT_OPTIONS: ConsoleOptions = {
  locale: "en",
  style: "british",
  output: "cardinal",
  currency: null,
};

describe("NumberForms end-to-end conversion", () => {
  let captured: { displayWord: string; displayNum: string }[] | null = null;

  const harness = (options: ConsoleOptions = DEFAULT_OPTIONS) => {
    captured = null;
    render(
      <NumberForms
        decimalPlaces={2}
        options={options}
        onProcessed={(state) => {
          captured = state.results.map((r) => ({
            displayWord: r.displayWord,
            displayNum: r.displayNum,
          }));
        }}
      />,
    );
  };

  beforeEach(() => {
    sessionStorage.clear();
  });

  it("processes a single number through the core library", async () => {
    harness();
    fireEvent.change(screen.getByLabelText(/Input A Number/i), {
      target: { value: "987" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Process A Number/i }));

    await waitFor(() => expect(captured).not.toBeNull());
    expect(captured?.[0]?.displayWord).toBe("Nine Hundred and Eighty-Seven");
  });

  it("surfaces core errors instead of failing silently", async () => {
    harness();
    fireEvent.change(screen.getByLabelText(/Input A Number/i), {
      target: { value: "abc" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Process A Number/i }));

    await waitFor(() =>
      expect(screen.getByTestId("form-error").textContent).toMatch(/Invalid number/),
    );
    expect(captured).toBeNull();
  });

  it("processes comma/newline separated arrays in order", async () => {
    harness();
    fireEvent.change(screen.getByLabelText(/Input An Array Of Numbers/i), {
      target: { value: "6677, -7674.969\n0.00" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Process An Array/i }));

    await waitFor(() => expect(captured).not.toBeNull());
    expect(captured).toHaveLength(3);
    expect(captured?.[0]?.displayNum).toBe("6,677");
    expect(captured?.[1]?.displayNum).toBe("-7,674.97");
    expect(captured?.[2]?.displayNum).toBe("0");
  });

  it("reports the position of the first invalid array entry", async () => {
    harness();
    fireEvent.change(screen.getByLabelText(/Input An Array Of Numbers/i), {
      target: { value: "1, x, 3" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Process An Array/i }));

    await waitFor(() =>
      expect(screen.getByTestId("form-error").textContent).toMatch(/index 1/),
    );
  });

  it("applies the decimal length to decimal entries", async () => {
    harness();
    fireEvent.change(screen.getByLabelText(/Input A Number/i), {
      target: { value: "9.999" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Process A Number/i }));

    await waitFor(() => expect(captured).not.toBeNull());
    // 9.999 @2 rounds up and the vanished decimal is dropped: "Ten", not "Ten (dot) Zero".
    expect(captured?.[0]?.displayWord).toBe("Ten");
  });
});

describe("NumberForms v4.1 options", () => {
  let captured: { displayWord: string }[] | null = null;

  const harnessWith = (options: ConsoleOptions) => {
    captured = null;
    render(
      <NumberForms
        decimalPlaces={2}
        options={options}
        onProcessed={(state) => {
          captured = state.results.map((r) => ({ displayWord: r.displayWord }));
        }}
      />,
    );
  };

  it("applies american style end-to-end", async () => {
    harnessWith({ ...DEFAULT_OPTIONS, style: "american" });
    fireEvent.change(screen.getByLabelText(/Input A Number/i), { target: { value: "9012" } });
    fireEvent.click(screen.getByRole("button", { name: /Process A Number/i }));
    await waitFor(() => expect(captured).not.toBeNull());
    expect(captured?.[0]?.displayWord).toBe("Nine Thousand, Twelve");
  });

  it("applies currency mode end-to-end", async () => {
    harnessWith({
      ...DEFAULT_OPTIONS,
      currency: { major: "Naira", majorPlural: "Naira", minor: "Kobo", minorPlural: "Kobo" },
    });
    fireEvent.change(screen.getByLabelText(/Input A Number/i), {
      target: { value: "1234.56" },
    });
    fireEvent.click(screen.getByRole("button", { name: /Process A Number/i }));
    await waitFor(() => expect(captured).not.toBeNull());
    expect(captured?.[0]?.displayWord).toBe(
      "One Thousand, Two Hundred and Thirty-Four Naira, Fifty-Six Kobo",
    );
  });

  it("applies ordinal output end-to-end", async () => {
    harnessWith({ ...DEFAULT_OPTIONS, output: "ordinal" });
    fireEvent.change(screen.getByLabelText(/Input A Number/i), { target: { value: "21" } });
    fireEvent.click(screen.getByRole("button", { name: /Process A Number/i }));
    await waitFor(() => expect(captured).not.toBeNull());
    expect(captured?.[0]?.displayWord).toBe("Twenty-First");
  });
});
