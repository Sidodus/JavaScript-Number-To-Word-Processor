"use client";

import { useState } from "react";
import { Button, Col, Dropdown, Form, Row } from "react-bootstrap";

import { getLocale, localeCodes } from "js-number-to-word-processor";
import type { CurrencyLabels } from "js-number-to-word-processor";

/** Currency presets exposed by the console (labels are free-form in the core API). */
export const CURRENCY_PRESETS: Record<string, CurrencyLabels> = {
  Naira: { major: "Naira", majorPlural: "Naira", minor: "Kobo", minorPlural: "Kobo" },
  Dollars: { major: "Dollars", minor: "Cents" },
  Euros: { major: "Euros", minor: "Cents" },
  Pounds: { major: "Pounds", minor: "Pence" },
  Yen: { major: "Yen", majorPlural: "Yen" },
};

export interface ConsoleOptions {
  locale: string;
  style: "british" | "american";
  output: "cardinal" | "ordinal";
  currency: CurrencyLabels | null;
}

const LOCALES = localeCodes();

export interface OptionsBarProps {
  options: ConsoleOptions;
  onChange: (next: ConsoleOptions) => void;
}

/**
 * Conversion option controls (v4.1): joining style, ordinal output, currency
 * mode with presets. Every control maps 1:1 onto a core ProcessOptions field.
 */
export default function OptionsBar({ options, onChange }: OptionsBarProps) {
  const [customMajor, setCustomMajor] = useState("");
  const [customMinor, setCustomMinor] = useState("");

  const set = (patch: Partial<ConsoleOptions>) => onChange({ ...options, ...patch });

  const applyPreset = (key: string) => {
    const preset = CURRENCY_PRESETS[key];
    if (preset !== undefined) {
      set({ currency: preset });
    }
  };

  const applyCustomCurrency = () => {
    if (customMajor.trim().length === 0) {
      return;
    }
    const labels: CurrencyLabels = { major: customMajor.trim() };
    if (customMinor.trim().length > 0) {
      labels.minor = customMinor.trim();
    }
    set({ currency: labels });
    setCustomMajor("");
    setCustomMinor("");
  };

  return (
    <Row className="g-3 align-items-end" data-testid="options-bar">
      <Col xs={12} sm={6} md={3}>
        <Form.Group controlId="locale-select">
          <Form.Label className="mb-1">
            <small>
              <b>Locale</b>
            </small>
          </Form.Label>
          <Form.Select
            size="sm"
            value={options.locale}
            onChange={(event) =>
              // Switching locales reconciles the word style to the new
              // locale's own default - otherwise a pinned "british" would be
              // rejected by locales without an "and" concept (fr/yo/ig).
              set({
                locale: event.target.value,
                style: getLocale(event.target.value).andStyle,
              })
            }
          >
            {LOCALES.map((code) => (
              <option key={code} value={code}>
                {code === "en" ? "English (en)" : code === "fr" ? "Français (fr)" : code === "ha" ? "Hausa (ha)" : code === "yo" ? "Yorùbá (yo)" : code === "ig" ? "Igbo (ig)" : code === "es" ? "Español (es)" : code}
              </option>
            ))}
          </Form.Select>
        </Form.Group>
      </Col>

      <Col xs={12} sm={6} md={3}>
        <Form.Group controlId="style-select">
          <Form.Label className="mb-1">
            <small>
              <b>Word Style</b>
            </small>
          </Form.Label>
          <Form.Select
            size="sm"
            value={options.style}
            disabled={!getLocale(options.locale).supportsBothStyles}
            title={
              getLocale(options.locale).supportsBothStyles
                ? undefined
                : "This locale has a fixed word style."
            }
            onChange={(event) => set({ style: event.target.value as ConsoleOptions["style"] })}
          >
            <option value="british">British (with &quot;and&quot;)</option>
            <option value="american">American (no &quot;and&quot;)</option>
          </Form.Select>
        </Form.Group>
      </Col>

      <Col xs={12} sm={6} md={3}>
        <Form.Group controlId="output-select">
          <Form.Label className="mb-1">
            <small>
              <b>Output</b>
            </small>
          </Form.Label>
          <Form.Select
            size="sm"
            value={options.output}
            onChange={(event) => set({ output: event.target.value as ConsoleOptions["output"] })}
          >
            <option value="cardinal">Cardinal (Twenty-Three)</option>
            <option value="ordinal">Ordinal (Twenty-Third)</option>
          </Form.Select>
        </Form.Group>
      </Col>

      <Col xs={12} md={6}>
        <Form.Group controlId="currency-select">
          <Form.Label className="mb-1">
            <small>
              <b>Currency Mode</b>{" "}
              <span className="text-muted">(money words instead of (dot) decimals)</span>
            </small>
          </Form.Label>
          <div className="d-flex flex-wrap gap-2 align-items-center">
            <Dropdown onSelect={(key) => typeof key === "string" && applyPreset(key)}>
              <Dropdown.Toggle size="sm" variant="outline-info" id="currency-preset-dropdown">
                {options.currency === null ? "Off" : `On: ${options.currency.major}`}
              </Dropdown.Toggle>
              <Dropdown.Menu>
                <Dropdown.Item eventKey="Naira">₦ Naira / Kobo</Dropdown.Item>
                <Dropdown.Item eventKey="Dollars">$ Dollars / Cents</Dropdown.Item>
                <Dropdown.Item eventKey="Euros">€ Euros / Cents</Dropdown.Item>
                <Dropdown.Item eventKey="Pounds">£ Pounds / Pence</Dropdown.Item>
                <Dropdown.Item eventKey="Yen">¥ Yen (no minor)</Dropdown.Item>
              </Dropdown.Menu>
            </Dropdown>

            <Form.Control
              size="sm"
              placeholder="Custom major (e.g. Cedis)"
              aria-label="Custom currency major label"
              style={{ maxWidth: 170 }}
              value={customMajor}
              onChange={(event) => setCustomMajor(event.target.value)}
            />
            <Form.Control
              size="sm"
              placeholder="Minor (e.g. Pesewas)"
              aria-label="Custom currency minor label"
              style={{ maxWidth: 150 }}
              value={customMinor}
              onChange={(event) => setCustomMinor(event.target.value)}
            />
            <Button size="sm" variant="outline-secondary" onClick={applyCustomCurrency}>
              Apply
            </Button>
            {options.currency !== null ? (
              <Button
                size="sm"
                variant="outline-danger"
                onClick={() => set({ currency: null })}
                aria-label="Turn currency mode off"
              >
                ×
              </Button>
            ) : null}
          </div>
        </Form.Group>
      </Col>
    </Row>
  );
}
