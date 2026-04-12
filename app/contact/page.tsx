import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact — Heeyun Lee",
  description: "Get in touch with Heeyun Lee",
};

const links = [
  {
    label: "Email",
    value: "hello@heeyunlee.com",
    href: "mailto:hello@heeyunlee.com",
  },
  {
    label: "GitHub",
    value: "github.com/heeyunlee",
    href: "https://github.com/heeyunlee",
  },
  {
    label: "LinkedIn",
    value: "linkedin.com/in/heeyunlee",
    href: "https://linkedin.com/in/heeyunlee",
  },
];

export default function Contact() {
  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-4xl font-bold tracking-tight mb-4">Contact</h1>
        <p className="text-lg text-gray-600">
          The best way to reach me is by email. I&apos;m also on a few other
          platforms.
        </p>
      </section>

      <section className="space-y-3">
        {links.map((link) => (
          <div key={link.label} className="flex items-center gap-4">
            <span className="text-sm text-gray-400 w-20 shrink-0">
              {link.label}
            </span>
            <a
              href={link.href}
              className="text-sm text-gray-900 hover:underline"
              target={link.href.startsWith("http") ? "_blank" : undefined}
              rel={
                link.href.startsWith("http")
                  ? "noopener noreferrer"
                  : undefined
              }
            >
              {link.value}
            </a>
          </div>
        ))}
      </section>
    </div>
  );
}
