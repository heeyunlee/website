"use client";

import { useEffect, useState } from "react";
import { prefersReducedMotion } from "@/components/motion";

type RotatingTaglineProps = {
  prefix: string;
  words: readonly string[];
  /** Verb-last languages (Korean) put the verb after the rotating word. */
  suffix?: string;
};

/**
 * "I build ___" with a cycling word. All words are stacked in an inline grid
 * so the line width never changes; the first word renders deterministically
 * for SSR and rotation starts after hydration.
 */
export function RotatingTagline({
  prefix,
  words,
  suffix,
}: RotatingTaglineProps) {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (words.length < 2 || prefersReducedMotion()) return;
    const id = setInterval(
      () => setIndex((current) => (current + 1) % words.length),
      2600
    );
    return () => clearInterval(id);
  }, [words.length]);

  return (
    <span>
      {prefix}{" "}
      <span className="inline-grid overflow-hidden align-bottom text-emerald-400">
        {words.map((word, i) => (
          <span
            key={word}
            aria-hidden={i !== index}
            className={`col-start-1 row-start-1 whitespace-nowrap transition-all duration-500 ease-out ${
              i === index
                ? "translate-y-0 opacity-100"
                : "translate-y-4 opacity-0"
            }`}
          >
            {word}
          </span>
        ))}
      </span>
      {suffix ? <> {suffix}</> : null}
    </span>
  );
}
