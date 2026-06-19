"use client";

import { AnimatedText } from "@/components/animated-text";
import { CopyEmailButton } from "@/components/copy-email-button";
import {
  ArrowUpRightIcon,
  GitHubIcon,
  LinkedInIcon,
  MailIcon,
} from "@/components/icons";
import { Reveal } from "@/components/reveal";
import type { ContactLink } from "@/lib/content/types";
import { useContent } from "@/lib/i18n/locale-context";

const CONTACT_ICONS: Record<ContactLink["id"], typeof GitHubIcon> = {
  email: MailIcon,
  github: GitHubIcon,
  linkedin: LinkedInIcon,
};

export function ContactView() {
  const { metadata, ui, contactLinks } = useContent();
  const email = contactLinks.find((link) => link.id === "email");
  const others = contactLinks.filter((link) => link.id !== "email");

  return (
    <div className="space-y-10">
      <section className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">
          <AnimatedText text={metadata.contact.title} />
        </h1>
        <p className="max-w-xl leading-relaxed text-zinc-400">
          <AnimatedText mode="fade" text={ui.contactPage.intro} />
        </p>
      </section>

      {email && (
        <Reveal>
          <section className="glass-card space-y-4 p-6 sm:p-8">
            <div className="flex items-center gap-3">
              <span className="flex size-11 items-center justify-center rounded-2xl bg-emerald-400/15 text-emerald-400 ring-1 ring-emerald-400/30">
                <MailIcon className="size-5" />
              </span>
              <div>
                <h2 className="font-semibold text-zinc-100">
                  <AnimatedText text={email.label} />
                </h2>
                <p className="text-sm text-zinc-400">
                  <AnimatedText mode="fade" text={email.description} />
                </p>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-3">
              <a
                href={email.href}
                data-umami-event="contact-click"
                data-umami-event-channel="email"
                className="font-mono text-base text-emerald-400 underline decoration-emerald-400/40 underline-offset-4 hover:decoration-emerald-400 sm:text-lg"
              >
                {email.value}
              </a>
              <CopyEmailButton
                email={email.value}
                labels={{
                  copy: ui.contactPage.copy,
                  copied: ui.contactPage.copied,
                }}
              />
            </div>
          </section>
        </Reveal>
      )}

      <section className="grid gap-5 sm:grid-cols-2">
        {others.map((link, i) => {
          const Icon = CONTACT_ICONS[link.id];
          return (
            <Reveal key={link.id} delay={i * 100} className="h-full">
              <a
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                data-umami-event="contact-click"
                data-umami-event-channel={link.id}
                className="glass-card group flex h-full items-start gap-3 p-6 transition duration-300 hover:-translate-y-0.5 hover:border-emerald-400/30 hover:shadow-glow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/50"
              >
                <span className="flex size-11 shrink-0 items-center justify-center rounded-2xl bg-white/5 text-zinc-300 ring-1 ring-white/10">
                  <Icon className="size-5" />
                </span>
                <span className="min-w-0">
                  <span className="flex items-center gap-1 font-semibold text-zinc-100">
                    {link.label}
                    <ArrowUpRightIcon className="size-4 text-zinc-500 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-emerald-400" />
                  </span>
                  <span className="mt-0.5 block truncate font-mono text-sm text-zinc-400">
                    {link.value}
                  </span>
                  <span className="mt-1.5 block text-sm text-zinc-500">
                    <AnimatedText mode="fade" text={link.description} />
                  </span>
                </span>
              </a>
            </Reveal>
          );
        })}
      </section>
    </div>
  );
}
