import type { Metadata } from "next";
import { locales, type Locale } from "@/lib/i18n/config";
import { localizeHref } from "@/lib/i18n/links";

/**
 * Canonical + hreflang alternates for a site-relative path (e.g. "/projects").
 * x-default points at the unprefixed path, which serves the language-detector
 * page from public/ — the textbook target for a language selector.
 */
export function buildAlternates(
  locale: Locale,
  path: string
): Metadata["alternates"] {
  return {
    canonical: localizeHref(locale, path),
    languages: {
      ...Object.fromEntries(
        locales.map((target) => [target, localizeHref(target, path)])
      ),
      "x-default": path,
    },
  };
}
