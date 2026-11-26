"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";

/**
 * The page column. Most pages read as a narrow column of text; the Claude
 * gallery needs the window's full width for its Frame and wall label.
 */
export function SiteMain({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const wide = pathname === "/claude";
  return (
    <main
      className={
        wide
          ? "w-full py-8 pb-28 sm:py-10 sm:pb-12"
          : "mx-auto w-full max-w-3xl px-6 py-12 pb-28 sm:py-16 sm:pb-16"
      }
    >
      {children}
    </main>
  );
}
