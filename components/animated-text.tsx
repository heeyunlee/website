"use client";

import { useRef, useState } from "react";
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
const EASE_OUT_EXPO = "cubic-bezier(0.16, 1, 0.3, 1)";

function rollTotalMs(text: string): number {
  return (
    Math.min(Array.from(text).length * CHAR_STAGGER_MS, MAX_STAGGER_MS) +
    ROLL_DURATION_MS
  );
}

type AnimatedTextProps = {
  /** Stable identity across locales; required for mode="roll". */
  id?: string;
  text: string;
  /** "roll": per-character odometer (short, single-line strings). "fade": whole-string fade-in (long text). */
  mode?: "roll" | "fade";
  className?: string;
};

/**
 * Animates its text after a language switch. Server HTML and cold loads
 * render plain text; the effect only plays right after the toggle is
 * clicked (see locale-transition.ts). Respects prefers-reduced-motion.
 *
 * Roll mode measures the old and new strings and animates the container
 * width between them alongside the character wave, so buttons and pills
 * resize smoothly instead of snapping when the animation settles.
 */
export function AnimatedText({
  id,
  text,
  mode = "roll",
  className = "",
}: AnimatedTextProps) {
  const [fromText, setFromText] = useState<string | null>(null);
  const [entered, setEntered] = useState(false);
  const [widths, setWidths] = useState<{ from: number; to: number } | null>(
    null
  );
  const [fadeHidden, setFadeHidden] = useState(false);
  const fromMeasureRef = useRef<HTMLSpanElement>(null);
  const toMeasureRef = useRef<HTMLSpanElement>(null);

  // On mount: decide whether to animate. Mount-only by design — a mounted
  // instance never changes locale in place (locale switches remount).
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Once the roll markup is in the DOM (pre-paint): lock the container to
  // the old text's measured width, then release a frame later so both the
  // character wave and the width transition run together.
  useIsomorphicLayoutEffect(() => {
    if (fromText === null) return;

    const fromWidth = fromMeasureRef.current?.offsetWidth ?? 0;
    const toWidth = toMeasureRef.current?.offsetWidth ?? 0;
    // Always lock when measurable: the per-cell stacks can be wider than
    // either string, so even equal widths need an explicit container size.
    if (fromWidth > 0 && toWidth > 0) {
      setWidths({ from: fromWidth, to: toWidth });
    }

    let raf2 = 0;
    const raf = requestAnimationFrame(() => {
      raf2 = requestAnimationFrame(() => setEntered(true));
    });
    const timer = setTimeout(
      () => {
        setFromText(null);
        setEntered(false);
        setWidths(null);
      },
      rollTotalMs(text) + 100
    );
    return () => {
      cancelAnimationFrame(raf);
      cancelAnimationFrame(raf2);
      clearTimeout(timer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fromText]);

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

    // Spaces shared by both strings stay plain text nodes.
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
    <span className={`relative ${className}`} aria-label={text}>
      <span
        aria-hidden="true"
        className="inline-block overflow-hidden whitespace-nowrap align-bottom"
        style={
          widths
            ? {
                width: entered ? widths.to : widths.from,
                transitionProperty: "width",
                transitionDuration: `${rollTotalMs(text)}ms`,
                transitionTimingFunction: EASE_OUT_EXPO,
              }
            : undefined
        }
      >
        {cells}
      </span>
      {/* Invisible measurers inherit the surrounding font styles. */}
      <span
        ref={fromMeasureRef}
        aria-hidden="true"
        className="invisible absolute left-0 top-0 whitespace-pre"
      >
        {fromText}
      </span>
      <span
        ref={toMeasureRef}
        aria-hidden="true"
        className="invisible absolute left-0 top-0 whitespace-pre"
      >
        {text}
      </span>
    </span>
  );
}
