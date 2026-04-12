import type { Metadata } from "next";
import Link from "next/link";
import { experience, site } from "@/lib/site-content";

export const metadata: Metadata = {
  title: "Resume",
  description: `Work experience and background for ${site.name}`,
};

export default function Resume() {
  return (
    <div className="space-y-10">
      <section>
        <h1 className="text-4xl font-bold tracking-tight mb-4">Resume</h1>
        <p className="text-lg text-gray-600 leading-relaxed">
          A concise history of my professional roles. For full details or
          references,           reach out via{" "}
          <Link
            href="/contact"
            className="text-gray-900 underline hover:no-underline"
          >
            Contact
          </Link>
          .
        </p>
      </section>

      <section className="space-y-10">
        {experience.map((job) => (
          <article key={`${job.organization}-${job.period}`} className="space-y-3">
            <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-1">
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  {job.title}
                </h2>
                <p className="text-gray-700">
                  {job.organization}
                  {job.location ? ` · ${job.location}` : ""}
                </p>
              </div>
              <p className="text-sm text-gray-500 shrink-0">{job.period}</p>
            </div>
            <p className="text-gray-600 leading-relaxed">{job.summary}</p>
            <ul className="list-disc list-inside space-y-1.5 text-gray-600 text-sm leading-relaxed">
              {job.highlights.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        ))}
      </section>
    </div>
  );
}
