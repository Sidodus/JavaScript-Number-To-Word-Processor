"use client";

import { Card, ListGroup } from "react-bootstrap";

import type { ProcessedNumber } from "js-number-to-word-processor";

/**
 * Renders one processed result with the library's visual identity:
 * red negative sign, tomato "(dot)", gray ordinal unit - carried over from v3.
 * In v4 the display never contains a "SORRY" sentence; oversized inputs throw
 * and the console surfaces the error in an Alert instead.
 */
export default function ResultCard({
  result,
  isFromArray,
}: {
  result: ProcessedNumber;
  isFromArray: boolean;
}) {
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

  return (
    <ListGroup.Item className="border-0 px-0 pb-2">
      <Card className="n2w-card">
        <Card.Body data-testid="result-item">
          <Card.Text as="span" className="n2w-result-word d-block">
            {numberPart} <span className="n2w-arrow">:-</span>{" "}
            {result.negativeInt ? <span className="n2w-negative-word">(negative) </span> : null}
            {result.displayWholeWord}
            {result.decimalPoint ? (
              <>
                <span className="n2w-dot"> (dot) </span>
                {result.displayDecimalWord}
                <span className="n2w-unit"> {result.decimalPlaceWord}</span>
              </>
            ) : null}
            .
          </Card.Text>
          {isFromArray ? (
            <Card.Text as="small" className="text-muted">
              Processed as part of an array of numbers.
            </Card.Text>
          ) : null}
        </Card.Body>
      </Card>
    </ListGroup.Item>
  );
}
