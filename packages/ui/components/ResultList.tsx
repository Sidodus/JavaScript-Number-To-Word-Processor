"use client";

import { ListGroup } from "react-bootstrap";

import type { ConsoleState } from "./NumberToWordConsole";
import ResultCard from "./ResultCard";

/** Renders the last conversion result(s). */
export default function ResultList({ state }: { state: ConsoleState }) {
  const description = state.isFromArray
    ? "This is an array of number(s) converted to words using JSnumberToWordProcessor"
    : "This is a number converted to words using JSnumberToWordProcessor";

  return (
    <>
      <p className="text-center text-muted">{description}</p>
      <ListGroup variant="flush" data-testid="result-list">
        {state.results.map((result, index) => (
          <ResultCard
            key={`${result.displayNum}-${index}`}
            result={result}
            isFromArray={state.isFromArray}
          />
        ))}
      </ListGroup>
    </>
  );
}
