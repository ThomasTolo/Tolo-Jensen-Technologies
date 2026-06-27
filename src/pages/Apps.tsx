import { AppCard } from "../components/AppCard";
import { PageShell } from "../components/PageShell";
import { apps } from "../data/apps";

export function Apps() {
  return (
    <PageShell
      eyebrow="My Apps"
      title="Software products from Tolo Jensen Technologies."
      intro="A growing collection of app experiences, starting with Kollekt."
    >
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        {apps.map((app) => (
          <AppCard key={app.slug} app={app} />
        ))}
      </div>
    </PageShell>
  );
}
