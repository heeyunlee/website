import "./globals.css";

/**
 * Passthrough root layout: app/[locale]/layout.tsx renders <html>/<body>
 * with the correct lang attribute. A root layout file must still exist
 * because app/not-found.tsx lives at the root.
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return children;
}
