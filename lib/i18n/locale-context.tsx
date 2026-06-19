"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { usePathname } from "next/navigation";
import { markLocaleSwitch } from "@/components/locale-transition";
import { getContent } from "@/lib/content";
import type { SiteContent } from "@/lib/content/types";
import {
  defaultLocale,
  isLocale,
  LOCALE_STORAGE_KEY,
  type Locale,
} from "@/lib/i18n/config";

type LocaleContextValue = {
  locale: Locale;
  /** Switch language in place (no navigation) and persist the choice. */
  setLocale: (locale: Locale) => void;
  content: SiteContent;
};

const LocaleContext = createContext<LocaleContextValue | null>(null);

/**
 * Resolve the visitor's language on the client: an explicit `?lang=` wins (so
 * a shared link forces its language), then the stored choice, then the browser
 * languages, else the default. Mirrors the detector that used to live in the
 * public/*.html pages.
 */
function detectLocale(): Locale {
  try {
    const fromQuery = new URLSearchParams(window.location.search).get("lang");
    if (fromQuery && isLocale(fromQuery)) return fromQuery;

    const stored = localStorage.getItem(LOCALE_STORAGE_KEY);
    if (stored && isLocale(stored)) return stored;

    for (const lang of navigator.languages ?? [navigator.language]) {
      const code = String(lang).toLowerCase();
      if (code.startsWith("ko")) return "ko";
      if (code.startsWith("fr")) return "fr";
      if (code.startsWith("en")) return defaultLocale;
    }
  } catch {
    // Storage or URL APIs unavailable — fall back to the default.
  }
  return defaultLocale;
}

/**
 * Holds the active locale as client state. Switching language is a pure state
 * change — no route change, no reload — so text-bearing components re-render in
 * place and AnimatedText can animate the difference (see locale-transition.ts).
 *
 * Server render and the first client render both use defaultLocale to avoid a
 * hydration mismatch; the visitor's real preference is applied in an effect
 * right after mount.
 */
export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>(defaultLocale);
  const pathname = usePathname();

  // Apply the detected preference once, after hydration.
  useEffect(() => {
    const detected = detectLocale();
    if (detected !== defaultLocale) setLocaleState(detected);
  }, []);

  // Keep <html lang> and the shareable ?lang= param in sync with the choice.
  // replaceState avoids a navigation; the param is dropped for the default
  // locale to keep canonical URLs clean.
  useEffect(() => {
    document.documentElement.lang = locale;
    const url = new URL(window.location.href);
    if (locale === defaultLocale) url.searchParams.delete("lang");
    else url.searchParams.set("lang", locale);
    window.history.replaceState(window.history.state, "", url);
  }, [locale, pathname]);

  const content = useMemo(() => getContent(locale), [locale]);

  const value = useMemo<LocaleContextValue>(
    () => ({
      locale,
      content,
      setLocale: (next: Locale) => {
        markLocaleSwitch();
        try {
          localStorage.setItem(LOCALE_STORAGE_KEY, next);
        } catch {
          // Storage unavailable — the switch still applies for this session.
        }
        setLocaleState(next);
      },
    }),
    [locale, content]
  );

  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}

function useLocaleContext(): LocaleContextValue {
  const ctx = useContext(LocaleContext);
  if (!ctx) throw new Error("useLocale must be used within a LocaleProvider");
  return ctx;
}

/** Active locale and the in-place switcher. */
export function useLocale(): Pick<LocaleContextValue, "locale" | "setLocale"> {
  const { locale, setLocale } = useLocaleContext();
  return { locale, setLocale };
}

/** Site content merged for the active locale. */
export function useContent(): SiteContent {
  return useLocaleContext().content;
}
