import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import Script from "next/script";
import { BottomTabBar } from "@/components/bottom-tab-bar";
import { SiteHeader } from "@/components/site-header";
import { site } from "@/lib/site-content";
import "./globals.css";

// Umami website ID — public by design; it ships in every visitor's HTML.
const UMAMI_WEBSITE_ID = "e627e091-11f6-4584-8c57-724931db81e2";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://www.heeyunlee.com"),
  title: {
    default: site.name,
    template: `%s — ${site.name}`,
  },
  description: site.tagline,
};

export const viewport: Viewport = {
  themeColor: "#09090b",
  viewportFit: "cover",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className="bg-zinc-950">
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-zinc-950 font-sans text-zinc-100 antialiased`}
      >
        <SiteHeader />
        <main className="mx-auto w-full max-w-3xl px-6 py-12 pb-28 sm:py-16 sm:pb-16">
          {children}
        </main>
        <footer className="border-t border-white/10">
          <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-6 pb-24 text-sm text-zinc-500 sm:pb-6">
            <span>
              © {new Date().getFullYear()} {site.name}
            </span>
            <span className="font-mono text-xs text-zinc-600">
              <Link
                href="/privacy"
                className="transition-colors hover:text-zinc-400"
              >
                privacy
              </Link>
            </span>
          </div>
        </footer>
        <BottomTabBar />
        {process.env.NODE_ENV === "production" && (
          <Script
            src="https://cloud.umami.is/script.js"
            data-website-id={UMAMI_WEBSITE_ID}
            data-domains="heeyunlee.com,www.heeyunlee.com"
            strategy="afterInteractive"
          />
        )}
      </body>
    </html>
  );
}
