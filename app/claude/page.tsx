import type { Metadata } from "next";
import { pageMetadata } from "@/lib/content/page-metadata";
import { ClaudeView } from "./claude-view";

export const metadata: Metadata = pageMetadata("claude");

export default function Page() {
  return <ClaudeView />;
}
