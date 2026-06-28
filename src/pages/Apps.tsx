import { AppCard } from "../components/AppCard";
import { PageShell } from "../components/PageShell";
import { useLanguage } from "../context/LanguageContext";
import { apps } from "../data/apps";

export function Apps() {
  const { language } = useLanguage();
  const norwegian = language === "no";

  return (
    <PageShell
      eyebrow={norwegian ? "Apper" : "Apps"}
      title={norwegian ? "Produkter fra Tolo Jensen Technologies." : "Products from Tolo Jensen Technologies."}
      intro={
        norwegian
          ? "En liten, voksende samling programvare, med Kollekt først ut."
          : "A small, growing collection of software, starting with Kollekt."
      }
    >
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {apps.map((app) => (
          <AppCard key={app.slug} app={app} />
        ))}
      </div>
    </PageShell>
  );
}
