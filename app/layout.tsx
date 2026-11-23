import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Script from "next/script";
import { BottomTabBar } from "@/components/bottom-tab-bar";
import { SiteFooter } from "@/components/site-footer";
import { SiteHeader } from "@/components/site-header";
import { SiteMain } from "@/components/site-main";
import { getContent } from "@/lib/content";
import { siteMeta } from "@/lib/content/meta";
import { defaultLocale } from "@/lib/i18n/config";
import { LocaleProvider } from "@/lib/i18n/locale-context";
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

const defaultContent = getContent(defaultLocale);

export const metadata: Metadata = {
  metadataBase: new URL("https://www.heeyunlee.com"),
  title: {
    default: siteMeta.name,
    template: `%s — ${siteMeta.name}`,
  },
  description: defaultContent.site.tagline,
};

export const viewport: Viewport = {
  themeColor: "#09090b",
  viewportFit: "cover",
};

/**
 * Sets <html lang> before hydration from the visitor's stored/browser language
 * so assistive tech sees the right language immediately. Must stay in sync with
 * detectLocale() in lib/i18n/locale-context.tsx. The translated *text* is still
 * applied by React after hydration (this only fixes the lang attribute early).
 */
const LANG_SCRIPT = `(function(){try{var l=["en","ko","fr"],q=new URLSearchParams(location.search).get("lang"),s=localStorage.getItem("preferred-locale"),t="en";if(q&&l.indexOf(q)>-1)t=q;else if(s&&l.indexOf(s)>-1)t=s;else{var n=navigator.languages||[navigator.language||"en"];for(var i=0;i<n.length;i++){var c=String(n[i]).toLowerCase();if(c.indexOf("ko")===0){t="ko";break}if(c.indexOf("fr")===0){t="fr";break}if(c.indexOf("en")===0)break}}document.documentElement.lang=t;}catch(e){}})();`;

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang={defaultLocale} className="bg-zinc-950">
      <head>
        <script dangerouslySetInnerHTML={{ __html: LANG_SCRIPT }} />
      </head>
      <body
        className={`${geistSans.variable} ${geistMono.variable} bg-zinc-950 font-sans text-zinc-100 antialiased`}
      >
        <LocaleProvider>
          <SiteHeader />
          <SiteMain>{children}</SiteMain>
          <SiteFooter />
          <BottomTabBar />
        </LocaleProvider>
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
