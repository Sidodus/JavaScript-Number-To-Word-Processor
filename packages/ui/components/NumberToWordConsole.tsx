"use client";

import { useCallback, useEffect, useState } from "react";
import { Alert, Button, Col, Container, Row } from "react-bootstrap";

import processor from "js-number-to-word-processor";
import type { ProcessedNumber } from "js-number-to-word-processor";

import DecimalLengthControl from "./DecimalLengthControl";
import NumberForms from "./NumberForms";
import OptionsBar, { type ConsoleOptions } from "./OptionsBar";
import ResultList from "./ResultList";

export interface ConsoleState {
  results: ProcessedNumber[];
  isFromArray: boolean;
  processedInput: string;
}

const RESULTS_STORAGE_KEY = "display2Document";
const IS_ARRAY_STORAGE_KEY = "arrOfNum";
const THEME_STORAGE_KEY = "n2w-theme";

/** Reads shareable URL parameters (?n=&dp=&style=&output=&currency=). */
function readUrlOptions(): { number: string | null; options: Partial<ConsoleOptions> & { decimalPlaces?: number } } {
  if (typeof window === "undefined") {
    return { number: null, options: {} };
  }
  const params = new URLSearchParams(window.location.search);
  const style = params.get("style");
  const output = params.get("output");
  const locale = params.get("locale");
  const dp = params.get("dp");
  return {
    number: params.get("n"),
    options: {
      ...(locale !== null && /^[a-z]{2,8}$/.test(locale) ? { locale } : {}),
      ...(style === "american" || style === "british" ? { style } : {}),
      ...(output === "ordinal" || output === "cardinal" ? { output } : {}),
      ...(dp !== null && /^\d+$/.test(dp) ? { decimalPlaces: Number(dp) } : {}),
    },
  };
}

/**
 * Top-level client console: owns the decimal length, the v4.1 conversion
 * options (style/output/currency), dark mode, the last conversion result and
 * its session persistence (v3 parity).
 */
export default function NumberToWordConsole() {
  const [decimalPlaces, setDecimalPlaces] = useState(2);
  const [options, setOptions] = useState<ConsoleOptions>({
    locale: "en",
    style: "british",
    output: "cardinal",
    currency: null,
  });
  const [state, setState] = useState<ConsoleState | null>(null);
  const [theme, setTheme] = useState<"light" | "dark">("light");

  const persistState = useCallback((next: ConsoleState) => {
    try {
      sessionStorage.setItem(RESULTS_STORAGE_KEY, JSON.stringify(next.results));
      sessionStorage.setItem(IS_ARRAY_STORAGE_KEY, String(next.isFromArray));
    } catch {
      // Persistence is best-effort.
    }
  }, []);

  // Restore session + theme + shared URL state on the client only.
  useEffect(() => {
    try {
      const storedTheme = localStorage.getItem(THEME_STORAGE_KEY);
      if (storedTheme === "dark" || storedTheme === "light") {
        setTheme(storedTheme);
      }
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
      // Corrupt or unavailable storage - start clean.
    }

    const { number, options: urlOptions } = readUrlOptions();
    if (urlOptions.style !== undefined || urlOptions.output !== undefined || urlOptions.decimalPlaces !== undefined) {
      setOptions((current) => ({ ...current, ...urlOptions }));
      if (urlOptions.decimalPlaces !== undefined) {
        setDecimalPlaces(urlOptions.decimalPlaces);
      }
    }
    if (number !== null && number.trim().length > 0) {
      // Shared link: run the conversion once through the normal pipeline.
      try {
        const results = processor(number.trim(), {
          decimalPlaces: urlOptions.decimalPlaces ?? 2,
          style: urlOptions.style ?? "british",
          output: urlOptions.output ?? "cardinal",
        });
        const next: ConsoleState = { results, isFromArray: false, processedInput: number };
        setState(next);
        persistState(next);
      } catch {
        // Invalid shared number - the user can simply re-enter one.
      }
    }
  }, []);

  // Apply the theme to Bootstrap 5.3's native color modes.
  useEffect(() => {
    document.documentElement.setAttribute("data-bs-theme", theme);
    try {
      localStorage.setItem(THEME_STORAGE_KEY, theme);
    } catch {
      // Storage unavailable - theme still applies for this visit.
    }
  }, [theme]);

  // Keep the URL shareable after every conversion or option change.
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    const params = new URLSearchParams(window.location.search);
    const n = state?.processedInput;
    if (n !== undefined && n.length > 0) {
      params.set("n", n);
    } else {
      params.delete("n");
    }
    const sync = (key: string, value: string | null, fallback: string) => {
      if (value === null || value === fallback) {
        params.delete(key);
      } else {
        params.set(key, value);
      }
    };
    sync("dp", String(decimalPlaces), "2");
    sync("locale", options.locale, "en");
    sync("style", options.style, "british");
    sync("output", options.output, "cardinal");
    const query = params.toString();
    const nextUrl = `${window.location.pathname}${query.length > 0 ? `?${query}` : ""}`;
    window.history.replaceState(null, "", nextUrl);
  }, [state, decimalPlaces, options]);

  const handleProcessed = (next: ConsoleState) => {
    setState(next);
    persistState(next);
  };

  const toggleTheme = () => setTheme(theme === "dark" ? "light" : "dark");

  return (
    <Container fluid className="pb-5">
      <Container className="pt-3">
        <header className="n2w-hero rounded-3 shadow-sm p-4 mb-4">
          <div className="d-flex justify-content-end mb-2">
            <Button
              size="sm"
              variant="outline-secondary"
              onClick={toggleTheme}
              aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
              data-testid="theme-toggle"
            >
              <i className={theme === "dark" ? "bi bi-sun" : "bi bi-moon-stars"} />
            </Button>
          </div>
          <h1 className="h4 fst-italic">
            JS Number To Word Processor <small>v4.1.0</small>
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

        <OptionsBar options={options} onChange={setOptions} />

        <div className="mt-4">
          <NumberForms decimalPlaces={decimalPlaces} options={options} onProcessed={handleProcessed} />
        </div>

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
