"use client";

import { AnimatedText } from "@/components/animated-text";
import { useContent } from "@/lib/i18n/locale-context";

export function PrivacyView() {
  const { ui, privacy } = useContent();

  return (
    <div className="space-y-10">
      <section className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">
          <AnimatedText text={privacy.title} />
        </h1>
        <p className="font-mono text-xs uppercase tracking-widest text-zinc-500">
          <AnimatedText
            mode="fade"
            text={ui.privacyPage.lastUpdated.replace("{date}", privacy.updated)}
          />
        </p>
      </section>

      <section className="max-w-xl space-y-4">
        {privacy.paragraphs.map((paragraph) => (
          <p key={paragraph} className="leading-relaxed text-zinc-400">
            <AnimatedText mode="fade" text={paragraph} />
          </p>
        ))}
      </section>
    </div>
  );
}
