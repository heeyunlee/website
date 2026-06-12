import type { Metadata } from "next";
import { privacy, site } from "@/lib/site-content";

export const metadata: Metadata = {
  title: privacy.title,
  description: `How ${site.name}'s site handles analytics and your privacy.`,
};

export default function Privacy() {
  return (
    <div className="space-y-10">
      <section className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">{privacy.title}</h1>
        <p className="font-mono text-xs uppercase tracking-widest text-zinc-500">
          Last updated {privacy.updated}
        </p>
      </section>

      <section className="max-w-xl space-y-4">
        {privacy.paragraphs.map((paragraph) => (
          <p key={paragraph} className="leading-relaxed text-zinc-400">
            {paragraph}
          </p>
        ))}
      </section>
    </div>
  );
}
