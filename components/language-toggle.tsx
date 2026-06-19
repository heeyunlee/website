"use client";

import { localeLabels, locales } from "@/lib/i18n/config";
import { useLocale } from "@/lib/i18n/locale-context";

/**
 * Segmented EN | KO | FR control. Selecting an option switches the language in
 * place (no navigation, no reload) so the surrounding text animates. The
 * sliding pill mirrors an on/off switch with 3 stops.
 */
export function LanguageToggle({ ariaLabel }: { ariaLabel: string }) {
  const { locale, setLocale } = useLocale();
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
        <button
          key={target}
          type="button"
          aria-pressed={target === locale}
          data-umami-event="language-switch"
          data-umami-event-locale={target}
          onClick={() => setLocale(target)}
          className={`relative z-10 rounded-full px-2.5 py-1 text-center transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/50 ${
            target === locale
              ? "text-emerald-400"
              : "text-zinc-500 hover:text-zinc-200"
          }`}
        >
          {localeLabels[target]}
        </button>
      ))}
    </div>
  );
}
