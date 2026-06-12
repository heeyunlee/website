import { ArrowUpRightIcon } from "@/components/icons";
import type { ProjectItem } from "@/lib/site-content";

export function ProjectCard({ project }: { project: ProjectItem }) {
  return (
    <a
      href={project.url}
      target="_blank"
      rel="noopener noreferrer"
      data-umami-event="project-click"
      data-umami-event-project={project.name}
      className="glass-card group flex flex-col gap-4 p-5 transition duration-300 hover:-translate-y-0.5 hover:border-emerald-400/30 hover:shadow-glow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/50"
    >
      <div className="flex items-start justify-between">
        <span
          className={`flex size-12 items-center justify-center rounded-2xl bg-gradient-to-br text-2xl shadow-lg ${project.gradient}`}
          aria-hidden="true"
        >
          {project.glyph}
        </span>
        <ArrowUpRightIcon className="size-5 text-zinc-500 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-emerald-400" />
      </div>
      <div className="space-y-1.5">
        <h3 className="font-semibold text-zinc-100">{project.name}</h3>
        <p className="text-sm leading-relaxed text-zinc-400">
          {project.description}
        </p>
      </div>
      <div className="mt-auto flex flex-wrap gap-1.5">
        {project.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-full border border-white/10 bg-white/5 px-2.5 py-0.5 text-xs text-zinc-400"
          >
            {tag}
          </span>
        ))}
      </div>
    </a>
  );
}
