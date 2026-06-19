import type { Metadata } from "next";
import { pageMetadata } from "@/lib/content/page-metadata";
import { PrivacyView } from "./privacy-view";

export const metadata: Metadata = pageMetadata("privacy");

export default function Page() {
  return <PrivacyView />;
}
