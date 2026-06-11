"use client";

import { useRef, useState } from "react";
import {
  prefersReducedMotion,
  useIsomorphicLayoutEffect,
} from "@/components/motion";

type RevealProps = {
  children: React.ReactNode;
  className?: string;
  /** Extra transition delay in ms, for staggering siblings. */
  delay?: number;
};

/**
 * One-shot scroll reveal. Server HTML renders fully visible (no-JS safe);
 * after hydration, elements still below the fold are hidden pre-paint and
 * revealed by an IntersectionObserver as they scroll into view.
 */
export function Reveal({ children, className = "", delay = 0 }: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [hidden, setHidden] = useState(false);

  useIsomorphicLayoutEffect(() => {
    const el = ref.current;
    if (!el || prefersReducedMotion()) return;
    if (el.getBoundingClientRect().top <= window.innerHeight) return;

    setHidden(true);
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setHidden(false);
          observer.disconnect();
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.1 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={ref}
      style={delay ? { transitionDelay: `${delay}ms` } : undefined}
      className={`transition-all duration-500 ease-out ${
        hidden ? "translate-y-4 opacity-0" : "translate-y-0 opacity-100"
      } ${className}`}
    >
      {children}
    </div>
  );
}
