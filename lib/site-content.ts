export type ExperienceItem = {
  title: string;
  organization: string;
  location?: string;
  period: string;
  summary: string;
  highlights: string[];
};

export type ProjectItem = {
  name: string;
  description: string;
  tags: string[];
  url: string;
};

export type ContactLink = {
  label: string;
  value: string;
  href: string;
};

/** Edit this object for sitewide name, bio, and home “focus” bullets. */
export const site = {
  name: "Heeyun Lee",
  /** Shown on the home hero; replace with your one-liner. */
  tagline:
    "Developer passionate about building great products and experiences.",
  /** One or more paragraphs; add/remove strings as needed. */
  bio: [
    "Welcome to my personal website. I work on products I care about and enjoy turning ideas into reliable software.",
    "When I am not coding, I explore new tools and side projects. Replace this paragraph with your own story.",
  ],
  /** Bullets under “What I do” on the home page. */
  focusAreas: [
    "Software development",
    "Building web and mobile applications",
    "Open source and collaborative work",
  ],
} as const;

/** Replace with your roles; order is newest first. */
export const experience: ExperienceItem[] = [
  {
    title: "Senior Software Engineer",
    organization: "Example Company",
    location: "San Francisco, CA",
    period: "2022 — Present",
    summary:
      "Lead feature work across web clients and APIs. Replace with your real impact in one sentence.",
    highlights: [
      "Shipped a customer-facing workflow that reduced time-to-complete by a measurable margin (add your metric).",
      "Mentored junior engineers and improved team practices around code review and testing.",
    ],
  },
  {
    title: "Software Engineer",
    organization: "Previous Org",
    location: "Remote",
    period: "2019 — 2022",
    summary:
      "Full-stack development on a product used by internal and external users.",
    highlights: [
      "Owned modules in TypeScript/React and integrated third-party APIs.",
      "Partnered with design on accessibility and responsive layouts.",
    ],
  },
  {
    title: "Intern / Junior Developer",
    organization: "Starter Studio",
    period: "Summer 2018",
    summary: "Early experience shipping small features and fixing bugs in production.",
    highlights: [
      "Contributed to bug fixes and documentation under senior guidance.",
    ],
  },
];

/** Project cards on /projects; set url to live demo, repo, or “#” until ready. */
export const projects: ProjectItem[] = [
  {
    name: "Project One",
    description:
      "A brief description of what this project does and the problem it solves.",
    tags: ["TypeScript", "React"],
    url: "#",
  },
  {
    name: "Project Two",
    description:
      "A brief description of what this project does and the problem it solves.",
    tags: ["Next.js", "Firebase"],
    url: "#",
  },
];

/** Contact row labels and URLs on /contact. */
export const contactLinks: ContactLink[] = [
  {
    label: "Email",
    value: "hello@heeyunlee.com",
    href: "mailto:hello@heeyunlee.com",
  },
  {
    label: "GitHub",
    value: "github.com/heeyunlee",
    href: "https://github.com/heeyunlee",
  },
  {
    label: "LinkedIn",
    value: "linkedin.com/in/heeyunlee",
    href: "https://linkedin.com/in/heeyunlee",
  },
];
