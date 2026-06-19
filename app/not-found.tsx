import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "404 — Heeyun Lee",
};

/**
 * Exported as out/404.html and served by Firebase's "**" rewrite for any
 * unknown path. It renders inside the root layout, so it only provides the
 * page body; language is detected client-side like every other page.
 */
export default function NotFound() {
  return (
    <main className="flex min-h-[60vh] flex-col items-center justify-center space-y-6 text-center">
      <p className="font-mono text-xs uppercase tracking-widest text-emerald-400">
        404
      </p>
      <h1 className="text-3xl font-bold tracking-tight">Page not found</h1>
      <p className="text-sm text-zinc-400">
        <span lang="ko">페이지를 찾을 수 없어요</span>
        {" · "}
        <span lang="fr">Page introuvable</span>
      </p>
      <Link
        href="/"
        className="rounded-full border border-white/10 bg-white/5 px-4 py-1.5 font-mono text-sm text-zinc-300 transition-colors hover:border-emerald-400/30 hover:text-emerald-400"
      >
        ← Home
      </Link>
    </main>
  );
}
