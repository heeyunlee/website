import type { Metadata } from "next";
import { getContent } from "@/lib/content";
import type { PageKey } from "@/lib/content/types";
import { defaultLocale } from "@/lib/i18n/config";

/**
 * Static per-page metadata for a route, in the default locale. The static
 * export carries one HTML file per page, so the title/description are the
 * default language's; the page's visible text is still localized client-side.
 */
export function pageMetadata(key: PageKey): Metadata {
  const { metadata } = getContent(defaultLocale);
  return {
    title: metadata[key].title,
    description: metadata[key].description,
  };
}
