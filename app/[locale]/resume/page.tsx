import type { Metadata } from "next";
import Link from "next/link";
import { ArrowUpRightIcon } from "@/components/icons";
import { Reveal } from "@/components/reveal";
import { getContent } from "@/lib/content";
import { localizeHref } from "@/lib/i18n/links";
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
    title: metadata.resume.title,
    description: metadata.resume.description,
    alternates: buildAlternates(locale, "/resume"),
  };
}

export default async function Resume({ params }: { params: LocaleParams }) {
  const locale = await resolveLocale(params);
  const { metadata, ui, experience, education, skillGroups } =
    getContent(locale);

  return (
    <div className="space-y-14">
      <section className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">
          {metadata.resume.title}
        </h1>
        <p className="max-w-xl leading-relaxed text-zinc-400">
          {ui.resumePage.introBeforeLink}
          <Link
            href={localizeHref(locale, "/contact")}
            className="text-emerald-400 underline decoration-emerald-400/40 underline-offset-4 hover:decoration-emerald-400"
          >
            {ui.resumePage.introLinkLabel}
          </Link>
          {ui.resumePage.introAfterLink}
        </p>
      </section>

      <section className="space-y-6">
        <h2 className="font-mono text-xs uppercase tracking-widest text-emerald-400">
          {ui.resumePage.experience}
        </h2>
        <div className="space-y-5">
          {experience.map((job, i) => (
            <Reveal key={job.id} delay={i * 80}>
              <article className="glass-card space-y-3 p-6">
                <div className="flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between">
                  <div>
                    <h3 className="text-lg font-semibold text-zinc-100">
                      {job.title}
                    </h3>
                    <p className="text-sm text-zinc-400">
                      {job.organizationUrl ? (
                        <a
                          href={job.organizationUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-emerald-400 hover:text-emerald-300"
                        >
                          {job.organization}
                          <ArrowUpRightIcon className="size-3.5" />
                        </a>
                      ) : (
                        job.organization
                      )}
                      {job.location ? ` · ${job.location}` : ""}
                    </p>
                  </div>
                  {job.period && (
                    <p className="shrink-0 font-mono text-xs uppercase tracking-widest text-zinc-500">
                      {job.period}
                    </p>
                  )}
                </div>
                <p className="text-sm leading-relaxed text-zinc-400">
                  {job.summary}
                </p>
                {job.highlights.length > 0 && (
                  <ul className="space-y-1.5 text-sm leading-relaxed text-zinc-300">
                    {job.highlights.map((item) => (
                      <li key={item} className="flex gap-2">
                        <span
                          className="text-emerald-400/70"
                          aria-hidden="true"
                        >
                          —
                        </span>
                        {item}
                      </li>
                    ))}
                  </ul>
                )}
              </article>
            </Reveal>
          ))}
        </div>
      </section>

      <section className="space-y-6">
        <h2 className="font-mono text-xs uppercase tracking-widest text-emerald-400">
          {ui.resumePage.education}
        </h2>
        {education.map((entry) => (
          <Reveal key={entry.school}>
            <article className="glass-card flex flex-col gap-1 p-6 sm:flex-row sm:items-baseline sm:justify-between">
              <div>
                <h3 className="text-lg font-semibold text-zinc-100">
                  {entry.school}
                </h3>
                <p className="text-sm text-zinc-400">
                  {entry.degree}
                  {entry.detail ? ` · ${entry.detail}` : ""}
                </p>
              </div>
              {entry.period && (
                <p className="shrink-0 font-mono text-xs uppercase tracking-widest text-zinc-500">
                  {entry.period}
                </p>
              )}
            </article>
          </Reveal>
        ))}
      </section>

      <section className="space-y-6">
        <h2 className="font-mono text-xs uppercase tracking-widest text-emerald-400">
          {ui.resumePage.skills}
        </h2>
        <div className="grid gap-5 sm:grid-cols-3">
          {skillGroups.map((group, i) => (
            <Reveal key={group.id} delay={i * 80}>
              <div className="glass-card h-full space-y-3 p-5">
                <h3 className="text-sm font-semibold text-zinc-100">
                  {group.label}
                </h3>
                <div className="flex flex-wrap gap-1.5">
                  {group.items.map((skill) => (
                    <span
                      key={skill}
                      className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-xs text-zinc-400"
                    >
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}
