import type { Metadata } from "next";
import { pageMetadata } from "@/lib/content/page-metadata";
import { ResumeView } from "./resume-view";

export const metadata: Metadata = pageMetadata("resume");

export default function Page() {
  return <ResumeView />;
}
