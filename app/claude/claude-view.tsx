"use client";

import { Cormorant_Garamond } from "next/font/google";
import Image from "next/image";
import {
  type CSSProperties,
  type ReactNode,
  useEffect,
  useId,
  useRef,
  useState,
} from "react";
import { AnimatedText } from "@/components/animated-text";
import { drawGiltFrame } from "@/lib/etretat/gilt-frame";
import {
  createPaintEngine,
  type EngineOptions,
  type PaintEngine,
} from "@/lib/etretat/engine";
import { useContent } from "@/lib/i18n/locale-context";

const serif = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["500"],
  style: ["normal", "italic"],
  display: "swap",
});

const works = [
  {
    id: "etretat",
    directory: "/etretat",
    aspect: 2560 / 1888,
    paintingYear: 1883,
    sun: { u: 0.72, v: 0.4685 },
  },
  {
    id: "rouen",
    directory: "/claude/rouen",
    aspect: 960 / 1512,
    paintingYear: 1892,
  },
] as const;

type Work = (typeof works)[number];
type Mode = "pending" | "paint" | "still";

// ---- The Wall and the Frame ----

/** The shadow a frame throws on the Wall under a light from above. */
const CAST_SHADOW =
  "shadow-[0_2px_3px_rgb(0_0_0/0.5),0_18px_26px_-10px_rgb(0_0_0/0.7),0_50px_60px_-28px_rgb(0_0_0/0.6)]";

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
      className={`relative border border-[#846538] bg-[#514023] p-[min(4vw,1.85rem)] ${CAST_SHADOW}`}
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

export function ClaudeView() {
  const { ui } = useContent();
  const t = ui.claude;
  const instructionsId = useId();

  function getStop(gallery: HTMLDivElement, index: number) {
    const frame = gallery.children[index] as HTMLElement;
    return (
      frame.offsetLeft -
      (parseFloat(getComputedStyle(gallery).scrollPaddingLeft) || 0)
    );
  }

  return (
    <div className="select-none bg-[radial-gradient(ellipse_closest-side_at_50%_42%,rgb(255_232_190/0.11),transparent)]">
      <h1 className="sr-only">{ui.nav.claude}</h1>
      <p id={instructionsId} className="sr-only">
        {t.instructions}
      </p>
      <div
        role="region"
        aria-label={t.galleryLabel}
        aria-describedby={instructionsId}
        tabIndex={0}
        onKeyDown={(event) => {
          if (event.target !== event.currentTarget) return;
          if (event.key !== "ArrowLeft" && event.key !== "ArrowRight") return;
          event.preventDefault();
          const gallery = event.currentTarget;
          gallery.scrollTo({
            left: getStop(gallery, event.key === "ArrowLeft" ? 0 : 1),
            behavior: "auto",
          });
        }}
        className="relative flex snap-x snap-mandatory gap-5 overflow-x-auto overscroll-x-contain scroll-smooth px-5 [scroll-padding-inline:1.25rem] [scrollbar-color:#514633_transparent] focus-visible:outline focus-visible:outline-1 focus-visible:-outline-offset-2 motion-reduce:scroll-auto sm:gap-12 sm:px-12 sm:[scroll-padding-inline:3rem]"
      >
        {works.map((work, index) => (
          <GalleryWork key={work.id} work={work} first={index === 0} />
        ))}
      </div>
    </div>
  );
}

function GalleryWork({ work, first }: { work: Work; first: boolean }) {
  const { site, ui } = useContent();
  const t = ui.claude;
  const label = t.works[work.id];
  const photo = `${work.directory}/photo.webp`;
  const painting = `${work.directory}/painting.webp`;
  const titleId = useId();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const brushRef = useRef<HTMLDivElement>(null);
  const engineRef = useRef<PaintEngine | null>(null);
  const [mode, setMode] = useState<Mode>("pending");
  const [lost, setLost] = useState(false);
  const [ready, setReady] = useState(false);
  const [painted, setPainted] = useState(0);
  const [byVisitor, setByVisitor] = useState(false);

  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    const decide = () => setMode(lost || reduced.matches ? "still" : "paint");
    decide();
    reduced.addEventListener("change", decide);
    return () => reduced.removeEventListener("change", decide);
  }, [lost]);

  useEffect(() => {
    if (mode !== "paint" || !canvasRef.current) return;
    const options: EngineOptions = {
      assets: { photo, painting, flow: `${work.directory}/flow.png` },
      aspect: work.aspect,
      sun: "sun" in work ? work.sun : undefined,
      brushEl: brushRef.current,
      onReady: () => setReady(true),
      onProgress: (fraction, visitor) => {
        setPainted(fraction);
        setByVisitor(visitor);
      },
      onLost: () => setLost(true),
    };
    const engine = createPaintEngine(canvasRef.current, options);
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
  }, [mode, painting, photo, work]);

  const percent = Math.round(painted * 100);
  const complete = painted >= 0.995;
  const shareText = t.paintedShare.replace("{percent}", String(percent));

  return (
    <section
      aria-labelledby={titleId}
      className="relative grid w-[calc(100%-0.75rem)] flex-none snap-start content-start pb-12 pt-5 sm:w-[calc(100%-3rem)] sm:pt-8 lg:w-[calc(100%-7rem)]"
    >
      <figure
        className="relative mx-auto grid w-full max-w-[calc(var(--art-width)+min(8vw,3.7rem)+2px+var(--label-width)+var(--label-gap))] grid-cols-[minmax(0,1fr)_var(--label-width)] items-center gap-x-[var(--label-gap)] [--label-gap:0.75rem] [--label-width:clamp(5.75rem,24vw,12rem)] sm:items-end sm:[--label-gap:1.75rem]"
        style={
          {
            "--art-width": `clamp(12rem, 54dvh, 36rem) * ${work.aspect}`,
          } as CSSProperties
        }
      >
        <Frame>
          <div
            className="relative bg-[#d8d1c2]"
            style={{ aspectRatio: work.aspect }}
          >
            <Image
              src={photo}
              alt={
                (mode === "paint" && ready) || mode === "still"
                  ? ""
                  : label.photoTitle
              }
              fill
              priority={first}
              sizes="(min-width: 1024px) 65vw, 90vw"
            />
            {mode === "still" && (
              <Image
                src={painting}
                alt={label.paintingTitle}
                fill
                sizes="(min-width: 1024px) 65vw, 90vw"
                className="animate-dissolve"
              />
            )}
            {mode === "paint" && (
              <>
                <canvas
                  ref={canvasRef}
                  role="img"
                  aria-label={t.canvasAria.replace("{title}", label.photoTitle)}
                  aria-hidden={!ready}
                  className={`absolute inset-0 h-full w-full transition-opacity duration-500 ${
                    ready
                      ? "touch-none cursor-none opacity-100"
                      : "pointer-events-none opacity-0"
                  }`}
                />
                <div
                  ref={brushRef}
                  aria-hidden
                  className="pointer-events-none absolute left-0 top-0 z-10 origin-top-left opacity-0 will-change-transform"
                >
                  <BrushDrawing />
                </div>
              </>
            )}
            <div className="pointer-events-none absolute inset-0 shadow-[inset_0_3px_6px_rgb(0_0_0/0.45),inset_2px_0_4px_rgb(0_0_0/0.2)]" />
          </div>
        </Frame>

        {mode === "paint" && (
          <div
            className={`relative col-start-1 row-start-2 mt-4 flex min-h-10 flex-wrap items-center gap-x-4 gap-y-1 border-t border-white/10 pt-2 text-xs transition-opacity ${
              ready ? "opacity-100" : "invisible opacity-0"
            }`}
          >
            <div
              role="progressbar"
              aria-valuemin={0}
              aria-valuemax={100}
              aria-valuenow={percent}
              aria-label={shareText}
              className="flex items-center gap-2 text-zinc-400"
            >
              <span className="relative h-px w-8 bg-white/20" aria-hidden>
                <span
                  className="absolute inset-0 origin-left bg-[#bfa678] transition-transform"
                  style={{ transform: `scaleX(${painted})` }}
                />
              </span>
              <span className="tabular-nums">{shareText}</span>
            </div>
            <button
              type="button"
              onClick={() => engineRef.current?.reveal()}
              data-umami-event="claude-reveal"
              data-umami-event-work={work.id}
              disabled={complete}
              className="min-h-8 text-zinc-300 underline-offset-4 hover:underline disabled:hidden"
            >
              <AnimatedText text={t.reveal} />
            </button>
            <button
              type="button"
              onClick={() => engineRef.current?.startOver()}
              data-umami-event="claude-start-over"
              data-umami-event-work={work.id}
              disabled={!byVisitor}
              className="min-h-8 text-zinc-300 underline-offset-4 hover:underline disabled:hidden"
            >
              <AnimatedText text={t.startOver} />
            </button>
          </div>
        )}
        <figcaption
          id={titleId}
          className="relative col-start-2 row-start-1 grid gap-2 text-[0.6875rem] leading-snug sm:gap-4 sm:pb-2 sm:text-xs sm:leading-relaxed"
        >
          <WallLabel
            author={site.name}
            title={label.photoTitle}
            year={2026}
            lines={[t.photoMedium]}
          />
          <WallLabel
            author={t.paintingArtist}
            title={label.paintingTitle}
            year={work.paintingYear}
            lines={[t.paintingMedium, label.paintingCollection]}
          />
        </figcaption>
      </figure>
    </section>
  );
}

/**
 * The tip of a flat bristle brush seen from above: the bristles and the
 * start of the ferrule, which fades out where the handle would be. The tip
 * is at the origin; the engine turns it to the angle it is held at.
 * The bristles are loaded with `--pigment`.
 */
function BrushDrawing() {
  const id = useId();
  return (
    <svg
      width="30"
      height="62"
      viewBox="-15 -4 30 62"
      className="-ml-[15px] -mt-1 drop-shadow-[3px_4px_3px_rgb(20_24_10/0.38)] [mask-image:linear-gradient(to_bottom,black_62%,transparent_96%)]"
    >
      <defs>
        <linearGradient id={`${id}-bristle`} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="var(--pigment, #d8c9a8)" />
          <stop offset="0.5" stopColor="var(--pigment, #d8c9a8)" />
          <stop offset="1" stopColor="#bfa678" />
        </linearGradient>
        <linearGradient id={`${id}-ferrule`} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#6f6f69" />
          <stop offset="0.28" stopColor="#f2f1ea" />
          <stop offset="0.55" stopColor="#a3a39c" />
          <stop offset="1" stopColor="#55554f" />
        </linearGradient>
      </defs>
      {/* Ferrule, with its two crimps */}
      <path d="M-7 31 L7 31 L5.8 55 L-5.8 55Z" fill={`url(#${id}-ferrule)`} />
      <path
        d="M-6.6 38 H6.6 M-6.3 44 H6.3"
        stroke="rgb(40 40 36 / 0.45)"
        strokeWidth="0.9"
      />
      {/* Bristles */}
      <path
        d="M0 0 C-4.5 2 -7.6 12 -7 32 L7 32 C7.6 12 4.5 2 0 0Z"
        fill={`url(#${id}-bristle)`}
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
  author,
  title,
  year,
  lines,
}: {
  author: string;
  title: string;
  year: number;
  lines: readonly string[];
}) {
  return (
    <div>
      <p className="font-medium tracking-[0.01em]">{author}</p>
      <p
        className={`${serif.className} mt-0.5 text-sm leading-tight sm:text-[1.0625rem]`}
      >
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
