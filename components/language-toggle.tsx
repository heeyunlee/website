"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LOCALE_STORAGE_KEY,
  localeLabels,
  locales,
  type Locale,
} from "@/lib/i18n/config";
import { localizeHref, stripLocale } from "@/lib/i18n/links";

/**
 * Segmented EN | KO | FR control. Each option links to the same page in the
 * target locale; a click persists the choice so the "/" detector honors it
 * on future visits. The sliding pill mirrors an on/off switch with 3 stops.
 */
export function LanguageToggle({
  locale,
  ariaLabel,
}: {
  locale: Locale;
  ariaLabel: string;
}) {
  const pathname = usePathname();
  const path = stripLocale(pathname);
  const activeIndex = locales.indexOf(locale);

  return (
    <div
      role="group"
      aria-label={ariaLabel}
      className="relative grid grid-cols-3 rounded-full border border-white/10 bg-white/5 p-0.5 font-mono text-[11px]"
    >
      <span
        aria-hidden="true"
        className="absolute inset-y-0.5 left-0.5 w-[calc((100%-4px)/3)] rounded-full bg-emerald-400/15 ring-1 ring-emerald-400/30 transition-transform duration-300 ease-out-expo"
        style={{ transform: `translateX(${activeIndex * 100}%)` }}
      />
      {locales.map((target) => (
        <Link
          key={target}
          href={localizeHref(target, path)}
          aria-current={target === locale ? "true" : undefined}
          data-umami-event="language-switch"
          data-umami-event-locale={target}
          onClick={() => {
            try {
              localStorage.setItem(LOCALE_STORAGE_KEY, target);
            } catch {
              // localStorage unavailable — the link still navigates.
            }
          }}
          className={`relative z-10 rounded-full px-2.5 py-1 text-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/50 ${
            target === locale
              ? "text-emerald-400"
              : "text-zinc-500 hover:text-zinc-200"
          }`}
        >
          {localeLabels[target]}
        </Link>
      ))}
    </div>
  );
}
