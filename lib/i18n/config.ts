export const locales = ["en", "ko", "fr"] as const;

export type Locale = (typeof locales)[number];

export const defaultLocale: Locale = "en";

/** Short labels shown in the header language toggle. */
export const localeLabels: Record<Locale, string> = {
  en: "EN",
  ko: "KO",
  fr: "FR",
};

/**
 * localStorage key for the visitor's explicit language choice.
 * Keep in sync with the inline detector script in public/*.html.
 */
export const LOCALE_STORAGE_KEY = "preferred-locale";

export function isLocale(value: string): value is Locale {
  return (locales as readonly string[]).includes(value);
}
