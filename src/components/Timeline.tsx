import { roadmap } from "../data/roadmap";
import { useLanguage } from "../context/LanguageContext";

export function Timeline() {
  const { language } = useLanguage();
  const norwegian = language === "no";

  return (
    <div className="grid gap-4 md:grid-cols-4">
      {roadmap.map((item) => {
        const date = norwegian ? item.norwegianDate : item.date;
        const title = norwegian ? item.norwegianTitle : item.title;
        const description = norwegian ? item.norwegianDescription : item.description;

        return (
          <article key={`${item.date}-${item.title}`} className="brand-panel rounded-lg p-6">
            <p className="text-sm font-semibold text-brand-blue">{date}</p>
            <h2 className="mt-4 text-xl font-semibold">{title}</h2>
            <p className="brand-copy mt-3 leading-7">{description}</p>
          </article>
        );
      })}
    </div>
  );
}
