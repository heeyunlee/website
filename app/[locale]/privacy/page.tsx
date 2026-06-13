import type { Metadata } from "next";
import { AnimatedText } from "@/components/animated-text";
import { getContent } from "@/lib/content";
import { resolveLocale, type LocaleParams } from "@/lib/i18n/params";
import { buildAlternates } from "@/lib/i18n/seo";

export async function generateMetadata({
  params,
}: {
  params: LocaleParams;
}): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const { metadata } = getContent(locale);
  return {
    title: metadata.privacy.title,
    description: metadata.privacy.description,
    alternates: buildAlternates(locale, "/privacy"),
  };
}

export default async function Privacy({ params }: { params: LocaleParams }) {
  const locale = await resolveLocale(params);
  const { ui, privacy } = getContent(locale);

  return (
    <div className="space-y-10">
      <section className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">
          <AnimatedText id="privacy-title" text={privacy.title} />
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
