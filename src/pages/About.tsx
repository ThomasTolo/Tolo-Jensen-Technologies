import { PageShell } from "../components/PageShell";
import { useLanguage } from "../context/LanguageContext";

export function About() {
  const { language } = useLanguage();
  const norwegian = language === "no";
  const stats = norwegian
    ? [
        ["01", "Offisiell merkevare"],
        ["03", "Daglige spill"],
        ["React", "Primær frontend"],
        ["Vercel", "Publisering"]
      ]
    : [
        ["01", "Official brand"],
        ["03", "Daily games"],
        ["React", "Primary frontend"],
        ["Vercel", "Deployment"]
      ];

  return (
    <PageShell
      eyebrow={norwegian ? "Om" : "About"}
      title={
        norwegian
          ? "Student, utvikler og bygger av praktisk programvare."
          : "Student, developer, and builder of practical software."
      }
      intro={
        norwegian
          ? "Tolo Jensen Technologies er hjemmet for Kollekt, små daglige spill og programvareprosjekter bygget ved siden av studiene."
          : "Tolo Jensen Technologies is the home for Kollekt, small daily games, and software projects built alongside my studies."
      }
    >
      <div className="grid gap-6 lg:grid-cols-[1fr_0.8fr]">
        <div className="brand-panel rounded-lg p-8">
          <p className="brand-copy text-xl leading-9">
            {norwegian
              ? "Jeg er student og utvikler. Jeg fullførte en bachelor i informatikk, matematikk og økonomi, og tar nå master i programvareutvikling ved Universitetet i Bergen og HVL. Inne i masteren har jeg valgt maskinlæring som retning."
              : "I am a student and developer. I completed a bachelor in informatics, mathematics, and economics, and I am now taking a Software Engineering master at the University of Bergen and HVL. Inside the master, I have chosen a machine-learning branch."}
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {stats.map(([value, label]) => (
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
            {norwegian ? "Utdanning" : "Education"}
          </p>
          <h2 className="mt-3 text-2xl font-semibold">Universitetet i Bergen</h2>
          <div className="mt-5 space-y-5">
            <div>
              <p className="font-semibold">
                {norwegian
                  ? "Master i programvareutvikling, med maskinlæring"
                  : "Master in Software Engineering, with machine learning"}
              </p>
              <p className="brand-copy mt-1 text-sm">2025 - 2027</p>
              <p className="brand-copy mt-2 leading-7">
                {norwegian
                  ? "Master ved UiB og HVL, med programvareutvikling som hovedløp og maskinlæring som valgt retning."
                  : "Master at UiB and HVL, with software engineering as the main track and machine learning as my chosen branch."}
              </p>
            </div>
            <div>
              <p className="font-semibold">
                {norwegian
                  ? "Bachelor i informatikk, matematikk og økonomi"
                  : "Bachelor in Informatics, Mathematics, and Economics"}
              </p>
              <p className="brand-copy mt-1 text-sm">Aug. 2022 - Jul. 2025</p>
              <p className="brand-copy mt-2 leading-7">
                {norwegian
                  ? "Fullført bachelor med faglig grunnlag i informatikk, matematikk, statistikk og økonomi."
                  : "Completed bachelor with a foundation in informatics, mathematics, statistics, and economics."}
              </p>
            </div>
          </div>
        </article>

        <article className="brand-panel rounded-lg p-8">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-blue">
            {norwegian ? "Tidligere prosjekter" : "Earlier Projects"}
          </p>
          <div className="mt-5 space-y-5">
            <div>
              <h2 className="text-xl font-semibold">FeedApp</h2>
              <p className="brand-copy mt-2 leading-7">
                {norwegian
                  ? "Et fullstack universitetsprosjekt bygget i team med moderne techstack."
                  : "A full-stack university project built with a modern stack."}
              </p>
            </div>
            <div>
              <h2 className="text-xl font-semibold">{norwegian ? "Databaseutvikling" : "Database development"}</h2>
              <p className="brand-copy mt-2 leading-7">
                {norwegian
                  ? "Bysykkel-applikasjon i Shiny for Python med SQLite i backend."
                  : "Bike-sharing application in Shiny for Python with a SQLite backend."}
              </p>
            </div>
            <div>
              <h2 className="text-xl font-semibold">Java Snake</h2>
              <p className="brand-copy mt-2 leading-7">
                {norwegian
                  ? "Objektorientert Java-implementasjon av Snake fra tidligere informatikkemne."
                  : "Object-oriented Java implementation of Snake from early informatics coursework."}
              </p>
            </div>
          </div>
        </article>
      </section>
    </PageShell>
  );
}
