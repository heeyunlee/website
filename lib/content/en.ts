import type { Translation } from "@/lib/content/types";

export const en: Translation = {
  site: {
    role: "Senior Software Engineer",
    taglines: {
      prefix: "I build",
      words: [
        "mobile apps",
        "fintech products",
        "fitness tech",
        "polished UIs",
      ],
      suffix: "",
    },
    tagline:
      "Software engineer building mobile experiences with Flutter and Swift — currently at dub, the US's first copy-trading platform.",
    bio: [
      "I'm a software engineer who cares about the details — the kind of mobile experiences that feel fast, considered, and a little delightful. These days I build at dub, the US's first copy-trading platform, helping people invest alongside investors they trust.",
      "Before dub, I was on the mobile team at Tonal, the world's smartest home gym — a good fit, since I'm as serious about training as I am about shipping. Before tech, I served two years in the Republic of Korea Marine Corps as a Signal Corpsman, and I studied Business Analytics and Finance at Pace University. Markets, fitness, and software keep showing up in everything I make.",
    ],
  },
  ui: {
    nav: {
      home: "Home",
      resume: "Resume",
      projects: "Projects",
      contact: "Contact",
      primaryAria: "Primary",
    },
    footer: { privacy: "privacy" },
    home: {
      about: "About",
      pathSoFar: "The path so far",
      pathHint: "Tap an entry for the details.",
      toolbox: "Toolbox",
      featuredProjects: "Featured projects",
      allProjects: "All projects",
      viewProjects: "View projects",
      getInTouch: "Get in touch",
      ctaTitle: "Have an idea, or just want to talk shop?",
      ctaBody:
        "I'm always up for a good conversation about apps, markets, or training.",
      sayHello: "Say hello",
      badgeExTonal: "ex-Tonal",
      badgeStack: "Flutter · Swift",
    },
    timeline: {
      kindLabels: { education: "Education", military: "Service", work: "Work" },
      visitOrg: "Visit {org}",
    },
    contactPage: {
      intro:
        "The best way to reach me is by email — I'm also on a few other platforms.",
      copy: "Copy",
      copied: "Copied!",
    },
    projectsPage: {
      intro:
        "Things I've built outside of work — mostly where fintech, fitness, and mobile meet. Each card links to the code.",
    },
    resumePage: {
      introBeforeLink:
        "A concise history of my professional roles. For full details or references, reach out via ",
      introLinkLabel: "contact",
      introAfterLink: ".",
      experience: "Experience",
      education: "Education",
      skills: "Skills",
    },
    privacyPage: { lastUpdated: "Last updated {date}" },
    languageToggleAria: "Language",
  },
  metadata: {
    projects: {
      title: "Projects",
      description: "Projects and work by Heeyun Lee",
    },
    contact: { title: "Contact", description: "Get in touch with Heeyun Lee" },
    resume: {
      title: "Resume",
      description: "Work experience and background for Heeyun Lee",
    },
    privacy: {
      title: "Privacy",
      description: "How Heeyun Lee's site handles analytics and your privacy.",
    },
  },
  timeline: {
    pace: {
      organization: "Pace University",
      role: "BBA, Business Analytics & Finance",
      location: "New York, NY",
      summary:
        "Double-majored in the two things that still shape my work: data and markets.",
      details: [
        "Double major in Business Analytics and Finance; graduated summa cum laude.",
        "Learned to think in models and spreadsheets before thinking in code.",
      ],
      tags: ["Analytics", "Finance"],
    },
    rokmc: {
      organization: "Republic of Korea Marine Corps",
      role: "Signal Corpsman",
      location: "South Korea",
      period: "2018 — 2020",
      summary:
        "Two years keeping communications running — where reliability stopped being optional.",
      details: [
        "Maintained communications equipment and infrastructure for two years of service.",
        "Served as a Sergeant and Squad Leader, responsible for an 8-member squad.",
        "Took away a lasting respect for systems that have to work the first time.",
      ],
      tags: ["Communications", "Leadership"],
    },
    tonal: {
      organization: "Tonal",
      role: "Software Engineer, Mobile",
      period: "2022 — 2023",
      summary: "Built mobile experiences for the world's smartest home gym.",
      details: [
        "Migrated the mobile app's networking from REST to GraphQL, cutting payload sizes by 99% and making key screens 50% faster.",
        "Drove a 400% increase in App Store reviews by analyzing user behavior to find the right moments to ask.",
      ],
      tags: ["Swift", "Mobile"],
    },
    dub: {
      organization: "dub",
      role: "Senior Software Engineer",
      period: "2023 — Present",
      summary: "Building the US's first copy-trading platform.",
      details: [
        "Spearheaded the launch of dub's app on the App Store from scratch, coordinating across engineering, compliance, design, and operations.",
        "Built the leaderboard that helped validate the copy-trading marketplace.",
        "Implemented KYC and identity verification, partnering with compliance and operations teams.",
        "Promoted to Senior Software Engineer in 2026.",
      ],
      tags: ["Flutter", "Fintech"],
    },
  },
  experience: {
    dub: {
      title: "Senior Software Engineer",
      organization: "dub",
      period: "2023 — Present",
      summary:
        "Building the mobile experience at the US's first copy-trading platform, where anyone can copy the trades of top investors. Promoted to Senior Software Engineer in 2026.",
      highlights: [
        "Spearheaded the launch of dub's app on the App Store from scratch, coordinating across engineering, compliance, design, and operations at a seed-stage startup.",
        "Built the leaderboard feature that helped validate the copy-trading marketplace.",
        "Implemented KYC and identity verification in the iOS app, translating technical constraints for compliance and operations stakeholders.",
        "Introduced a feature-flag system to de-risk releases.",
      ],
    },
    tonal: {
      title: "Software Engineer, Mobile",
      organization: "Tonal",
      period: "2022 — 2023",
      summary:
        "Worked on the mobile team at Tonal, the world's smartest home gym and personal trainer.",
      highlights: [
        "Migrated the mobile app's networking from REST to GraphQL, cutting payload sizes by 99% and making key screens 50% faster.",
        "Drove a 400% increase in App Store reviews by analyzing user behavior to find the right moments to prompt.",
      ],
    },
    rokmc: {
      title: "Signal Corpsman",
      organization: "Republic of Korea Marine Corps",
      location: "South Korea",
      period: "2018 — 2020",
      summary:
        "Served two years of military service maintaining communications equipment and infrastructure.",
      highlights: [
        "Served as a Sergeant and Squad Leader, responsible for an 8-member squad.",
      ],
    },
  },
  education: [
    {
      school: "Pace University",
      degree:
        "BBA, Business Analytics & Finance (double major), summa cum laude",
      detail: "New York, NY",
    },
  ],
  skillGroups: {
    languages: "Languages",
    frameworks: "Frameworks",
    tools: "Tools & Platforms",
  },
  projects: {
    cccc: "Expense tracker that connects to your real accounts — Flutter and Firebase, with the Plaid API syncing transactions automatically.",
    break:
      "Workout player for iOS and Android that records workouts, nutrition, and body measurements — a training log built the way I wanted one to work.",
    website:
      "This site — a statically exported Next.js app on Firebase Hosting, with CI/CD and PR previews through GitHub Actions.",
  },
  contact: {
    email: { label: "Email", description: "The fastest way to reach me." },
    github: {
      label: "GitHub",
      description: "Projects, experiments, and the code for this site.",
    },
    linkedin: {
      label: "LinkedIn",
      description: "Work history and professional updates.",
    },
  },
  privacy: {
    title: "Privacy",
    updated: "June 2026",
    paragraphs: [
      "This site uses Umami, a privacy-friendly analytics tool, to understand how the site is used — things like which pages are visited, where visitors come from, and what country, browser, and device type they're on.",
      "Umami is cookieless and collects no personal data. There's no fingerprinting, no cross-site tracking, and nothing that identifies you individually — all data is anonymous and aggregate. Because of this, no cookie consent banner is needed.",
      "If you have any questions about this, feel free to email me.",
    ],
  },
};
