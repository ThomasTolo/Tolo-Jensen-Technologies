import { useEffect } from "react";
import { Navigate, useParams } from "react-router-dom";
import { PageShell } from "../components/PageShell";
import { useLocalStorage } from "../hooks/useLocalStorage";
import { apps } from "../data/apps";

export function AppDetail() {
  const { slug } = useParams();
  const app = apps.find((item) => item.slug === slug);
  const [recentApps, setRecentApps] = useLocalStorage<string[]>("tjt.recentApps", []);

  useEffect(() => {
    if (app && !recentApps.includes(app.slug)) {
      setRecentApps([app.slug, ...recentApps].slice(0, 5));
    }
  }, [app, recentApps, setRecentApps]);

  if (!app) {
    return <Navigate to="/apps" replace />;
  }

  return (
    <PageShell eyebrow={app.status} title={app.name} intro={app.description}>
      <div className="grid gap-8 lg:grid-cols-[1fr_0.72fr] lg:items-start">
        {app.image ? (
          <img src={app.image} alt={`${app.name} preview`} className="w-full rounded-lg shadow-soft" />
        ) : (
          <div className="brand-panel grid aspect-[16/10] place-items-center rounded-lg text-6xl font-semibold text-slate-300">
            {app.name.slice(0, 1)}
          </div>
        )}
        <aside className="brand-panel rounded-lg p-6">
          <h2 className="text-xl font-semibold">Technology</h2>
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
