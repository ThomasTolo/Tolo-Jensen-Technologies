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
          <p className="brand-copy text-xl leading-9">
            I started Tolo Jensen Technologies to give my projects a serious home. The focus is
            practical software with a polished surface: Kollekt for shared living, small daily
            games for repeat visits, and experiments that turn coursework into real product
            experience.
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
      <section className="mt-8 grid gap-6 lg:grid-cols-2">
        <article className="brand-panel rounded-lg p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-blue">
            Education
          </p>
          <h2 className="mt-3 text-2xl font-semibold">Universitetet i Bergen</h2>
          <div className="mt-5 space-y-5">
            <div>
              <p className="font-semibold">Master i Programvareutvikling, Computer Science</p>
              <p className="brand-copy mt-1 text-sm">2025 - 2027</p>
              <p className="brand-copy mt-2 leading-7">
                Master at UiB in collaboration with HVL, focused on software development with
                electives in machine learning and deep learning.
              </p>
            </div>
            <div>
              <p className="font-semibold">Bachelor i Informatikk, Matematikk og Økonomi</p>
              <p className="brand-copy mt-1 text-sm">Aug. 2022 - Jul. 2025</p>
              <p className="brand-copy mt-2 leading-7">
                Foundation in informatics, mathematics, statistics, and economics.
              </p>
            </div>
          </div>
        </article>

        <article className="brand-panel rounded-lg p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-blue">
            Earlier Projects
          </p>
          <div className="mt-5 space-y-5">
            <div>
              <h2 className="text-xl font-semibold">FeedApp</h2>
              <p className="brand-copy mt-2 leading-7">
                A collaborative full-stack university project built with a broad modern stack and
                GitHub-based teamwork.
              </p>
            </div>
            <div>
              <h2 className="text-xl font-semibold">Database development</h2>
              <p className="brand-copy mt-2 leading-7">
                Bike-sharing application in Shiny for Python with a SQLite backend.
              </p>
            </div>
            <div>
              <h2 className="text-xl font-semibold">Java Snake</h2>
              <p className="brand-copy mt-2 leading-7">
                Object-oriented Java implementation of Snake from early informatics coursework.
              </p>
            </div>
          </div>
        </article>
      </section>
    </PageShell>
  );
}
