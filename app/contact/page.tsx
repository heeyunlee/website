import type { Metadata } from "next";
import { pageMetadata } from "@/lib/content/page-metadata";
import { ContactView } from "./contact-view";

export const metadata: Metadata = pageMetadata("contact");

export default function Page() {
  return <ContactView />;
}
