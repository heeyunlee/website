import { site } from "@/lib/site-content";

export default function Home() {
  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          Hi, I&apos;m {site.name.split(" ")[0]} 👋
        </h1>
        <p className="text-lg text-gray-600 leading-relaxed">{site.tagline}</p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">About me</h2>
        <div className="space-y-4 text-gray-600 leading-relaxed">
          {site.bio.map((paragraph) => (
            <p key={paragraph}>{paragraph}</p>
          ))}
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">What I do</h2>
        <ul className="space-y-2 text-gray-600">
          {site.focusAreas.map((item) => (
            <li key={item} className="flex items-start gap-2">
              <span className="mt-1 text-gray-400">—</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
