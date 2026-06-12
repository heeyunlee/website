import { isLocale, type Locale } from "@/lib/i18n/config";

/** Normalize a pathname for route checks (Firebase may serve trailing slashes). */
export function normalizePath(pathname: string | null): string {
  return (pathname ?? "/").replace(/\/+$/, "") || "/";
}

/** Remove a leading locale segment: "/ko/projects" → "/projects", "/ko" → "/". */
export function stripLocale(pathname: string | null): string {
  const path = normalizePath(pathname);
  const [, first, ...rest] = path.split("/");
  if (first && isLocale(first)) {
    return rest.length > 0 ? `/${rest.join("/")}` : "/";
  }
  return path;
}

/** Prefix a site-relative path with a locale: ("ko", "/projects") → "/ko/projects". */
export function localizeHref(locale: Locale, path: string): string {
  return path === "/" ? `/${locale}` : `/${locale}${path}`;
}
