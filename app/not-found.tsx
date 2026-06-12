import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "404 — Heeyun Lee",
};

/**
 * Exported as out/404.html and served by Firebase's "**" rewrite for any
 * unknown path, so it can't know the visitor's locale — it renders all
 * three languages. The passthrough root layout provides no <html>/<body>,
 * so this page renders its own document.
 */
export default function NotFound() {
  return (
    <html lang="en" className="bg-zinc-950">
      <body className="flex min-h-screen items-center justify-center bg-zinc-950 font-sans text-zinc-100 antialiased">
        <main className="space-y-6 px-6 text-center">
          <p className="font-mono text-xs uppercase tracking-widest text-emerald-400">
            404
          </p>
          <h1 className="text-3xl font-bold tracking-tight">Page not found</h1>
          <p className="text-sm text-zinc-400">
            <span lang="ko">페이지를 찾을 수 없어요</span>
            {" · "}
            <span lang="fr">Page introuvable</span>
          </p>
          <nav className="flex items-center justify-center gap-3 font-mono text-sm">
            <Link
              href="/en"
              className="rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-zinc-300 transition-colors hover:border-emerald-400/30 hover:text-emerald-400"
            >
              English
            </Link>
            <Link
              href="/ko"
              lang="ko"
              className="rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-zinc-300 transition-colors hover:border-emerald-400/30 hover:text-emerald-400"
            >
              한국어
            </Link>
            <Link
              href="/fr"
              lang="fr"
              className="rounded-full border border-white/10 bg-white/5 px-4 py-1.5 text-zinc-300 transition-colors hover:border-emerald-400/30 hover:text-emerald-400"
            >
              Français
            </Link>
          </nav>
        </main>
      </body>
    </html>
  );
}
