import type { Metadata } from "next";
import { pageMetadata } from "@/lib/content/page-metadata";
import { EtretatView } from "./etretat-view";

export const metadata: Metadata = pageMetadata("etretat");

export default function Page() {
  return <EtretatView />;
}
