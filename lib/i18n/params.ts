import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n/config";

export type LocaleParams = Promise<{ locale: string }>;

/**
 * Resolve and validate the [locale] route param. With dynamicParams = false
 * this only matters in `next dev`, where arbitrary segments reach the route.
 */
export async function resolveLocale(params: LocaleParams): Promise<Locale> {
  const { locale } = await params;
  if (!isLocale(locale)) notFound();
  return locale;
}
