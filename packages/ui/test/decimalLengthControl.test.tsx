import { render, screen, fireEvent } from "@testing-library/react";
import { beforeEach, describe, expect, it } from "vitest";

import DecimalLengthControl, {
  validateDecimalLengthInput,
} from "../components/DecimalLengthControl";

describe("validateDecimalLengthInput (v3 UI bug fix: no negatives)", () => {
  it("rejects negative values - the reported v3 defect", () => {
    expect(validateDecimalLengthInput("-3", 2).error).toMatch(/Negative decimal lengths/);
    expect(validateDecimalLengthInput("-1", 2).next).toBeUndefined();
  });

  it("rejects non-integer and junk input", () => {
    expect(validateDecimalLengthInput("2.5", 2).error).toMatch(/whole number/);
    expect(validateDecimalLengthInput("abc", 2).error).toMatch(/whole number/);
  });

  it("rejects values beyond the 33003 limit", () => {
    expect(validateDecimalLengthInput("33004", 2).error).toMatch(/maximum is 33003/);
  });

  it("accepts 0 and in-range integers", () => {
    expect(validateDecimalLengthInput("0", 2).next).toBe(0);
    expect(validateDecimalLengthInput("5", 2).next).toBe(5);
    expect(validateDecimalLengthInput("33003", 2).next).toBe(33003);
  });

  it("empty input resets to the current value", () => {
    expect(validateDecimalLengthInput("", 2).next).toBe(2);
  });
});

describe("DecimalLengthControl interaction", () => {
  beforeEach(() => {
    sessionStorage.clear();
  });

  it("does NOT commit a negative draft and shows an error", () => {
    let committed: number | undefined;
    render(<DecimalLengthControl value={2} onChange={(next) => (committed = next)} />);

    const input = screen.getByLabelText(/Decimal place length/i);
    fireEvent.change(input, { target: { value: "-3" } });
    fireEvent.click(screen.getByRole("button", { name: "Change..." }));

    expect(screen.getByTestId("decimal-length-feedback").textContent).toMatch(/Negative/);
    expect(committed).toBeUndefined();
    expect(sessionStorage.getItem("decimalPlaceLength")).toBeNull();
  });

  it("commits a valid value and persists it to session storage", () => {
    let committed: number | undefined;
    render(<DecimalLengthControl value={2} onChange={(next) => (committed = next)} />);

    const input = screen.getByLabelText(/Decimal place length/i);
    fireEvent.change(input, { target: { value: "4" } });
    fireEvent.click(screen.getByRole("button", { name: "Change..." }));

    expect(committed).toBe(4);
    expect(sessionStorage.getItem("decimalPlaceLength")).toBe("4");
  });
});
