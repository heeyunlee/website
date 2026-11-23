"use client";

import Image from "next/image";
import Link from "next/link";
import { AnimatedText } from "@/components/animated-text";
import { CareerTimeline } from "@/components/career-timeline";
import { ArrowUpRightIcon } from "@/components/icons";
import { ProjectCard } from "@/components/project-card";
import { Reveal } from "@/components/reveal";
import { RotatingTagline } from "@/components/rotating-tagline";
import { useContent } from "@/lib/i18n/locale-context";

export default function Home() {
  const { site, ui, timeline, skills, projects } = useContent();

  return (
    <div className="space-y-20">
      {/* Hero */}
      <section className="relative">
        <div
          className="pointer-events-none absolute -inset-x-6 -top-24 h-72 bg-hero-glow"
          aria-hidden="true"
        />
        <div className="relative space-y-5 pt-4">
          <p className="font-mono text-xs uppercase tracking-widest text-emerald-400">
            <AnimatedText text={site.role} />
          </p>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
            {site.name}
          </h1>
          <p className="text-2xl font-semibold tracking-tight text-zinc-300 sm:text-3xl">
            <RotatingTagline
              prefix={site.taglines.prefix}
              words={site.taglines.words}
              suffix={site.taglines.suffix}
            />
          </p>
          <p className="max-w-xl leading-relaxed text-zinc-400">
            <AnimatedText mode="fade" text={site.tagline} />
          </p>
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              href="/projects"
              className="rounded-full bg-emerald-400 px-5 py-2.5 text-sm font-semibold text-zinc-950 transition hover:bg-emerald-300 hover:shadow-glow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/50"
            >
              <AnimatedText text={ui.home.viewProjects} />
            </Link>
            <Link
              href="/contact"
              className="glass-card rounded-full px-5 py-2.5 text-sm font-medium text-zinc-200 transition hover:border-emerald-400/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/50"
            >
              <AnimatedText text={ui.home.getInTouch} />
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
              {ui.home.badgeExTonal}
            </span>
            <span className="rounded-full border border-white/10 bg-white/5 px-3 py-1">
              {ui.home.badgeStack}
            </span>
          </div>
        </div>
      </section>

      {/* Étretat: the way in to the Canvas */}
      <Reveal>
        <Link
          href="/etretat"
          data-umami-event="home-etretat-card"
          className="glass-card group grid overflow-hidden transition hover:border-emerald-400/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/50 sm:grid-cols-[1.15fr_1fr]"
        >
          {/* The Photo, with the Painting brushed in from the right. */}
          <div className="relative aspect-[2560/1888] overflow-hidden">
            <Image
              src="/etretat/card-photo.jpg"
              alt=""
              fill
              sizes="(min-width: 640px) 400px, 100vw"
              className="object-cover"
            />
            <Image
              src="/etretat/card-painting.jpg"
              alt=""
              fill
              sizes="(min-width: 640px) 400px, 100vw"
              className="object-cover transition-[clip-path] duration-700 ease-out [clip-path:polygon(62%_0,100%_0,100%_100%,44%_100%)] group-hover:[clip-path:polygon(12%_0,100%_0,100%_100%,-6%_100%)]"
            />
          </div>
          <div className="flex flex-col justify-center gap-2 p-6">
            <p className="font-mono text-xs uppercase tracking-widest text-emerald-400">
              <AnimatedText text={ui.home.etretatCardKicker} />
            </p>
            <h2 className="text-xl font-semibold tracking-tight">
              <AnimatedText text={ui.home.etretatCardTitle} />
            </h2>
            <p className="text-sm leading-relaxed text-zinc-400">
              <AnimatedText mode="fade" text={ui.home.etretatCardBody} />
            </p>
            <p className="flex items-center gap-1 pt-1 text-sm font-medium text-emerald-400">
              <AnimatedText text={ui.home.etretatCardCta} />
              <ArrowUpRightIcon className="size-4 transition-transform group-hover:-translate-y-0.5 group-hover:translate-x-0.5" />
            </p>
          </div>
        </Link>
      </Reveal>

      {/* About */}
      <Reveal>
        <section className="space-y-4">
          <h2 className="font-mono text-xs uppercase tracking-widest text-emerald-400">
            <AnimatedText text={ui.home.about} />
          </h2>
          <div className="space-y-4 leading-relaxed text-zinc-400">
            {site.bio.map((paragraph) => (
              <p key={paragraph}>
                <AnimatedText mode="fade" text={paragraph} />
              </p>
            ))}
          </div>
        </section>
      </Reveal>

      {/* Career timeline */}
      <section className="space-y-6">
        <Reveal>
          <h2 className="font-mono text-xs uppercase tracking-widest text-emerald-400">
            <AnimatedText text={ui.home.pathSoFar} />
          </h2>
          <p className="mt-2 text-sm text-zinc-500">
            <AnimatedText mode="fade" text={ui.home.pathHint} />
          </p>
        </Reveal>
        <CareerTimeline items={timeline} labels={ui.timeline} />
      </section>

      {/* Skills */}
      <Reveal>
        <section className="space-y-5">
          <h2 className="font-mono text-xs uppercase tracking-widest text-emerald-400">
            <AnimatedText text={ui.home.toolbox} />
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
              <AnimatedText text={ui.home.featuredProjects} />
            </h2>
            <Link
              href="/projects"
              className="inline-flex items-center gap-1 text-sm text-zinc-400 transition-colors hover:text-emerald-400"
            >
              <AnimatedText text={ui.home.allProjects} />
              <ArrowUpRightIcon className="size-4" />
            </Link>
          </div>
        </Reveal>
        <div className="grid gap-5 sm:grid-cols-2">
          {projects.slice(0, 2).map((project, i) => (
            <Reveal key={project.id} delay={i * 100}>
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
              <AnimatedText mode="fade" text={ui.home.ctaTitle} />
            </h2>
            <p className="mt-1 text-sm text-zinc-400">
              <AnimatedText mode="fade" text={ui.home.ctaBody} />
            </p>
          </div>
          <Link
            href="/contact"
            className="shrink-0 rounded-full bg-emerald-400 px-5 py-2.5 text-sm font-semibold text-zinc-950 transition hover:bg-emerald-300 hover:shadow-glow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/50"
          >
            <AnimatedText text={ui.home.sayHello} />
          </Link>
        </section>
      </Reveal>
    </div>
  );
}
