import type { Metadata } from "next";
import { pageMetadata } from "@/lib/content/page-metadata";
import { ProjectsView } from "./projects-view";

export const metadata: Metadata = pageMetadata("projects");

export default function Page() {
  return <ProjectsView />;
}
