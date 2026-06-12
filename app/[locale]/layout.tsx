import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import Script from "next/script";
import { AnimatedText } from "@/components/animated-text";
import { BottomTabBar } from "@/components/bottom-tab-bar";
import { SiteHeader } from "@/components/site-header";
import { getContent } from "@/lib/content";
import { siteMeta } from "@/lib/content/meta";
import { locales } from "@/lib/i18n/config";
import { localizeHref } from "@/lib/i18n/links";
import { resolveLocale, type LocaleParams } from "@/lib/i18n/params";

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

export function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: LocaleParams;
}): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const content = getContent(locale);
  return {
    metadataBase: new URL("https://www.heeyunlee.com"),
    title: {
      default: siteMeta.name,
      template: `%s — ${siteMeta.name}`,
    },
    description: content.site.tagline,
  };
}

export const viewport: Viewport = {
  themeColor: "#09090b",
  viewportFit: "cover",
};

export default async function LocaleLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: LocaleParams;
}>) {
  const locale = await resolveLocale(params);
  const content = getContent(locale);

  return (
    <html lang={locale} className="bg-zinc-950">
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-zinc-950 font-sans text-zinc-100 antialiased`}
      >
        <SiteHeader
          locale={locale}
          siteName={content.site.name}
          navLabels={content.ui.nav}
          toggleAria={content.ui.languageToggleAria}
        />
        <main className="mx-auto w-full max-w-3xl px-6 py-12 pb-28 sm:py-16 sm:pb-16">
          {children}
        </main>
        <footer className="border-t border-white/10">
          <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-6 pb-24 text-sm text-zinc-500 sm:pb-6">
            <span>
              © {new Date().getFullYear()} {content.site.name}
            </span>
            <span className="font-mono text-xs text-zinc-600">
              <Link
                href={localizeHref(locale, "/privacy")}
                className="transition-colors hover:text-zinc-400"
              >
                <AnimatedText
                  id="footer-privacy"
                  text={content.ui.footer.privacy}
                />
              </Link>
            </span>
          </div>
        </footer>
        <BottomTabBar locale={locale} navLabels={content.ui.nav} />
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
