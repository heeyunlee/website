"use client";

import { useState } from "react";
import {
  getPrevious,
  isRecentLocaleSwitch,
  register,
} from "@/components/locale-transition";
import {
  prefersReducedMotion,
  useIsomorphicLayoutEffect,
} from "@/components/motion";

const CHAR_STAGGER_MS = 25;
const MAX_STAGGER_MS = 400;
const ROLL_DURATION_MS = 350;

type AnimatedTextProps = {
  /** Stable identity across locales; required for mode="roll". */
  id?: string;
  text: string;
  /** "roll": per-character odometer (short strings). "fade": whole-string fade-in (long text). */
  mode?: "roll" | "fade";
  className?: string;
};

/**
 * Animates its text after a language switch. Server HTML and cold loads
 * render plain text; the effect only plays right after the toggle is
 * clicked (see locale-transition.ts). Respects prefers-reduced-motion.
 */
export function AnimatedText({
  id,
  text,
  mode = "roll",
  className = "",
}: AnimatedTextProps) {
  const [fromText, setFromText] = useState<string | null>(null);
  const [entered, setEntered] = useState(false);
  const [fadeHidden, setFadeHidden] = useState(false);

  useIsomorphicLayoutEffect(() => {
    const previous = id ? getPrevious(id) : undefined;
    if (id) register(id, text);
    if (!isRecentLocaleSwitch() || prefersReducedMotion()) return;

    if (mode === "fade") {
      // Hide pre-paint, then release a frame later so the transition runs.
      setFadeHidden(true);
      let raf2 = 0;
      const raf = requestAnimationFrame(() => {
        raf2 = requestAnimationFrame(() => setFadeHidden(false));
      });
      return () => {
        cancelAnimationFrame(raf);
        cancelAnimationFrame(raf2);
      };
    }

    if (!previous || previous === text) return;
    setFromText(previous);
    let raf2 = 0;
    const raf = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => setEntered(true));
    });
    const total =
      Math.min(text.length * CHAR_STAGGER_MS, MAX_STAGGER_MS) +
      ROLL_DURATION_MS +
      100;
    const timer = setTimeout(() => setFromText(null), total);
    return () => {
      cancelAnimationFrame(raf);
      cancelAnimationFrame(raf2);
      clearTimeout(timer);
    };
    // Mount-only: a mounted instance never changes locale in place.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (mode === "fade") {
    return (
      <span
        className={`inline-block transition-all duration-500 ease-out ${
          fadeHidden ? "translate-y-1 opacity-0" : "translate-y-0 opacity-100"
        } ${className}`}
      >
        {text}
      </span>
    );
  }

  if (fromText === null) {
    return <span className={className}>{text}</span>;
  }

  const fromChars = Array.from(fromText);
  const toChars = Array.from(text);
  const count = Math.max(fromChars.length, toChars.length);
  const cells: React.ReactNode[] = [];

  for (let i = 0; i < count; i++) {
    const from = fromChars[i] ?? "";
    const to = toChars[i] ?? "";

    // Real spaces in the target string stay text nodes so lines can wrap.
    if (to === " " && (from === " " || from === "")) {
      cells.push(" ");
      continue;
    }

    const timing = {
      transitionDuration: `${ROLL_DURATION_MS}ms`,
      transitionDelay: `${Math.min(i * CHAR_STAGGER_MS, MAX_STAGGER_MS)}ms`,
    };
    cells.push(
      <span key={i} className="inline-grid overflow-hidden align-bottom">
        <span
          className="col-start-1 row-start-1 transition-transform ease-out-expo"
          style={{
            ...timing,
            transform: entered ? "translateY(-110%)" : "translateY(0)",
          }}
        >
          {from === " " || from === "" ? " " : from}
        </span>
        <span
          className="col-start-1 row-start-1 transition-transform ease-out-expo"
          style={{
            ...timing,
            transform: entered ? "translateY(0)" : "translateY(110%)",
          }}
        >
          {to === " " || to === "" ? " " : to}
        </span>
      </span>
    );
  }

  return (
    <span className={className} aria-label={text}>
      <span aria-hidden="true">{cells}</span>
    </span>
  );
}
