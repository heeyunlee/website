export type TimelineItem = {
  /** Stable id, used for aria attributes and React keys. */
  id: string;
  kind: "education" | "military" | "work";
  organization: string;
  organizationUrl?: string;
  role: string;
  location?: string;
  // TODO(heeyun): add real dates, e.g. "2023 — Present".
  period?: string;
  /** One line, always visible on the timeline. */
  summary: string;
  /** Bullets shown inside the expandable panel. */
  details: string[];
  tags?: string[];
};

export type ExperienceItem = {
  title: string;
  organization: string;
  organizationUrl?: string;
  location?: string;
  // TODO(heeyun): add real dates, e.g. "2023 — Present".
  period?: string;
  summary: string;
  highlights: string[];
};

export type EducationItem = {
  school: string;
  degree: string;
  detail?: string;
  period?: string;
};

export type ProjectItem = {
  name: string;
  description: string;
  tags: string[];
  url: string;
  /** Glyph shown on the project's "app icon". */
  glyph: string;
  /** Tailwind gradient classes for the app icon background. */
  gradient: string;
};

export type ContactLink = {
  id: "email" | "github" | "linkedin";
  label: string;
  value: string;
  href: string;
  description: string;
};

export type SkillGroup = {
  label: string;
  items: string[];
};

/** Edit this object for sitewide name, bio, and hero content. */
export const site = {
  name: "Heeyun Lee",
  role: "Software Engineer",
  company: "dub",
  companyUrl: "https://www.dubapp.com/",
  location: "New York, NY",
  /** Rotating words in the hero: "I build ___". */
  taglines: ["mobile apps", "fintech products", "fitness tech", "polished UIs"],
  tagline:
    "Software engineer in New York building mobile experiences with Flutter and Swift — currently at dub, the US's first copy-trading platform.",
  bio: [
    "I'm a software engineer who cares about the details — the kind of mobile experiences that feel fast, considered, and a little delightful. These days I build at dub, the US's first copy-trading platform, helping people invest alongside investors they trust.",
    "Before dub, I was on the mobile team at Tonal, the world's smartest home gym — a good fit, since I'm as serious about training as I am about shipping. Before tech, I served two years in the Republic of Korea Marine Corps as a Signal Corpsman, and I studied Business Analytics and Finance at Pace University. Markets, fitness, and software keep showing up in everything I make.",
  ],
} as const;

/** Career timeline on the home page; oldest first. */
export const timeline: TimelineItem[] = [
  {
    id: "pace",
    kind: "education",
    organization: "Pace University",
    role: "BBA, Business Analytics & Finance",
    location: "New York, NY",
    summary:
      "Double-majored in the two things that still shape my work: data and markets.",
    details: [
      "Double major in Business Analytics and Finance.",
      "Learned to think in models and spreadsheets before thinking in code.",
    ],
    tags: ["Analytics", "Finance"],
  },
  {
    id: "rokmc",
    kind: "military",
    organization: "Republic of Korea Marine Corps",
    role: "Signal Corpsman",
    location: "South Korea",
    summary:
      "Two years keeping communications running — where reliability stopped being optional.",
    details: [
      "Maintained communications equipment and infrastructure for two years of service.",
      "Took away a lasting respect for systems that have to work the first time.",
    ],
    tags: ["Communications", "Discipline"],
  },
  {
    id: "tonal",
    kind: "work",
    organization: "Tonal",
    organizationUrl: "https://www.tonal.com/",
    role: "Software Engineer, Mobile",
    summary: "Built mobile experiences for the world's smartest home gym.",
    details: [
      "Worked on the mobile team behind Tonal's connected strength-training experience.",
      // TODO(heeyun): add 1–2 impact bullets with real scope/metrics.
    ],
    tags: ["Swift", "Mobile"],
  },
  {
    id: "dub",
    kind: "work",
    organization: "dub",
    organizationUrl: "https://www.dubapp.com/",
    role: "Software Engineer",
    location: "New York, NY",
    period: "Present",
    summary: "Building the US's first copy-trading platform.",
    details: [
      "Building the mobile experience that lets anyone copy the trades of top investors.",
      // TODO(heeyun): add 1–2 impact bullets with real scope/metrics.
    ],
    tags: ["Flutter", "Fintech"],
  },
];

/** Resume page entries; newest first. */
export const experience: ExperienceItem[] = [
  {
    title: "Software Engineer",
    organization: "dub",
    organizationUrl: "https://www.dubapp.com/",
    location: "New York, NY",
    period: "Present",
    summary:
      "Building the mobile experience at the US's first copy-trading platform, where anyone can copy the trades of top investors.",
    // TODO(heeyun): add 2–3 impact bullets with real metrics.
    highlights: [],
  },
  {
    title: "Software Engineer, Mobile",
    organization: "Tonal",
    organizationUrl: "https://www.tonal.com/",
    summary:
      "Worked on the mobile team at Tonal, the world's smartest home gym and personal trainer.",
    // TODO(heeyun): add 2–3 impact bullets with real metrics.
    highlights: [],
  },
  {
    title: "Signal Corpsman",
    organization: "Republic of Korea Marine Corps",
    location: "South Korea",
    summary:
      "Served two years of military service maintaining communications equipment and infrastructure.",
    highlights: [],
  },
];

export const education: EducationItem[] = [
  {
    school: "Pace University",
    degree: "BBA, Business Analytics & Finance (double major)",
    detail: "New York, NY",
  },
];

export const skillGroups: SkillGroup[] = [
  { label: "Languages", items: ["Dart", "Swift", "TypeScript", "Python", "R"] },
  { label: "Frameworks", items: ["Flutter", "SwiftUI", "React", "Next.js"] },
  {
    label: "Tools & Platforms",
    items: ["Firebase", "iOS", "Android", "Plaid API", "Git"],
  },
];

/** Flat list for the home-page skill pills. */
export const skills: string[] = skillGroups.flatMap((group) => group.items);

/** Project cards on /projects; first two are featured on the home page. */
export const projects: ProjectItem[] = [
  {
    name: "cccc",
    description:
      "Expense tracker that connects to your real accounts — Flutter and Firebase, with the Plaid API syncing transactions automatically.",
    tags: ["Flutter", "Firebase", "Plaid API", "Python"],
    url: "https://github.com/heeyunlee/cccc",
    glyph: "💸",
    gradient: "from-emerald-500 to-teal-600",
  },
  {
    name: "break",
    description:
      "Workout player for iOS and Android that records workouts, nutrition, and body measurements — a training log built the way I wanted one to work.",
    tags: ["Flutter", "Dart", "iOS", "Android"],
    url: "https://github.com/heeyunlee/break",
    glyph: "🏋️",
    gradient: "from-orange-500 to-rose-600",
  },
  {
    name: "heeyunlee.com",
    description:
      "This site — a statically exported Next.js app on Firebase Hosting, with CI/CD and PR previews through GitHub Actions.",
    tags: ["Next.js", "TypeScript", "Tailwind CSS", "Firebase"],
    url: "https://github.com/heeyunlee/website",
    glyph: "🛠️",
    gradient: "from-sky-500 to-indigo-600",
  },
];

/** Contact cards on /contact. */
export const contactLinks: ContactLink[] = [
  {
    id: "email",
    label: "Email",
    value: "heeyun@heeyunlee.com",
    href: "mailto:heeyun@heeyunlee.com",
    description: "The fastest way to reach me.",
  },
  {
    id: "github",
    label: "GitHub",
    value: "github.com/heeyunlee",
    href: "https://github.com/heeyunlee",
    description: "Projects, experiments, and the code for this site.",
  },
  {
    id: "linkedin",
    label: "LinkedIn",
    value: "linkedin.com/in/heeyunlee",
    href: "https://www.linkedin.com/in/heeyunlee/",
    description: "Work history and professional updates.",
  },
];
