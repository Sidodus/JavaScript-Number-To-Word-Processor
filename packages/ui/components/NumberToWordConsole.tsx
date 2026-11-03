"use client";

import { useEffect, useState } from "react";
import { Alert, Col, Container, Row } from "react-bootstrap";

import type { ProcessedNumber } from "js-number-to-word-processor";

import DecimalLengthControl from "./DecimalLengthControl";
import NumberForms from "./NumberForms";
import ResultList from "./ResultList";

export interface ConsoleState {
  results: ProcessedNumber[];
  isFromArray: boolean;
  processedInput: string;
}

const RESULTS_STORAGE_KEY = "display2Document";
const IS_ARRAY_STORAGE_KEY = "arrOfNum";

/**
 * Top-level client console: owns the decimal length, the last conversion
 * result and its session persistence (v3 parity).
 */
export default function NumberToWordConsole() {
  const [decimalPlaces, setDecimalPlaces] = useState(2);
  const [state, setState] = useState<ConsoleState | null>(null);

  // Restore the previous session on the client only (avoids hydration drift).
  useEffect(() => {
    try {
      const storedLength = sessionStorage.getItem("decimalPlaceLength");
      if (storedLength !== null && /^\d+$/.test(storedLength)) {
        setDecimalPlaces(Number(storedLength));
      }
      const storedResults = sessionStorage.getItem(RESULTS_STORAGE_KEY);
      const storedIsArray = sessionStorage.getItem(IS_ARRAY_STORAGE_KEY);
      if (storedResults !== null) {
        const parsed: unknown = JSON.parse(storedResults);
        if (Array.isArray(parsed)) {
          setState({
            results: parsed as ProcessedNumber[],
            isFromArray: storedIsArray === "true",
            processedInput: "",
          });
        }
      }
    } catch {
      // Corrupt or unavailable session storage - start clean.
    }
  }, []);

  const handleProcessed = (next: ConsoleState) => {
    setState(next);
    try {
      sessionStorage.setItem(RESULTS_STORAGE_KEY, JSON.stringify(next.results));
      sessionStorage.setItem(IS_ARRAY_STORAGE_KEY, String(next.isFromArray));
    } catch {
      // Persistence is best-effort.
    }
  };

  return (
    <Container fluid className="bg-light pb-5">
      <Container className="pt-3">
        <header className="n2w-hero rounded-3 shadow-sm p-4 mb-4">
          <h1 className="h4 fst-italic">
            JS Number To Word Processor <small>v4.0.0</small>
          </h1>
          <p className="mb-2">
            A JavaScript library that processes standard dictionary numbers up to{" "}
            <span className="n2w-limit">
              10<sup>33003</sup>
            </span>{" "}
            into human readable numbers &amp; words, based on the{" "}
            <a
              href="https://www.mrob.com/pub/math/largenum.html"
              target="_blank"
              rel="noreferrer"
              className="text-info fst-italic"
            >
              Conway-Wechsler Numbering System
            </a>
            .
          </p>
          <Row className="justify-content-center">
            <Col xs={12} md={8} lg={6}>
              <DecimalLengthControl value={decimalPlaces} onChange={setDecimalPlaces} />
            </Col>
          </Row>
        </header>

        <NumberForms
          decimalPlaces={decimalPlaces}
          onProcessed={handleProcessed}
        />

        {state !== null ? (
          <section className="mt-4">
            <ResultList state={state} />
          </section>
        ) : (
          <Alert variant="light" className="text-center text-muted mt-4">
            Enter a number above to see its well formatted, human readable words.
          </Alert>
        )}

        <footer className="text-center text-muted small mt-5 pt-3 border-top">
          <p className="mb-1">
            Install from{" "}
            <a
              href="https://www.npmjs.com/package/js-number-to-word-processor"
              target="_blank"
              rel="noreferrer"
            >
              NPM
            </a>{" "}
            &middot; Source on{" "}
            <a
              href="https://github.com/Sidodus/JavaScript-Number-To-Word-Processor"
              target="_blank"
              rel="noreferrer"
            >
              GitHub
            </a>
          </p>
          <p className="mb-0">
            Copyright (c) 2019-{new Date().getFullYear()}{" "}
            <a
              href="https://www.linkedin.com/in/saheed-odulaja-75111337"
              target="_blank"
              rel="noreferrer"
            >
              Saheed Odulaja
            </a>
          </p>
        </footer>
      </Container>
    </Container>
  );
}
