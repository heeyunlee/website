import type { Metadata } from "next";
import { AnimatedText } from "@/components/animated-text";
import { ProjectCard } from "@/components/project-card";
import { Reveal } from "@/components/reveal";
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
    title: metadata.projects.title,
    description: metadata.projects.description,
    alternates: buildAlternates(locale, "/projects"),
  };
}

export default async function Projects({ params }: { params: LocaleParams }) {
  const locale = await resolveLocale(params);
  const { metadata, ui, projects } = getContent(locale);

  return (
    <div className="space-y-10">
      <section className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">
          <AnimatedText id="projects-title" text={metadata.projects.title} />
        </h1>
        <p className="max-w-xl leading-relaxed text-zinc-400">
          <AnimatedText mode="fade" text={ui.projectsPage.intro} />
        </p>
      </section>

      <section className="grid gap-5 sm:grid-cols-2">
        {projects.map((project, i) => (
          <Reveal key={project.id} delay={(i % 2) * 100} className="h-full">
            <ProjectCard project={project} />
          </Reveal>
        ))}
      </section>
    </div>
  );
}
