import { en } from "@/lib/content/en";
import { fr } from "@/lib/content/fr";
import { ko } from "@/lib/content/ko";
import {
  contactMeta,
  contactOrder,
  experienceMeta,
  experienceOrder,
  projectMeta,
  projectOrder,
  siteMeta,
  skillGroupMeta,
  skillGroupOrder,
  timelineMeta,
  timelineOrder,
} from "@/lib/content/meta";
import type { SiteContent, Translation } from "@/lib/content/types";
import type { Locale } from "@/lib/i18n/config";

const translations: Record<Locale, Translation> = { en, ko, fr };

/** Merge locale-invariant meta with a locale's translation. */
export function getContent(locale: Locale): SiteContent {
  const t = translations[locale];
  return {
    site: { ...siteMeta, ...t.site },
    ui: t.ui,
    metadata: t.metadata,
    timeline: timelineOrder.map((id) => ({
      id,
      current: false,
      ...timelineMeta[id],
      ...t.timeline[id],
    })),
    experience: experienceOrder.map((id) => ({
      id,
      ...experienceMeta[id],
      ...t.experience[id],
    })),
    education: t.education,
    skillGroups: skillGroupOrder.map((id) => ({
      id,
      label: t.skillGroups[id],
      items: skillGroupMeta[id].items,
    })),
    skills: skillGroupOrder.flatMap((id) => skillGroupMeta[id].items),
    projects: projectOrder.map((id) => ({
      id,
      ...projectMeta[id],
      description: t.projects[id],
    })),
    contactLinks: contactOrder.map((id) => ({
      id,
      ...contactMeta[id],
      ...t.contact[id],
    })),
    privacy: t.privacy,
  };
}
