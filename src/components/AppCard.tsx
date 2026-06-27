import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import type { AppInfo } from "../data/apps";

export function AppCard({ app }: { app: AppInfo }) {
  return (
    <Link
      to={`/apps/${app.slug}`}
      className="brand-panel group flex h-full flex-col overflow-hidden rounded-lg transition hover:-translate-y-1 hover:shadow-glow"
    >
      {app.image ? (
        <img src={app.image} alt="" className="aspect-[16/10] w-full object-cover" />
      ) : (
        <div className="grid aspect-[16/10] place-items-center bg-brand-navy/35 text-4xl font-semibold text-slate-300">
          {app.name.slice(0, 1)}
        </div>
      )}
      <div className="flex flex-1 flex-col p-6">
        <p className="text-sm font-medium text-brand-blue">{app.status}</p>
        <h2 className="mt-3 text-2xl font-semibold">{app.name}</h2>
        <p className="brand-copy mt-3 flex-1 leading-7">{app.description}</p>
        <div className="mt-5 flex flex-wrap gap-2">
          {app.technologies.map((technology) => (
            <span key={technology} className="rounded border border-line px-3 py-1 text-xs">
              {technology}
            </span>
          ))}
        </div>
        <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold">
          View app <ArrowRight size={16} className="transition group-hover:translate-x-1" />
        </span>
      </div>
    </Link>
  );
}
