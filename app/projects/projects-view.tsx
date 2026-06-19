"use client";

import { AnimatedText } from "@/components/animated-text";
import { ProjectCard } from "@/components/project-card";
import { Reveal } from "@/components/reveal";
import { useContent } from "@/lib/i18n/locale-context";

export function ProjectsView() {
  const { metadata, ui, projects } = useContent();

  return (
    <div className="space-y-10">
      <section className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">
          <AnimatedText text={metadata.projects.title} />
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
