import { PageShell } from "../components/PageShell";
import { Timeline } from "../components/Timeline";
import { useLanguage } from "../context/LanguageContext";

export function Roadmap() {
  const { language } = useLanguage();
  const norwegian = language === "no";

  return (
    <PageShell
      eyebrow={norwegian ? "Plan" : "Roadmap"}
      title={norwegian ? "Fra tydelig base til levende produkter." : "From clear base to living products."}
      intro={
        norwegian
          ? "Planen holder nettsiden, Kollekt og spillene i riktig rekkefølge."
          : "The plan keeps the website, Kollekt, and the games moving in the right order."
      }
    >
      <Timeline />
    </PageShell>
  );
}
