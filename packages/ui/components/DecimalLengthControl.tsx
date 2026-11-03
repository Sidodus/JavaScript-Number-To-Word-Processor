"use client";

import { useEffect, useId, useState } from "react";
import { Button, Form, InputGroup } from "react-bootstrap";

import { MAX_DECIMAL_PLACES } from "js-number-to-word-processor";

/** Session-storage key carried over from v3. */
const STORAGE_KEY = "decimalPlaceLength";

export interface DecimalLengthControlProps {
  /** Current validated decimal length applied to conversions. */
  value: number;
  /** Called with the next VALID decimal length (0..33003). */
  onChange: (next: number) => void;
}

interface ValidationOutcome {
  next?: number;
  error?: string;
  hint?: string;
}

/**
 * Parses a raw decimal-length input. v3 accepted negatives (and any value up
 * to 100) and silently redirected them to 2 places; v4 validates loudly:
 * integers 0..33003 only.
 */
export function validateDecimalLengthInput(
  raw: string,
  fallback: number,
): ValidationOutcome {
  const trimmed = raw.trim();
  if (trimmed.length === 0) {
    return { next: fallback, hint: "Reset to the current length." };
  }

  if (!/^[+-]?\d+$/.test(trimmed)) {
    return { error: "Enter a whole number of decimal places (0 or more)." };
  }

  const parsed = Number(trimmed);
  if (parsed < 0) {
    return {
      error: "Negative decimal lengths are not supported. Use 0 or a positive whole number.",
    };
  }
  if (parsed > MAX_DECIMAL_PLACES) {
    return { error: `The supported maximum is ${MAX_DECIMAL_PLACES} decimal places.` };
  }
  return { next: parsed };
}

/**
 * "Change Decimal Length" control (default is 2).
 * Rejects negative, non-integer and oversized values with inline feedback -
 * fixing the v3 defect where a negative number was accepted silently.
 */
export default function DecimalLengthControl({
  value,
  onChange,
}: DecimalLengthControlProps) {
  const [draft, setDraft] = useState("");
  const [feedback, setFeedback] = useState<{ tone: "error" | "ok"; text: string } | null>(null);
  const inputId = useId();

  useEffect(() => {
    // Clear transient feedback whenever a new value is committed externally.
    setFeedback(null);
  }, [value]);

  const submit = (event: React.FormEvent) => {
    event.preventDefault();
    const outcome = validateDecimalLengthInput(draft, value);
    if (outcome.error !== undefined || outcome.next === undefined) {
      setFeedback({ tone: "error", text: outcome.error ?? "Invalid decimal length." });
      return;
    }
    setDraft("");
    if (outcome.hint !== undefined) {
      setFeedback({ tone: "ok", text: outcome.hint });
    }
    if (outcome.next !== value) {
      onChange(outcome.next);
      try {
        sessionStorage.setItem(STORAGE_KEY, String(outcome.next));
      } catch {
        // Session storage unavailable (private mode) - value still applies.
      }
    }
  };

  return (
    <Form id="formDecimalPoint" onSubmit={submit} noValidate>
      <Form.Group controlId={inputId}>
        <Form.Label className="mb-1">
          <small>
            <b>Change Decimal Length (default is 2 decimal places)</b>
          </small>
        </Form.Label>
        <InputGroup size="sm">
          <InputGroup.Text data-testid="decimal-length-badge" title="Applied decimal length">
            <b>{value}</b>
          </InputGroup.Text>
          <Form.Control
            type="number"
            inputMode="numeric"
            min={0}
            max={MAX_DECIMAL_PLACES}
            step={1}
            placeholder="Decimal place"
            aria-label="Decimal place length"
            value={draft}
            isInvalid={feedback?.tone === "error"}
            onChange={(event) => setDraft(event.target.value)}
          />
          <Button variant="info" type="submit" id="changeDecimalPointBTN">
            Change...
          </Button>
        </InputGroup>
        <Form.Text
          muted
          className={feedback?.tone === "error" ? "text-danger fw-bold" : undefined}
          role={feedback?.tone === "error" ? "alert" : undefined}
          data-testid="decimal-length-feedback"
        >
          {feedback === null
            ? "Whole numbers 0 and above; applies to decimal inputs only."
            : feedback.text}
        </Form.Text>
      </Form.Group>
    </Form>
  );
}
