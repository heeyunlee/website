"use client";

import { Cormorant_Garamond } from "next/font/google";
import Image from "next/image";
import Link from "next/link";
import { type ReactNode, useEffect, useRef, useState } from "react";
import { AnimatedText } from "@/components/animated-text";
import { navItems } from "@/components/nav-items";
import { drawGiltFrame } from "@/lib/etretat/gilt-frame";
import { createPaintEngine, type PaintEngine } from "@/lib/etretat/engine";
import { useContent } from "@/lib/i18n/locale-context";

const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500"],
  style: ["normal", "italic"],
  display: "swap",
});

// The Photo, the Painting and the stroke-direction map share one frame;
// scripts/etretat/build_assets.py makes all three.
const ASSETS = {
  photo: "/etretat/photo.webp",
  painting: "/etretat/painting.webp",
  flow: "/etretat/flow.png",
};
const ASPECT = 2560 / 1888;
const SUN = { u: 0.72, v: 0.4685 };
const PHOTO_YEAR = 2026;
const PAINTING_YEAR = 1883;

// Painting needs a hovering pointer and a landscape window; everyone else
// gets the still version.
const CAN_PAINT =
  "(hover: hover) and (pointer: fine) and (orientation: landscape) and (min-width: 900px)";

type Mode = "pending" | "paint" | "still";

/**
 * The Canvas keeps the Painting's own proportions and hangs in a Frame on
 * the Wall. Its width is whichever is smaller: what the window's width
 * allows (leaving room for the Frame, and for the wall label beside it on
 * wide windows) or what its height allows.
 */
const CANVAS_WIDTH =
  "[--cw:min(calc(100vw_-_6.5rem),calc((100dvh_-_25rem)_*_1.356))] lg:[--cw:min(calc(100vw_-_44rem),calc((100dvh_-_21rem)_*_1.356))]";

// ---- The Wall and the Frame ----

/** Fine plaster grain, tiled over the Wall. */
const GRAIN = `url("data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='220' height='220'><filter id='n'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 0.5  0 0 0 0 0.5  0 0 0 0 0.5  0 0 0 0.55 0'/></filter><rect width='100%' height='100%' filter='url(%23n)'/></svg>")`;

/** The shadow a frame throws on the Wall under a light from above. */
const CAST_SHADOW =
  "shadow-[0_2px_3px_rgb(34_38_18/0.35),0_18px_26px_-10px_rgb(34_38_18/0.5),0_50px_60px_-28px_rgb(34_38_18/0.45)]";

function thickness(share: number) {
  return `calc(var(--cw) * ${share})`;
}

/**
 * The Frame around the Canvas: carved gilt, drawn by the gilt-frame shader and
 * redrawn whenever its size changes.
 */
function Frame({ children }: { children: ReactNode }) {
  const ref = useRef<HTMLCanvasElement>(null);
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const draw = () => {
      const rect = canvas.getBoundingClientRect();
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = Math.round(rect.width * dpr);
      canvas.height = Math.round(rect.height * dpr);
      const pad = parseFloat(
        getComputedStyle(canvas.parentElement!).paddingLeft
      );
      drawGiltFrame(canvas, pad * dpr);
    };
    const observer = new ResizeObserver(draw);
    observer.observe(canvas);
    return () => observer.disconnect();
  }, []);
  return (
    <div
      className={`relative ${CAST_SHADOW}`}
      style={{ padding: thickness(0.075) }}
    >
      {children}
      <canvas
        ref={ref}
        aria-hidden
        className="pointer-events-none absolute inset-0 h-full w-full"
      />
    </div>
  );
}

export function EtretatView() {
  const { site, ui } = useContent();
  const t = ui.etretat;

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const brushRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<PaintEngine | null>(null);
  const [mode, setMode] = useState<Mode>("pending");
  const [lost, setLost] = useState(false);
  const [ready, setReady] = useState(false);
  const [painted, setPainted] = useState(0);
  const [byVisitor, setByVisitor] = useState(false);

  // Decide between painting and the still version, and re-decide when the
  // window is rotated or resized across the line.
  useEffect(() => {
    const capable = window.matchMedia(CAN_PAINT);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const decide = () =>
      setMode(!lost && capable.matches && !reduced.matches ? "paint" : "still");
    decide();
    capable.addEventListener("change", decide);
    reduced.addEventListener("change", decide);
    return () => {
      capable.removeEventListener("change", decide);
      reduced.removeEventListener("change", decide);
    };
  }, [lost]);

  useEffect(() => {
    if (mode !== "paint" || !canvasRef.current) return;
    const engine = createPaintEngine(canvasRef.current, {
      assets: ASSETS,
      aspect: ASPECT,
      sun: SUN,
      brushEl: brushRef.current,
      onReady: () => setReady(true),
      onProgress: (fraction, visitor) => {
        setPainted(fraction);
        setByVisitor(visitor);
      },
      onLost: () => setLost(true),
    });
    if (!engine) {
      setLost(true);
      return;
    }
    engineRef.current = engine;
    return () => {
      engine.destroy();
      engineRef.current = null;
      setReady(false);
      setPainted(0);
      setByVisitor(false);
    };
  }, [mode]);

  // The Wall owns the viewport; the page behind it must not scroll.
  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  const painting = mode === "paint";
  const percent = Math.round(painted * 100);
  const complete = painted >= 0.995;
  const shareText = t.paintedShare.replace("{percent}", String(percent));

  return (
    <div className="fixed inset-0 z-50 flex select-none flex-col overflow-hidden bg-[#b3b798] text-[#22271b]">
      {/* The Wall: painted plaster, lit from the ceiling by a picture light
          that pools around the Frame and falls off towards the corners. */}
      <div
        aria-hidden
        className="absolute inset-0 bg-[radial-gradient(62%_58%_at_50%_44%,rgb(238_240_216/0.5)_0%,rgb(238_240_216/0.2)_45%,transparent_75%),linear-gradient(to_bottom,rgb(38_44_22/0)_0%,rgb(38_44_22/0.06)_60%,rgb(38_44_22/0.22)_100%)]"
      />
      <div
        aria-hidden
        className="absolute inset-0 opacity-[0.28] mix-blend-soft-light"
        style={{ backgroundImage: GRAIN }}
      />

      <header className="relative flex items-start justify-between px-8 pt-7 sm:px-10 sm:pt-8">
        <div>
          <h1
            className={`${serif.className} text-[2rem] leading-none tracking-[-0.01em]`}
          >
            {site.name}
          </h1>
          <p className="mt-2 text-[0.6875rem] uppercase tracking-[0.18em] opacity-60">
            <AnimatedText text={site.role} />
          </p>
        </div>
        <nav
          aria-label={ui.nav.primaryAria}
          className="flex gap-6 pt-1 text-[0.8125rem]"
        >
          {navItems
            .filter((item) => item.key !== "home")
            .map((item) => (
              <Link
                key={item.key}
                href={item.path}
                className="underline-offset-4 opacity-70 transition-opacity hover:underline hover:opacity-100"
              >
                <AnimatedText text={ui.nav[item.key]} />
              </Link>
            ))}
        </nav>
      </header>

      {/* The Brush: follows the pointer over the Canvas, moved by the engine. */}
      {painting && (
        <div
          ref={brushRef}
          aria-hidden
          className="pointer-events-none fixed left-0 top-0 z-10 origin-top-left opacity-0 will-change-transform"
        >
          <BrushDrawing />
        </div>
      )}

      <main className="relative grid flex-1 place-items-center pb-[5vh]">
        <figure className={`relative ${CANVAS_WIDTH}`}>
          <Frame>
            <div
              className={`relative overflow-hidden bg-[#d8d1c2] w-[var(--cw)]`}
              style={{ aspectRatio: ASPECT }}
            >
              {/* The Photo: what loads first, and the base of the still version. */}
              <Image
                src={ASSETS.photo}
                alt=""
                fill
                priority
                sizes="(min-width: 1024px) 60vw, 100vw"
                className="object-cover"
              />

              {mode === "still" && (
                <Image
                  src={ASSETS.painting}
                  alt=""
                  fill
                  sizes="(min-width: 1024px) 60vw, 100vw"
                  className="animate-dissolve object-cover"
                />
              )}

              {painting && (
                <canvas
                  ref={canvasRef}
                  role="img"
                  aria-label={t.canvasAria}
                  className={`absolute inset-0 h-full w-full transition-opacity duration-700 ${
                    ready ? "cursor-none opacity-100" : "opacity-0"
                  }`}
                />
              )}

              {/* The shadow the Frame's lip casts on the Canvas. */}
              <div className="pointer-events-none absolute inset-0 shadow-[inset_0_3px_6px_rgb(0_0_0/0.45),inset_2px_0_4px_rgb(0_0_0/0.2),inset_0_0_1px_rgb(0_0_0/0.6)]" />
            </div>
          </Frame>

          {/* Under the Frame: how much of the Canvas is Painted, and the two
              things a visitor can do about it. */}
          {painting && (
            <div
              className={`absolute left-0 top-full mt-5 flex items-center gap-6 whitespace-nowrap text-[0.8125rem] transition-opacity duration-700 ${
                ready ? "opacity-100" : "opacity-0"
              }`}
            >
              <div className="flex items-center gap-3">
                <div
                  role="progressbar"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={percent}
                  aria-label={shareText}
                  className="h-px w-24 bg-[#22271b]/20"
                >
                  <div
                    className="h-full origin-left bg-[#22271b] transition-transform duration-500 ease-out"
                    style={{ transform: `scaleX(${painted})` }}
                  />
                </div>
                <span className="tabular-nums opacity-60">{shareText}</span>
              </div>
              <button
                type="button"
                onClick={() => engineRef.current?.reveal()}
                data-umami-event="etretat-reveal"
                tabIndex={complete ? -1 : 0}
                aria-hidden={complete}
                className={`underline-offset-4 transition-opacity duration-500 hover:underline ${
                  complete
                    ? "pointer-events-none opacity-0"
                    : "opacity-60 hover:opacity-100"
                }`}
              >
                <AnimatedText text={t.reveal} />
              </button>
              <button
                type="button"
                onClick={() => engineRef.current?.startOver()}
                data-umami-event="etretat-start-over"
                tabIndex={byVisitor ? 0 : -1}
                aria-hidden={!byVisitor}
                className={`underline-offset-4 transition-opacity duration-500 hover:underline ${
                  byVisitor
                    ? "opacity-60 hover:opacity-100"
                    : "pointer-events-none opacity-0"
                }`}
              >
                <AnimatedText text={t.startOver} />
              </button>
            </div>
          )}

          {/* The wall label: lettering applied straight to the Wall beside
              the Frame's lower corner, as the Orangerie does it (under the
              Frame when the window is too narrow). It names both works. */}
          <figcaption className="absolute right-0 top-full mt-6 flex w-[13rem] flex-col gap-5 text-[0.71875rem] leading-[1.5] lg:bottom-[4%] lg:left-full lg:right-auto lg:top-auto lg:ml-10 lg:mt-0">
            <WallLabel
              serifClass={serif.className}
              author={site.name}
              title={t.photoTitle}
              year={PHOTO_YEAR}
              lines={[t.photoMedium]}
            />
            <WallLabel
              serifClass={serif.className}
              author={t.paintingArtist}
              title={t.paintingTitle}
              year={PAINTING_YEAR}
              lines={[t.paintingMedium, t.paintingCollection]}
            />
          </figcaption>
        </figure>
      </main>
    </div>
  );
}

/**
 * The tip of a flat bristle brush seen from above: the bristles and the
 * start of the ferrule, which fades out where the handle would be. The tip
 * is at the origin; the engine turns it to the angle it is held at.
 * The bristles are loaded with `--pigment`.
 */
function BrushDrawing() {
  return (
    <svg
      width="30"
      height="62"
      viewBox="-15 -4 30 62"
      className="-ml-[15px] -mt-1 drop-shadow-[3px_4px_3px_rgb(20_24_10/0.38)] [mask-image:linear-gradient(to_bottom,black_62%,transparent_96%)]"
    >
      <defs>
        <linearGradient id="brush-bristle" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="var(--pigment, #d8c9a8)" />
          <stop offset="0.5" stopColor="var(--pigment, #d8c9a8)" />
          <stop offset="1" stopColor="#bfa678" />
        </linearGradient>
        <linearGradient id="brush-ferrule" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#6f6f69" />
          <stop offset="0.28" stopColor="#f2f1ea" />
          <stop offset="0.55" stopColor="#a3a39c" />
          <stop offset="1" stopColor="#55554f" />
        </linearGradient>
      </defs>
      {/* Ferrule, with its two crimps */}
      <path d="M-7 31 L7 31 L5.8 55 L-5.8 55Z" fill="url(#brush-ferrule)" />
      <path
        d="M-6.6 38 H6.6 M-6.3 44 H6.3"
        stroke="rgb(40 40 36 / 0.45)"
        strokeWidth="0.9"
      />
      {/* Bristles */}
      <path
        d="M0 0 C-4.5 2 -7.6 12 -7 32 L7 32 C7.6 12 4.5 2 0 0Z"
        fill="url(#brush-bristle)"
      />
      <path
        d="M-4.4 30 C-4.8 18 -3.4 8 -1.2 3 M-1.6 30 C-1.8 18 -1 9 -0.2 3 M1.6 30 C1.8 18 1.4 9 0.8 4 M4.4 30 C4.8 18 3.6 9 2 5"
        stroke="rgb(30 22 10 / 0.22)"
        strokeWidth="0.7"
        fill="none"
      />
    </svg>
  );
}

/** One work's entry on the wall label. */
function WallLabel({
  serifClass,
  author,
  title,
  year,
  lines,
}: {
  serifClass: string;
  author: string;
  title: string;
  year: number;
  lines: readonly string[];
}) {
  return (
    <div>
      <p className="font-medium tracking-[0.01em]">{author}</p>
      <p className={`${serifClass} mt-0.5 text-[1.0625rem] leading-tight`}>
        <span className="italic">{title}</span>, {year}
      </p>
      {lines.map((line) => (
        <p key={line} className="opacity-55">
          {line}
        </p>
      ))}
    </div>
  );
}
