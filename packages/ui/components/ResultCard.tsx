"use client";

import { useState } from "react";
import { Button, Card, ListGroup } from "react-bootstrap";

import type { ProcessedNumber } from "js-number-to-word-processor";

/**
 * Renders one processed result with the library's visual identity:
 * red negative sign, tomato "(dot)", gray ordinal unit - carried over from v3.
 * v4.1 adds copy-to-clipboard; in currency mode the displayWord (which already
 * contains the currency labels) is rendered as one sentence.
 */
export default function ResultCard({
  result,
  isFromArray,
}: {
  result: ProcessedNumber;
  isFromArray: boolean;
}) {
  const [copied, setCopied] = useState(false);

  const numberPart = (
    <span className="n2w-number">
      {result.negativeInt ? <span className="n2w-negative-sign">-</span> : null}
      {result.displayWholeNum}
      {result.decimalPoint ? (
        <small>
          <b>{result.displayDecimalNum}</b>
        </small>
      ) : null}
    </span>
  );

  const wordPart =
    result.currency !== null ? (
      <>{result.displayWord}</>
    ) : (
      <>
        {result.negativeInt ? <span className="n2w-negative-word">(negative) </span> : null}
        {result.displayWholeWord}
        {result.decimalPoint ? (
          <>
            <span className="n2w-dot"> (dot) </span>
            {result.displayDecimalWord}
            <span className="n2w-unit"> {result.decimalPlaceWord}</span>
          </>
        ) : null}
      </>
    );

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(`${result.displayNum} — ${result.displayWord}`);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard unavailable (permissions/insecure context) - silent no-op.
    }
  };

  return (
    <ListGroup.Item className="border-0 px-0 pb-2">
      <Card className="n2w-card">
        <Card.Body data-testid="result-item">
          <Card.Text as="span" className="n2w-result-word d-block">
            {numberPart} <span className="n2w-arrow">:-</span> {wordPart}.
          </Card.Text>
          <div className="d-flex justify-content-between align-items-center mt-2">
            {isFromArray ? (
              <Card.Text as="small" className="text-muted mb-0">
                Processed as part of an array of numbers.
              </Card.Text>
            ) : (
              <span />
            )}
            <Button
              size="sm"
              variant="outline-secondary"
              onClick={copy}
              aria-label="Copy result to clipboard"
              data-testid="copy-button"
            >
              <i className={copied ? "bi bi-clipboard-check" : "bi bi-clipboard"} />{" "}
              <small>{copied ? "Copied!" : "Copy"}</small>
            </Button>
          </div>
        </Card.Body>
      </Card>
    </ListGroup.Item>
  );
}
