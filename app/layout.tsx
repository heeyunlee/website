import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import Link from "next/link";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Heeyun Lee",
    template: "%s — Heeyun Lee",
  },
  description: "Personal website of Heeyun Lee",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-white text-gray-900`}
      >
        <header className="border-b border-gray-100">
          <nav className="max-w-3xl mx-auto px-6 py-4 flex items-center justify-between">
            <Link href="/" className="font-semibold text-lg tracking-tight">
              Heeyun Lee
            </Link>
            <div className="flex gap-6 text-sm text-gray-600">
              <Link href="/" className="hover:text-gray-900 transition-colors">
                About
              </Link>
              <Link
                href="/resume"
                className="hover:text-gray-900 transition-colors"
              >
                Resume
              </Link>
              <Link
                href="/projects"
                className="hover:text-gray-900 transition-colors"
              >
                Projects
              </Link>
              <Link
                href="/contact"
                className="hover:text-gray-900 transition-colors"
              >
                Contact
              </Link>
            </div>
          </nav>
        </header>
        <main className="max-w-3xl mx-auto px-6 py-16">{children}</main>
        <footer className="border-t border-gray-100 mt-16">
          <div className="max-w-3xl mx-auto px-6 py-6 text-sm text-gray-400">
            © {new Date().getFullYear()} Heeyun Lee
          </div>
        </footer>
      </body>
    </html>
  );
}
