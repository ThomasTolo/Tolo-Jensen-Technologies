import { PageShell } from "../components/PageShell";

export function About() {
  return (
    <PageShell
      eyebrow="About"
      title="Creating software that people actually enjoy using."
      intro="Tolo Jensen Technologies is a Norwegian software company focused on polished apps, everyday workflows, and playful browser experiences."
    >
      <div className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
        <div className="brand-panel rounded-lg p-8">
          <p className="text-xl leading-9 text-slate-200">
            The company is built around a simple standard: products should be useful enough to
            return to, clear enough to understand quickly, and refined enough to feel intentional.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {[
            ["01", "Official brand"],
            ["03", "Daily games"],
            ["React", "Primary frontend"],
            ["Vercel", "Deployment"]
          ].map(([value, label]) => (
            <div key={label} className="brand-panel rounded-lg p-6">
              <p className="text-3xl font-semibold">{value}</p>
              <p className="brand-copy mt-2 text-sm">{label}</p>
            </div>
          ))}
        </div>
      </div>
    </PageShell>
  );
}
