import type {
  ContactId,
  ExperienceId,
  ProjectId,
  SkillGroupId,
  TimelineId,
  TimelineKind,
} from "@/lib/content/meta";

export type { TimelineKind };

export type PageKey = "projects" | "contact" | "resume" | "privacy";

/** UI chrome strings — every locale file must provide all of them. */
export type UIStrings = {
  nav: {
    home: string;
    resume: string;
    projects: string;
    contact: string;
    primaryAria: string;
  };
  footer: { privacy: string };
  home: {
    about: string;
    pathSoFar: string;
    pathHint: string;
    toolbox: string;
    featuredProjects: string;
    allProjects: string;
    viewProjects: string;
    getInTouch: string;
    ctaTitle: string;
    ctaBody: string;
    sayHello: string;
    badgeExTonal: string;
    badgeStack: string;
  };
  timeline: {
    kindLabels: Record<TimelineKind, string>;
    /** Template — "{org}" is replaced with the organization name. */
    visitOrg: string;
  };
  contactPage: { intro: string; copy: string; copied: string };
  projectsPage: { intro: string };
  resumePage: {
    /** Intro renders as: introBeforeLink <Link>introLinkLabel</Link> introAfterLink */
    introBeforeLink: string;
    introLinkLabel: string;
    introAfterLink: string;
    experience: string;
    education: string;
    skills: string;
  };
  privacyPage: {
    /** Template — "{date}" is replaced with privacy.updated. */
    lastUpdated: string;
  };
  languageToggleAria: string;
};

export type EducationItem = {
  school: string;
  degree: string;
  detail?: string;
  period?: string;
};

/** Everything a locale must translate. Record<Id, …> shapes make TypeScript
 *  error if a locale forgets an entry. */
export type Translation = {
  site: {
    role: string;
    /** Hero "I build ___" template; KO is verb-last so the verb is a suffix. */
    taglines: { prefix: string; words: readonly string[]; suffix: string };
    tagline: string;
    bio: readonly string[];
  };
  ui: UIStrings;
  metadata: Record<PageKey, { title: string; description: string }>;
  timeline: Record<
    TimelineId,
    {
      organization: string;
      role: string;
      location?: string;
      period?: string;
      summary: string;
      details: readonly string[];
      tags: readonly string[];
    }
  >;
  experience: Record<
    ExperienceId,
    {
      title: string;
      organization: string;
      location?: string;
      period?: string;
      summary: string;
      highlights: readonly string[];
    }
  >;
  education: readonly EducationItem[];
  skillGroups: Record<SkillGroupId, string>;
  /** Project descriptions; names/tags/urls are invariant in meta.ts. */
  projects: Record<ProjectId, string>;
  contact: Record<ContactId, { label: string; description: string }>;
  privacy: { title: string; updated: string; paragraphs: readonly string[] };
};

// ——— Merged shapes consumed by pages/components (meta + translation) ———

export type TimelineItem = {
  id: TimelineId;
  kind: TimelineKind;
  organizationUrl?: string;
  /** Drives the pulsing "current" dot on the timeline. */
  current: boolean;
  organization: string;
  role: string;
  location?: string;
  period?: string;
  summary: string;
  details: readonly string[];
  tags: readonly string[];
};

export type ExperienceItem = {
  id: ExperienceId;
  organizationUrl?: string;
  title: string;
  organization: string;
  location?: string;
  period?: string;
  summary: string;
  highlights: readonly string[];
};

export type ProjectItem = {
  id: ProjectId;
  name: string;
  description: string;
  tags: readonly string[];
  url: string;
  glyph: string;
  gradient: string;
};

export type ContactLink = {
  id: ContactId;
  label: string;
  value: string;
  href: string;
  description: string;
};

export type SkillGroup = {
  id: SkillGroupId;
  label: string;
  items: readonly string[];
};

export type SiteContent = {
  site: {
    name: string;
    company: string;
    companyUrl: string;
    role: string;
    taglines: { prefix: string; words: readonly string[]; suffix: string };
    tagline: string;
    bio: readonly string[];
  };
  ui: UIStrings;
  metadata: Record<PageKey, { title: string; description: string }>;
  timeline: readonly TimelineItem[];
  experience: readonly ExperienceItem[];
  education: readonly EducationItem[];
  skillGroups: readonly SkillGroup[];
  /** Flat list for the home-page skill pills. */
  skills: readonly string[];
  projects: readonly ProjectItem[];
  contactLinks: readonly ContactLink[];
  privacy: { title: string; updated: string; paragraphs: readonly string[] };
};
