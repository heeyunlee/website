/**
 * Locale-invariant content data: ids, ordering, URLs, tech tags, glyphs,
 * gradients. Defined exactly once; per-locale strings live in en/ko/fr.ts
 * and are merged in index.ts.
 */

export type TimelineKind = "education" | "military" | "work";

export const siteMeta = {
  name: "Heeyun Lee",
  company: "dub",
  companyUrl: "https://www.dubapp.com/",
} as const;

export const timelineOrder = ["pace", "rokmc", "tonal", "dub"] as const;
export type TimelineId = (typeof timelineOrder)[number];

export const timelineMeta: Record<
  TimelineId,
  { kind: TimelineKind; organizationUrl?: string; current?: boolean }
> = {
  pace: { kind: "education" },
  rokmc: { kind: "military" },
  tonal: { kind: "work", organizationUrl: "https://www.tonal.com/" },
  dub: {
    kind: "work",
    organizationUrl: "https://www.dubapp.com/",
    current: true,
  },
};

export const experienceOrder = ["dub", "tonal", "rokmc"] as const;
export type ExperienceId = (typeof experienceOrder)[number];

export const experienceMeta: Record<
  ExperienceId,
  { organizationUrl?: string }
> = {
  dub: { organizationUrl: "https://www.dubapp.com/" },
  tonal: { organizationUrl: "https://www.tonal.com/" },
  rokmc: {},
};

export const projectOrder = ["cccc", "break", "website"] as const;
export type ProjectId = (typeof projectOrder)[number];

export const projectMeta: Record<
  ProjectId,
  {
    name: string;
    tags: readonly string[];
    url: string;
    /** Glyph shown on the project's "app icon". */
    glyph: string;
    /** Tailwind gradient classes for the app icon background. */
    gradient: string;
  }
> = {
  cccc: {
    name: "cccc",
    tags: ["Flutter", "Firebase", "Plaid API", "Python"],
    url: "https://github.com/heeyunlee/cccc",
    glyph: "💸",
    gradient: "from-emerald-500 to-teal-600",
  },
  break: {
    name: "break",
    tags: ["Flutter", "Dart", "iOS", "Android"],
    url: "https://github.com/heeyunlee/break",
    glyph: "🏋️",
    gradient: "from-orange-500 to-rose-600",
  },
  website: {
    name: "heeyunlee.com",
    tags: ["Next.js", "TypeScript", "Tailwind CSS", "Firebase"],
    url: "https://github.com/heeyunlee/website",
    glyph: "🛠️",
    gradient: "from-sky-500 to-indigo-600",
  },
};

export const contactOrder = ["email", "github", "linkedin"] as const;
export type ContactId = (typeof contactOrder)[number];

export const contactMeta: Record<ContactId, { value: string; href: string }> = {
  email: {
    value: "heeyun@heeyunlee.com",
    href: "mailto:heeyun@heeyunlee.com",
  },
  github: {
    value: "github.com/heeyunlee",
    href: "https://github.com/heeyunlee",
  },
  linkedin: {
    value: "linkedin.com/in/heeyunlee",
    href: "https://www.linkedin.com/in/heeyunlee/",
  },
};

export const skillGroupOrder = ["languages", "frameworks", "tools"] as const;
export type SkillGroupId = (typeof skillGroupOrder)[number];

export const skillGroupMeta: Record<
  SkillGroupId,
  { items: readonly string[] }
> = {
  languages: { items: ["Dart", "Swift", "TypeScript", "Python", "R"] },
  frameworks: { items: ["Flutter", "SwiftUI", "React", "Next.js"] },
  tools: { items: ["Firebase", "iOS", "Android", "Plaid API", "Git"] },
};
