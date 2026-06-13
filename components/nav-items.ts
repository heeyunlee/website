import {
  DocumentIcon,
  FolderIcon,
  HomeIcon,
  MailIcon,
} from "@/components/icons";
import { stripLocale } from "@/lib/i18n/links";

/** Nav structure; labels come from UIStrings["nav"] keyed by `key`. */
export const navItems = [
  { key: "home", path: "/", icon: HomeIcon },
  { key: "resume", path: "/resume", icon: DocumentIcon },
  { key: "projects", path: "/projects", icon: FolderIcon },
  { key: "contact", path: "/contact", icon: MailIcon },
] as const;

/** Active-route check against the locale-stripped pathname. */
export function isActive(path: string, pathname: string | null): boolean {
  const current = stripLocale(pathname);
  return path === "/" ? current === "/" : current.startsWith(path);
}
