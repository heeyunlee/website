import Link from "next/link";
import { CareerTimeline } from "@/components/career-timeline";
import { ArrowUpRightIcon, MapPinIcon } from "@/components/icons";
import { ProjectCard } from "@/components/project-card";
import { Reveal } from "@/components/reveal";
import { RotatingTagline } from "@/components/rotating-tagline";
import { projects, site, skills, timeline } from "@/lib/site-content";

export default function Home() {
  return (
    <div className="space-y-20">
      {/* Hero */}
      <section className="relative">
        <div
          className="pointer-events-none absolute -inset-x-6 -top-24 h-72 bg-hero-glow"
          aria-hidden="true"
        />
        <div className="relative space-y-5 pt-4">
          <p className="flex items-center gap-1.5 font-mono text-xs uppercase tracking-widest text-emerald-400">
            <MapPinIcon className="size-3.5" />
            {site.role} · {site.location}
          </p>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            {site.name}
          </h1>
          <p className="text-2xl font-semibold tracking-tight text-zinc-300 sm:text-3xl">
            <RotatingTagline prefix="I build" words={site.taglines} />
          </p>
          <p className="max-w-xl leading-relaxed text-zinc-400">
            {site.tagline}
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              href="/projects"
              className="rounded-full bg-emerald-400 px-5 py-2.5 text-sm font-semibold text-zinc-950 transition hover:bg-emerald-300 hover:shadow-glow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/50"
            >
              View projects
            </Link>
            <Link
              href="/contact"
              className="glass-card rounded-full px-5 py-2.5 text-sm font-medium text-zinc-200 transition hover:border-emerald-400/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/50"
            >
              Get in touch
            </Link>
          </div>
          <div className="flex flex-wrap gap-1.5 pt-1 text-xs text-zinc-400">
            <a
              href={site.companyUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-full border border-emerald-400/30 bg-emerald-400/10 px-3 py-1 text-emerald-400 transition hover:bg-emerald-400/20"
            >
              @ {site.company}
            </a>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
              ex-Tonal
            </span>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
              Flutter · Swift
            </span>
          </div>
        </div>
      </section>

      {/* About */}
      <Reveal>
        <section className="space-y-4">
          <h2 className="font-mono text-xs uppercase tracking-widest text-emerald-400">
            About
          </h2>
          <div className="space-y-4 leading-relaxed text-zinc-400">
            {site.bio.map((paragraph) => (
              <p key={paragraph}>{paragraph}</p>
            ))}
          </div>
        </section>
      </Reveal>

      {/* Career timeline */}
      <section className="space-y-6">
        <Reveal>
          <h2 className="font-mono text-xs uppercase tracking-widest text-emerald-400">
            The path so far
          </h2>
          <p className="mt-2 text-sm text-zinc-500">
            Tap an entry for the details.
          </p>
        </Reveal>
        <CareerTimeline items={timeline} />
      </section>

      {/* Skills */}
      <Reveal>
        <section className="space-y-5">
          <h2 className="font-mono text-xs uppercase tracking-widest text-emerald-400">
            Toolbox
          </h2>
          <div className="flex flex-wrap gap-2">
            {skills.map((skill) => (
              <span
                key={skill}
                className="rounded-full border border-white/10 bg-white/5 px-3.5 py-1.5 text-sm text-zinc-300 transition-colors hover:border-emerald-400/30 hover:text-emerald-400"
              >
                {skill}
              </span>
            ))}
          </div>
        </section>
      </Reveal>

      {/* Featured projects */}
      <section className="space-y-6">
        <Reveal>
          <div className="flex items-baseline justify-between">
            <h2 className="font-mono text-xs uppercase tracking-widest text-emerald-400">
              Featured projects
            </h2>
            <Link
              href="/projects"
              className="inline-flex items-center gap-1 text-sm text-zinc-400 transition-colors hover:text-emerald-400"
            >
              All projects
              <ArrowUpRightIcon className="size-4" />
            </Link>
          </div>
        </Reveal>
        <div className="grid gap-5 sm:grid-cols-2">
          {projects.slice(0, 2).map((project, i) => (
            <Reveal key={project.name} delay={i * 100}>
              <ProjectCard project={project} />
            </Reveal>
          ))}
        </div>
      </section>

      {/* Contact CTA */}
      <Reveal>
        <section className="glass-card flex flex-col items-start justify-between gap-4 p-6 sm:flex-row sm:items-center sm:p-8">
          <div>
            <h2 className="text-lg font-semibold text-zinc-100">
              Have an idea, or just want to talk shop?
            </h2>
            <p className="mt-1 text-sm text-zinc-400">
              I&apos;m always up for a good conversation about apps, markets, or
              training.
            </p>
          </div>
          <Link
            href="/contact"
            className="shrink-0 rounded-full bg-emerald-400 px-5 py-2.5 text-sm font-semibold text-zinc-950 transition hover:bg-emerald-300 hover:shadow-glow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/50"
          >
            Say hello
          </Link>
        </section>
      </Reveal>
    </div>
  );
}
