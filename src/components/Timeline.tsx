import { roadmap } from "../data/roadmap";

export function Timeline() {
  return (
    <div className="grid gap-4 md:grid-cols-4">
      {roadmap.map((item) => (
        <article key={`${item.date}-${item.title}`} className="brand-panel rounded-lg p-6">
          <p className="text-sm font-semibold text-brand-blue">{item.date}</p>
          <h2 className="mt-4 text-xl font-semibold">{item.title}</h2>
          <p className="brand-copy mt-3 leading-7">{item.description}</p>
        </article>
      ))}
    </div>
  );
}
