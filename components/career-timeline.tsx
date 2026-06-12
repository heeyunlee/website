"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowUpRightIcon, ChevronDownIcon } from "@/components/icons";
import {
  prefersReducedMotion,
  useIsomorphicLayoutEffect,
} from "@/components/motion";
import type { TimelineItem } from "@/lib/site-content";

const KIND_LABEL: Record<TimelineItem["kind"], string> = {
  education: "Education",
  military: "Service",
  work: "Work",
};

export function CareerTimeline({ items }: { items: TimelineItem[] }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLDivElement>(null);
  const [hiddenIds, setHiddenIds] = useState<ReadonlySet<string>>(new Set());
  const [openId, setOpenId] = useState<string | null>(null);

  // Progress line: fill tracks how far the timeline has scrolled past the
  // 60%-viewport focal point. Written straight to the ref (compositor-only,
  // no re-render per frame).
  useEffect(() => {
    const container = containerRef.current;
    const fill = fillRef.current;
    if (!container || !fill) return;
    if (prefersReducedMotion()) {
      fill.style.transform = "scaleY(1)";
      return;
    }

    let ticking = false;
    const update = () => {
      ticking = false;
      const rect = container.getBoundingClientRect();
      const focal = window.innerHeight * 0.6;
      const progress = Math.min(
        1,
        Math.max(0, (focal - rect.top) / rect.height)
      );
      fill.style.transform = `scaleY(${progress})`;
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [openId]);

  // One-shot entry reveals. Server HTML is fully visible (no-JS safe); after
  // hydration, below-fold entries are hidden pre-paint and revealed on scroll.
  useIsomorphicLayoutEffect(() => {
    const container = containerRef.current;
    if (!container || prefersReducedMotion()) return;

    const entries = Array.from(
      container.querySelectorAll<HTMLElement>("[data-timeline-id]")
    );
    const belowFold = entries.filter(
      (el) => el.getBoundingClientRect().top > window.innerHeight
    );
    if (belowFold.length === 0) return;

    setHiddenIds(
      new Set(belowFold.map((el) => el.dataset.timelineId as string))
    );
    const observer = new IntersectionObserver(
      (observed) => {
        for (const entry of observed) {
          if (!entry.isIntersecting) continue;
          const id = (entry.target as HTMLElement).dataset.timelineId as string;
          setHiddenIds((prev) => {
            const next = new Set(prev);
            next.delete(id);
            return next;
          });
          observer.unobserve(entry.target);
        }
      },
      { rootMargin: "0px 0px -12% 0px", threshold: 0.15 }
    );
    belowFold.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="relative">
      <div
        className="absolute bottom-2 left-[7px] top-2 w-px bg-zinc-800"
        aria-hidden="true"
      />
      <div
        ref={fillRef}
        className="absolute bottom-2 left-[7px] top-2 w-px origin-top bg-gradient-to-b from-emerald-400 to-emerald-400/40"
        style={{ transform: "scaleY(0)" }}
        aria-hidden="true"
      />

      <ol className="space-y-6">
        {items.map((item) => {
          const open = openId === item.id;
          const hidden = hiddenIds.has(item.id);
          const current = item.period?.endsWith("Present") ?? false;

          return (
            <li
              key={item.id}
              data-timeline-id={item.id}
              className={`relative pl-10 transition-all duration-500 ease-out sm:pl-12 ${
                hidden ? "translate-y-4 opacity-0" : "translate-y-0 opacity-100"
              }`}
            >
              <span
                aria-hidden="true"
                className={`absolute left-0 top-6 size-[15px] rounded-full border-2 ${
                  current
                    ? "animate-pulse-dot border-emerald-400 bg-emerald-400"
                    : "border-emerald-400/60 bg-zinc-950"
                }`}
              />

              <div className="glass-card overflow-hidden transition-colors duration-300 hover:border-emerald-400/25">
                <button
                  type="button"
                  id={`${item.id}-button`}
                  aria-expanded={open}
                  aria-controls={`${item.id}-panel`}
                  onClick={() => setOpenId(open ? null : item.id)}
                  data-umami-event="timeline-toggle"
                  data-umami-event-item={item.id}
                  data-umami-event-action={open ? "collapse" : "expand"}
                  className="flex w-full items-start justify-between gap-4 p-5 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-emerald-400/50"
                >
                  <div className="min-w-0">
                    <p className="font-mono text-[11px] uppercase tracking-widest text-zinc-500">
                      {KIND_LABEL[item.kind]}
                      {item.period && (
                        <span className="ml-2 text-emerald-400">
                          {item.period}
                        </span>
                      )}
                    </p>
                    <h3 className="mt-1.5 font-semibold text-zinc-100">
                      {item.organization}
                    </h3>
                    <p className="text-sm text-zinc-400">
                      {item.role}
                      {item.location ? ` · ${item.location}` : ""}
                    </p>
                    <p className="mt-2 text-sm leading-relaxed text-zinc-400">
                      {item.summary}
                    </p>
                  </div>
                  <ChevronDownIcon
                    className={`mt-1 size-5 shrink-0 text-zinc-500 transition-transform duration-300 ${
                      open ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <div
                  id={`${item.id}-panel`}
                  role="region"
                  aria-labelledby={`${item.id}-button`}
                  className={`grid transition-[grid-template-rows] duration-300 ease-out-expo ${
                    open ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
                  }`}
                >
                  <div className="min-h-0 overflow-hidden">
                    <div
                      className={`space-y-4 border-t border-white/5 px-5 pb-5 pt-4 transition-opacity duration-300 ${
                        open ? "opacity-100" : "opacity-0"
                      }`}
                    >
                      <ul className="space-y-1.5 text-sm leading-relaxed text-zinc-300">
                        {item.details.map((detail) => (
                          <li key={detail} className="flex gap-2">
                            <span
                              className="text-emerald-400/70"
                              aria-hidden="true"
                            >
                              —
                            </span>
                            {detail}
                          </li>
                        ))}
                      </ul>
                      <div className="flex flex-wrap items-center gap-1.5">
                        {item.tags?.map((tag) => (
                          <span
                            key={tag}
                            className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-xs text-zinc-400"
                          >
                            {tag}
                          </span>
                        ))}
                        {item.organizationUrl && (
                          <a
                            href={item.organizationUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            tabIndex={open ? undefined : -1}
                            data-umami-event="timeline-org-click"
                            data-umami-event-org={item.organization}
                            className="ml-auto inline-flex items-center gap-1 text-xs font-medium text-emerald-400 hover:text-emerald-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/50"
                          >
                            Visit {item.organization}
                            <ArrowUpRightIcon className="size-3.5" />
                          </a>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
