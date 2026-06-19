"use client";

import Link from "next/link";
import { AnimatedText } from "@/components/animated-text";
import { useContent } from "@/lib/i18n/locale-context";

export function SiteFooter() {
  const { site, ui } = useContent();

  return (
    <footer className="border-t border-white/10">
      <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-6 pb-24 text-sm text-zinc-500 sm:pb-6">
        <span>
          © {new Date().getFullYear()} {site.name}
        </span>
        <span className="font-mono text-xs text-zinc-600">
          <Link
            href="/privacy"
            className="transition-colors hover:text-zinc-400"
          >
            <AnimatedText text={ui.footer.privacy} />
          </Link>
        </span>
      </div>
    </footer>
  );
}
