export default function Home() {
  return (
    <div className="space-y-8">
      <section>
        <h1 className="text-4xl font-bold tracking-tight mb-4">
          Hi, I&apos;m Heeyun 👋
        </h1>
        <p className="text-lg text-gray-600 leading-relaxed">
          Welcome to my personal website. I&apos;m a developer passionate about
          building great products and experiences.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">About me</h2>
        <p className="text-gray-600 leading-relaxed">
          {/* Add your bio here */}
          I&apos;m currently working on exciting projects and always looking for
          new challenges. When I&apos;m not coding, you can find me exploring new
          ideas and technologies.
        </p>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">What I do</h2>
        <ul className="space-y-2 text-gray-600">
          <li className="flex items-start gap-2">
            <span className="mt-1 text-gray-400">—</span>
            <span>Software development</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1 text-gray-400">—</span>
            <span>Building web and mobile applications</span>
          </li>
          <li className="flex items-start gap-2">
            <span className="mt-1 text-gray-400">—</span>
            <span>Open source contributions</span>
          </li>
        </ul>
      </section>
    </div>
  );
}
