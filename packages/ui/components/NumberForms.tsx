"use client";

import { useState } from "react";
import { Alert, Button, Col, Form, Row } from "react-bootstrap";

import JSnumberToWordProcessor from "js-number-to-word-processor";

import type { ConsoleState } from "./NumberToWordConsole";

export interface NumberFormsProps {
  decimalPlaces: number;
  onProcessed: (state: ConsoleState) => void;
}

/**
 * Input forms for a single number and a comma/newline separated array.
 * Both inputs are plain text fields (v3's `type="number"` mangled long
 * numbers and blocked scientific notation), processed strictly: invalid
 * input raises a visible error instead of being silently dropped.
 */
export default function NumberForms({ decimalPlaces, onProcessed }: NumberFormsProps) {
  const [singleValue, setSingleValue] = useState("");
  const [arrayValue, setArrayValue] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const runSingle = (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setNotice(null);
    if (singleValue.trim().length === 0) {
      setError("Enter a number first, e.g. 9, -98, 98.7, -98.765 or 1e21.");
      return;
    }
    try {
      const results = JSnumberToWordProcessor(singleValue.trim(), decimalPlaces);
      onProcessed({ results, isFromArray: false, processedInput: singleValue.trim() });
      setSingleValue("");
      setArrayValue("");
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : String(caught));
    }
  };

  const runArray = (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    setNotice(null);
    if (arrayValue.trim().length === 0) {
      setError("Enter numbers separated by commas or new lines first.");
      return;
    }
    const entries = arrayValue
      .split(/[,\n]/)
      .map((entry) => entry.trim())
      .filter((entry) => entry.length > 0);
    if (entries.length === 0) {
      setError("No numbers found - enter values separated by commas or new lines.");
      return;
    }
    try {
      const results = JSnumberToWordProcessor(entries, { decimalPlaces });
      onProcessed({ results, isFromArray: true, processedInput: arrayValue.trim() });
      setSingleValue("");
      setArrayValue("");
      setNotice(`${results.length} of ${entries.length} entries processed.`);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : String(caught));
    }
  };

  return (
    <Row className="g-4">
      <Col md={6}>
        {/* Flex columns + h-100 keep both textareas equal-height so the two
            process buttons align side-by-side regardless of hint wrapping. */}
        <Form onSubmit={runSingle} noValidate className="d-flex flex-column h-100">
          <Form.Group
            controlId="num-input"
            className="d-flex flex-column flex-grow-1"
          >
            <Form.Label className="fw-bold fst-italic">Input A Number</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              className="n2w-input-monospace flex-grow-1"
              placeholder="Enter a number e.g. 9, -98, 98.7, -98.765, 1e21, 123456789012345678901234567890"
              value={singleValue}
              onChange={(event) => setSingleValue(event.target.value)}
            />
            <Form.Text muted>
              Strings stay exact - paste numbers of any size, up to 10^33003.
            </Form.Text>
          </Form.Group>
          <Button variant="info" type="submit" className="w-100 mt-2" id="num-button">
            Process A Number ✨
          </Button>
        </Form>
      </Col>

      <Col md={6}>
        <Form onSubmit={runArray} noValidate className="d-flex flex-column h-100">
          <Form.Group
            controlId="num-input-arr"
            className="d-flex flex-column flex-grow-1"
          >
            <Form.Label className="fw-bold fst-italic">Input An Array Of Numbers</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              className="n2w-input-monospace flex-grow-1"
              placeholder={"Numbers separated by commas or new lines e.g. 1, -12, 12.3, -12.345"}
              value={arrayValue}
              onChange={(event) => setArrayValue(event.target.value)}
            />
            <Form.Text muted>
              Invalid entries fail loudly (with their position) instead of being discarded.
            </Form.Text>
          </Form.Group>
          <Button variant="info" type="submit" className="w-100 mt-2" id="num-button-arr">
            Process An Array Of Numbers 💥
          </Button>
        </Form>
      </Col>

      <Col xs={12}>
        {error !== null ? (
          <Alert variant="danger" className="mb-0" role="alert" data-testid="form-error">
            {error}
          </Alert>
        ) : null}
        {notice !== null ? (
          <Alert variant="success" className="mb-0" data-testid="form-notice">
            {notice}
          </Alert>
        ) : null}
      </Col>
    </Row>
  );
}
