import type { Translation } from "@/lib/content/types";

/**
 * French (professional first-person). Content rules apply to every locale:
 * never publish a current location, never publish dub's financial metrics.
 */
export const fr: Translation = {
  site: {
    role: "Ingénieur logiciel senior",
    taglines: {
      prefix: "Je crée",
      words: [
        "des apps mobiles",
        "des produits fintech",
        "de la fitness tech",
        "des UI soignées",
      ],
      suffix: "",
    },
    tagline:
      "Ingénieur logiciel, je crée des expériences mobiles avec Flutter et Swift — actuellement chez dub, la première plateforme de copy trading aux États-Unis.",
    bio: [
      "Je suis un ingénieur logiciel attaché aux détails — ces expériences mobiles rapides, réfléchies et un brin réjouissantes. Aujourd'hui, je construis chez dub, la première plateforme de copy trading aux États-Unis, pour aider chacun à investir aux côtés d'investisseurs de confiance.",
      "Avant dub, j'étais dans l'équipe mobile de Tonal, la salle de sport connectée la plus intelligente au monde — un bon terrain, car je prends l'entraînement aussi au sérieux que la mise en production. Avant la tech, j'ai servi deux ans dans le corps des Marines de la République de Corée comme opérateur transmissions, et j'ai étudié l'analytique d'affaires et la finance à Pace University. Les marchés, le sport et le logiciel se retrouvent dans tout ce que je crée.",
    ],
  },
  ui: {
    nav: {
      home: "Accueil",
      resume: "CV",
      projects: "Projets",
      contact: "Contact",
      primaryAria: "Navigation principale",
    },
    footer: { privacy: "confidentialité" },
    home: {
      about: "À propos",
      pathSoFar: "Le parcours",
      pathHint: "Touchez une étape pour voir les détails.",
      toolbox: "Boîte à outils",
      featuredProjects: "Projets phares",
      allProjects: "Tous les projets",
      viewProjects: "Voir les projets",
      getInTouch: "Me contacter",
      ctaTitle: "Une idée, ou simplement envie de parler métier ?",
      ctaBody:
        "Toujours partant pour une bonne conversation sur les apps, les marchés ou l'entraînement.",
      sayHello: "Dire bonjour",
      badgeExTonal: "ex-Tonal",
      badgeStack: "Flutter · Swift",
    },
    timeline: {
      kindLabels: { education: "Études", military: "Service", work: "Travail" },
      visitOrg: "Visiter {org}",
    },
    contactPage: {
      intro:
        "Le meilleur moyen de me joindre est l'e-mail — je suis aussi sur quelques autres plateformes.",
      copy: "Copier",
      copied: "Copié !",
    },
    projectsPage: {
      intro:
        "Ce que je construis en dehors du travail — souvent au croisement de la fintech, du fitness et du mobile. Chaque carte mène au code.",
    },
    resumePage: {
      introBeforeLink:
        "Un historique concis de mes expériences professionnelles. Pour plus de détails ou des références, passez par la page ",
      introLinkLabel: "contact",
      introAfterLink: ".",
      experience: "Expérience",
      education: "Formation",
      skills: "Compétences",
    },
    privacyPage: { lastUpdated: "Dernière mise à jour : {date}" },
    languageToggleAria: "Langue",
  },
  metadata: {
    projects: {
      title: "Projets",
      description: "Projets et réalisations de Heeyun Lee",
    },
    contact: { title: "Contact", description: "Contacter Heeyun Lee" },
    resume: {
      title: "CV",
      description: "Expérience professionnelle et parcours de Heeyun Lee",
    },
    privacy: {
      title: "Confidentialité",
      description: "Comment ce site gère l'analytique et votre vie privée.",
    },
  },
  timeline: {
    pace: {
      organization: "Pace University",
      role: "BBA, analytique d'affaires & finance",
      location: "New York, NY",
      summary:
        "Une double spécialisation dans ce qui façonne encore mon travail : les données et les marchés.",
      details: [
        "Double majeure en analytique d'affaires et finance, diplômé summa cum laude.",
        "J'ai appris à penser en modèles et en tableurs avant de penser en code.",
      ],
      tags: ["Analytique", "Finance"],
    },
    rokmc: {
      organization: "Corps des Marines de la République de Corée",
      role: "Opérateur transmissions",
      location: "Corée du Sud",
      period: "2018 — 2020",
      summary:
        "Deux ans à faire tourner les communications — là où la fiabilité a cessé d'être optionnelle.",
      details: [
        "Maintenance des équipements et de l'infrastructure de communication pendant deux ans de service.",
        "Sergent et chef d'escouade, responsable d'une équipe de huit personnes.",
        "J'en ai gardé un respect durable pour les systèmes qui doivent fonctionner du premier coup.",
      ],
      tags: ["Communications", "Leadership"],
    },
    tonal: {
      organization: "Tonal",
      role: "Ingénieur logiciel, mobile",
      period: "2022 — 2023",
      summary:
        "Des expériences mobiles pour la salle de sport connectée la plus intelligente au monde.",
      details: [
        "Migration du réseau de l'app mobile de REST vers GraphQL : payloads réduits de 99 %, écrans clés 50 % plus rapides.",
        "Hausse de 400 % des avis App Store grâce à l'analyse du comportement utilisateur pour trouver le bon moment.",
      ],
      tags: ["Swift", "Mobile"],
    },
    dub: {
      organization: "dub",
      role: "Ingénieur logiciel senior",
      period: "2023 — aujourd'hui",
      summary:
        "Je construis la première plateforme de copy trading aux États-Unis.",
      details: [
        "Lancement de l'app dub sur l'App Store en partant de zéro, en coordination avec l'ingénierie, la conformité, le design et les opérations.",
        "Création du leaderboard qui a permis de valider la marketplace de copy trading.",
        "Implémentation du KYC et de la vérification d'identité avec les équipes conformité et opérations.",
        "Promu ingénieur logiciel senior en 2026.",
      ],
      tags: ["Flutter", "Fintech"],
    },
  },
  experience: {
    dub: {
      title: "Ingénieur logiciel senior",
      organization: "dub",
      period: "2023 — aujourd'hui",
      summary:
        "Je construis l'expérience mobile de la première plateforme de copy trading aux États-Unis, où chacun peut copier les trades des meilleurs investisseurs. Promu ingénieur logiciel senior en 2026.",
      highlights: [
        "Lancement de l'app dub sur l'App Store en partant de zéro, en coordination avec l'ingénierie, la conformité, le design et les opérations dans une startup en phase d'amorçage.",
        "Création du leaderboard qui a permis de valider la marketplace de copy trading.",
        "Implémentation du KYC et de la vérification d'identité dans l'app iOS, en traduisant les contraintes techniques pour les équipes conformité et opérations.",
        "Mise en place d'un système de feature flags pour fiabiliser les releases.",
      ],
    },
    tonal: {
      title: "Ingénieur logiciel, mobile",
      organization: "Tonal",
      period: "2022 — 2023",
      summary:
        "Au sein de l'équipe mobile de Tonal, la salle de sport connectée et coach personnel la plus intelligente au monde.",
      highlights: [
        "Migration du réseau de l'app mobile de REST vers GraphQL : payloads réduits de 99 %, écrans clés 50 % plus rapides.",
        "Hausse de 400 % des avis App Store grâce à l'analyse du comportement utilisateur pour trouver le bon moment.",
      ],
    },
    rokmc: {
      title: "Opérateur transmissions",
      organization: "Corps des Marines de la République de Corée",
      location: "Corée du Sud",
      period: "2018 — 2020",
      summary:
        "Deux ans de service militaire à maintenir les équipements et l'infrastructure de communication.",
      highlights: [
        "Sergent et chef d'escouade, responsable d'une équipe de huit personnes.",
      ],
    },
  },
  education: [
    {
      school: "Pace University",
      degree:
        "BBA, analytique d'affaires & finance (double majeure), summa cum laude",
      detail: "New York, NY",
    },
  ],
  skillGroups: {
    languages: "Langages",
    frameworks: "Frameworks",
    tools: "Outils & plateformes",
  },
  projects: {
    cccc: "Un tracker de dépenses connecté à vos vrais comptes — Flutter et Firebase, avec l'API Plaid pour synchroniser les transactions automatiquement.",
    break:
      "Un lecteur d'entraînements iOS et Android qui enregistre séances, nutrition et mensurations — le journal d'entraînement tel que je le voulais.",
    website:
      "Ce site — une app Next.js exportée en statique sur Firebase Hosting, avec CI/CD et previews de PR via GitHub Actions.",
  },
  contact: {
    email: {
      label: "E-mail",
      description: "Le moyen le plus rapide de me joindre.",
    },
    github: {
      label: "GitHub",
      description: "Projets, expérimentations et le code de ce site.",
    },
    linkedin: {
      label: "LinkedIn",
      description: "Parcours professionnel et actualités.",
    },
  },
  privacy: {
    title: "Confidentialité",
    updated: "juin 2026",
    paragraphs: [
      "Ce site utilise Umami, un outil d'analyse respectueux de la vie privée, pour comprendre comment le site est utilisé — pages visitées, provenance des visiteurs, pays, navigateur et type d'appareil.",
      "Umami fonctionne sans cookies et ne collecte aucune donnée personnelle. Pas de fingerprinting, pas de suivi entre sites, rien qui vous identifie individuellement — toutes les données sont anonymes et agrégées. C'est pourquoi aucune bannière de consentement n'est nécessaire.",
      "Pour toute question, n'hésitez pas à m'écrire.",
    ],
  },
};
