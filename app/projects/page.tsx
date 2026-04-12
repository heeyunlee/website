import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Projects — Heeyun Lee",
  description: "Projects and work by Heeyun Lee",
};

const projects = [
  {
    name: "Project One",
    description: "A brief description of what this project does and the problem it solves.",
    tags: ["TypeScript", "React"],
    url: "#",
  },
  {
    name: "Project Two",
    description: "A brief description of what this project does and the problem it solves.",
    tags: ["Next.js", "Firebase"],
    url: "#",
  },
];

export default function Projects() {
  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-4xl font-bold tracking-tight mb-4">Projects</h1>
        <p className="text-lg text-gray-600">
          A selection of things I&apos;ve built.
        </p>
      </section>

      <section className="space-y-6">
        {projects.map((project) => (
          <a
            key={project.name}
            href={project.url}
            className="block p-6 border border-gray-200 rounded-lg hover:border-gray-400 transition-colors group"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="space-y-2">
                <h2 className="font-semibold group-hover:underline">
                  {project.name}
                </h2>
                <p className="text-sm text-gray-600">{project.description}</p>
                <div className="flex gap-2 flex-wrap">
                  {project.tags.map((tag) => (
                    <span
                      key={tag}
                      className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
              <span className="text-gray-400 group-hover:text-gray-900 transition-colors shrink-0">
                →
              </span>
            </div>
          </a>
        ))}
      </section>
    </div>
  );
}
