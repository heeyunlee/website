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
  const cellsRef = useRef<HTMLSpanElement>(null);

  // The string this instance last displayed. Locale switches are soft
  // navigations that change `text` in place rather than remounting, so this
  // ref — not mount order — is what tells us the text actually changed.
  const lastTextRef = useRef(text);

  // Runs on mount and whenever `text` changes. The previous string comes from
  // this instance's own last render (the common case: prop changed in place)
  // or, for an instance that did remount, from the registry — where the
  // outgoing instance left it. Either way we only animate right after a toggle.
  useIsomorphicLayoutEffect(() => {
    const previous =
      lastTextRef.current !== text
        ? lastTextRef.current
        : id
          ? getPrevious(id)
          : undefined;
    lastTextRef.current = text;
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
  }, [text]);

  // Once the roll markup is in the DOM (pre-paint): lock the container to
  // the old text's measured width, then release a frame later so both the
  // character wave and the width transition run together.
  useIsomorphicLayoutEffect(() => {
    if (fromText === null) return;

    // Measure both widths from per-character inline-block layout (the same
    // structure the animation uses). Plain-text measurement would under-
    // report because splitting a word into separate inline-blocks drops the
    // kerning between letters — which is what briefly clipped the last glyph.
    const fromWidth =
      fromMeasureRef.current?.getBoundingClientRect().width ?? 0;
    const toWidth = cellsRef.current?.getBoundingClientRect().width ?? 0;
    if (fromWidth > 0 && toWidth > 0) {
      // Round up so sub-pixel rounding in the clipper never trims a glyph.
      setWidths({ from: Math.ceil(fromWidth), to: Math.ceil(toWidth) });
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
      <span
        key={i}
        className="relative inline-block overflow-hidden align-bottom"
      >
        {/* The outgoing glyph overlays without affecting layout; if it is
            wider than the incoming one it gets clipped while rolling out. */}
        <span
          className="absolute inset-y-0 left-0 inline-block transition-transform ease-out-expo"
          style={{
            ...timing,
            transform: entered ? "translateY(-110%)" : "translateY(0)",
          }}
        >
          {from === " " || from === "" ? " " : from}
        </span>
        {/* The incoming glyph sits in normal flow, so the cell takes its
            natural width and the word is spaced correctly from the first
            frame — no snap when the animation settles into plain text. */}
        <span
          className="inline-block transition-transform ease-out-expo"
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
      {/* Clipper: animates width old → new, hiding the rolling glyphs. */}
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
        {/* Content stays at its natural width so the clipper can be measured
            against it; this is the element the "to" width is read from. */}
        <span ref={cellsRef} className="inline-block whitespace-nowrap">
          {cells}
        </span>
      </span>
      {/* Measurer for the outgoing string, built from the same per-character
          inline-block layout as the cells so its width matches exactly. */}
      <span
        ref={fromMeasureRef}
        aria-hidden="true"
        className="invisible absolute left-0 top-0 whitespace-nowrap"
      >
        {fromChars.map((char, i) =>
          char === " " ? (
            " "
          ) : (
            <span key={i} className="inline-block">
              {char}
            </span>
          )
        )}
      </span>
    </span>
  );
}
