import type { Metadata } from "next";
import { ProjectCard } from "@/components/project-card";
import { Reveal } from "@/components/reveal";
import { projects, site } from "@/lib/site-content";

export const metadata: Metadata = {
  title: "Projects",
  description: `Projects and work by ${site.name}`,
};

export default function Projects() {
  return (
    <div className="space-y-10">
      <section className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Projects</h1>
        <p className="max-w-xl leading-relaxed text-zinc-400">
          Things I&apos;ve built outside of work — mostly where fintech,
          fitness, and mobile meet. Each card links to the code.
        </p>
      </section>

      <section className="grid gap-5 sm:grid-cols-2">
        {projects.map((project, i) => (
          <Reveal key={project.name} delay={(i % 2) * 100} className="h-full">
            <ProjectCard project={project} />
          </Reveal>
        ))}
      </section>
    </div>
  );
}
