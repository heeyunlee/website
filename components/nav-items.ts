import {
  DocumentIcon,
  FolderIcon,
  HomeIcon,
  MailIcon,
} from "@/components/icons";

export const navItems = [
  { href: "/", label: "Home", icon: HomeIcon },
  { href: "/resume", label: "Resume", icon: DocumentIcon },
  { href: "/projects", label: "Projects", icon: FolderIcon },
  { href: "/contact", label: "Contact", icon: MailIcon },
] as const;

/** Normalize a pathname for active-route checks (Firebase may serve trailing slashes). */
export function normalizePath(pathname: string | null): string {
  return (pathname ?? "/").replace(/\/+$/, "") || "/";
}

export function isActive(href: string, pathname: string | null): boolean {
  const path = normalizePath(pathname);
  return href === "/" ? path === "/" : path.startsWith(href);
}
