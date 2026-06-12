"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatedText } from "@/components/animated-text";
import { LanguageToggle } from "@/components/language-toggle";
import { isActive, navItems } from "@/components/nav-items";
import type { UIStrings } from "@/lib/content/types";
import type { Locale } from "@/lib/i18n/config";
import { localizeHref } from "@/lib/i18n/links";

export function SiteHeader({
  locale,
  siteName,
  navLabels,
  toggleAria,
}: {
  locale: Locale;
  siteName: string;
  navLabels: UIStrings["nav"];
  toggleAria: string;
}) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-white/10 bg-zinc-950/70 backdrop-blur-md">
      <nav className="mx-auto flex h-14 max-w-3xl items-center justify-between px-6">
        <Link
          href={localizeHref(locale, "/")}
          className="group flex items-center gap-2.5 font-semibold tracking-tight"
        >
          <span className="flex size-7 items-center justify-center rounded-lg bg-emerald-400/15 text-xs font-bold text-emerald-400 ring-1 ring-emerald-400/30 transition group-hover:shadow-glow-sm">
            HL
          </span>
          {siteName}
        </Link>
        <div className="flex items-center gap-3">
          <div className="hidden items-center gap-1 sm:flex">
            {navItems.map((item) => {
              const active = isActive(item.path, pathname);
              return (
                <Link
                  key={item.key}
                  href={localizeHref(locale, item.path)}
                  aria-current={active ? "page" : undefined}
                  className={`rounded-full px-3.5 py-1.5 text-sm transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/50 ${
                    active
                      ? "bg-emerald-400/10 text-emerald-400"
                      : "text-zinc-400 hover:bg-white/5 hover:text-zinc-100"
                  }`}
                >
                  <AnimatedText
                    id={`nav-${item.key}`}
                    text={navLabels[item.key]}
                  />
                </Link>
              );
            })}
          </div>
          <LanguageToggle locale={locale} ariaLabel={toggleAria} />
        </div>
      </nav>
    </header>
  );
}
