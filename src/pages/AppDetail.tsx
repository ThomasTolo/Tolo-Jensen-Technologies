import { useEffect } from "react";
import { Navigate, useParams } from "react-router-dom";
import { PageShell } from "../components/PageShell";
import { apps } from "../data/apps";
import { useLanguage } from "../context/LanguageContext";
import { useLocalStorage } from "../hooks/useLocalStorage";

export function AppDetail() {
  const { slug } = useParams();
  const app = apps.find((item) => item.slug === slug);
  const [recentApps, setRecentApps] = useLocalStorage<string[]>("tjt.recentApps", []);
  const { language } = useLanguage();
  const norwegian = Boolean(app?.norwegian && language === "no");

  useEffect(() => {
    if (app && !recentApps.includes(app.slug)) {
      setRecentApps([app.slug, ...recentApps].slice(0, 5));
    }
  }, [app, recentApps, setRecentApps]);

  if (!app) {
    return <Navigate to="/apps" replace />;
  }

  return (
    <PageShell
      eyebrow={norwegian ? app.norwegian!.status : app.status}
      title={app.name}
      intro={norwegian ? app.norwegian!.description : app.description}
    >
      <div className="grid gap-8 lg:grid-cols-[1fr_0.72fr] lg:items-start">
        {app.image ? (
          <img src={app.image} alt={`${app.name} preview`} className="w-full rounded-lg shadow-soft" />
        ) : (
          <div className="brand-panel grid aspect-[16/10] place-items-center rounded-lg text-6xl font-semibold text-slate-300">
            {app.name.slice(0, 1)}
          </div>
        )}
        <aside className="brand-panel rounded-lg p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-blue">
            {norwegian ? app.norwegian!.tagline : app.tagline}
          </p>
          <h2 className="mt-3 text-xl font-semibold">{norwegian ? "Hvorfor laste ned?" : "Why download?"}</h2>
          {app.highlights ? (
            <ul className="brand-copy mt-4 space-y-3 text-sm leading-6">
              {(norwegian ? app.norwegianHighlights ?? app.highlights : app.highlights).map((highlight) => (
                <li key={highlight}>• {highlight}</li>
              ))}
            </ul>
          ) : null}
          <a
            href="mailto:hello@tolojensen.com?subject=Kollekt%20early%20access"
            className="mt-6 inline-flex rounded bg-brand-blue px-4 py-3 text-sm font-semibold text-white shadow-glow"
          >
            {norwegian ? "Meld interesse" : "Request early access"}
          </a>

          <details className="brand-control mt-7 rounded border border-line p-4">
            <summary className="cursor-pointer text-sm font-semibold">
              {norwegian ? "Teknisk info for arbeidsgivere" : "Technical notes for employers"}
            </summary>
            <ul className="mt-4 space-y-3 text-sm leading-6 brand-copy">
              {(app.technicalHighlights ?? app.technologies).map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </details>

          <h2 className="mt-7 text-xl font-semibold">Technology</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {app.technologies.map((technology) => (
              <span key={technology} className="rounded border border-line px-3 py-1 text-sm">
                {technology}
              </span>
            ))}
          </div>
        </aside>
      </div>
    </PageShell>
  );
}
