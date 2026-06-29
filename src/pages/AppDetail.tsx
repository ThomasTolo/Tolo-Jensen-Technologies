import { useEffect } from "react";
import { Navigate, useParams } from "react-router-dom";
import { PageShell } from "../components/PageShell";
import { apps } from "../data/apps";
import { useLanguage } from "../context/LanguageContext";
import { useLocalStorage } from "../hooks/useLocalStorage";

type KollektWalkthroughItem = {
  image: string;
  title: string;
  description: string;
  norwegianTitle: string;
  norwegianDescription: string;
};

const kollektAsset = (fileName: string) => `/kollekt/${encodeURIComponent(fileName)}`;

const kollektWalkthrough: KollektWalkthroughItem[] = [
  {
    image: kollektAsset("6) Homescreen.png"),
    title: "Good morning. Here's your house.",
    description:
      "A real-time snapshot of tasks, house vibe, balances, and the week ahead. The home screen that actually earns its name.",
    norwegianTitle: "God morgen. Her er kollektivet ditt.",
    norwegianDescription:
      "Et sanntidsbilde av oppgaver, trivsel, saldo og uken som kommer. Hjemskjermen som faktisk fortjener navnet."
  },
  {
    image: kollektAsset("1) Log In.png"),
    title: "Welcome home.",
    description: "Log in with email or Apple and get straight back to shared living.",
    norwegianTitle: "Velkommen hjem.",
    norwegianDescription: "Logg inn med e-post eller Apple og kom rett tilbake til kollektivlivet."
  },
  {
    image: kollektAsset("2) Register.png"),
    title: "Shared living starts here.",
    description: "Create your account in seconds with just your name, email, and password.",
    norwegianTitle: "Kollektivlivet starter her.",
    norwegianDescription: "Opprett konto på sekunder med navn, e-post og passord."
  },
  {
    image: kollektAsset("3) Onboarding.png"),
    title: "Build your home from scratch.",
    description: "Name the home, add rooms, and let Kollekt rotate chores fairly every week.",
    norwegianTitle: "Bygg hjemmet fra start.",
    norwegianDescription: "Gi hjemmet et navn, legg til rom, og la Kollekt rotere oppgaver rettferdig hver uke."
  },
  {
    image: kollektAsset("4) Code.png"),
    title: "Got a code? You're in.",
    description:
      "Ask the person who created the home, or anyone already in it, for the code from their profile and join the rotation right away.",
    norwegianTitle: "Har du en kode? Da er du inne.",
    norwegianDescription:
      "Be den som opprettet hjemmet, eller noen som allerede er med, finne koden i profilen sin, så kommer du rett inn i oppgavefordelingen."
  },
  {
    image: kollektAsset("7) Tasks.png"),
    title: "Whose turn is it? Now everyone knows.",
    description: "Weekly tasks are assigned fairly, tracked clearly, and rewarded with XP.",
    norwegianTitle: "Hvem sin tur er det? Nå vet alle det.",
    norwegianDescription: "Ukens oppgaver fordeles rettferdig, vises tydelig og belønnes med XP."
  },
  {
    image: kollektAsset("8) Calendar.png"),
    title: "One calendar. Zero confusion.",
    description: "Add events, see the house schedule, and subscribe from your phone.",
    norwegianTitle: "En kalender. Null forvirring.",
    norwegianDescription: "Legg inn arrangementer, se husets plan og abonner fra mobilen."
  },
  {
    image: kollektAsset("10) Chat.png"),
    title: "The group chat that actually does stuff.",
    description: "Coordinate plans, polls, reactions, kudos, laundry, and private DMs in one place.",
    norwegianTitle: "Gruppechatten som faktisk gjør noe.",
    norwegianDescription: "Samle planer, avstemninger, reaksjoner, kudos, klesvask og private meldinger ett sted."
  },
  {
    image: kollektAsset("11) Chat.png"),
    title: "More than just text.",
    description: "Send photos, GIFs, polls, laundry runs, and kudos from the same message bar.",
    norwegianTitle: "Mer enn bare tekst.",
    norwegianDescription: "Send bilder, GIF-er, avstemninger, vaskerunder og kudos fra samme meldingsfelt."
  },
  {
    image: kollektAsset("12) Economy.png"),
    title: "Money made fair.",
    description: "Log expenses, split them by person, and see exactly who owes what.",
    norwegianTitle: "Penger gjort rettferdig.",
    norwegianDescription: "Registrer utgifter, fordel dem per person og se nøyaktig hvem som skylder hva."
  },
  {
    image: kollektAsset("14) Leaderboard.png"),
    title: "Who's the best roomie this month?",
    description: "A live XP podium keeps chores lighter and lets the house set its own prize.",
    norwegianTitle: "Hvem er månedens beste roomie?",
    norwegianDescription: "En live XP-pall gjør oppgaver lettere og lar kollektivet velge sin egen premie."
  },
  {
    image: kollektAsset("15) Games.png"),
    title: "Game night, sorted.",
    description: "Kollekt picks tonight's game and keeps the rules ready inside the app.",
    norwegianTitle: "Spillkveld, fikset.",
    norwegianDescription: "Kollekt velger kveldens spill og holder reglene klare i appen."
  },
  {
    image: kollektAsset("16) Games.png"),
    title: "13 games. Zero prep.",
    description: "Browse classics, party games, cards, dice, and quick group games without switching apps.",
    norwegianTitle: "13 spill. Null forarbeid.",
    norwegianDescription: "Bla i klassikere, partyspill, kort, terning og raske gruppespill uten å bytte app."
  },
  {
    image: kollektAsset("17) Profile.png"),
    title: "Your house. Your rules.",
    description: "Set quiet hours, house rules, status, colors, language, and profile settings.",
    norwegianTitle: "Ditt hjem. Dine regler.",
    norwegianDescription: "Sett stilletid, husregler, status, farger, språk og profilinnstillinger."
  },
  {
    image: kollektAsset("18) Dark Mode.png"),
    title: "Easy on the eyes at midnight.",
    description: "Full dark mode for late-night reminders, chats, and planning.",
    norwegianTitle: "Behagelig for øynene ved midnatt.",
    norwegianDescription: "Full mørk modus for sene påminnelser, chat og planlegging."
  },
  {
    image: kollektAsset("19) Girl Mode.png"),
    title: "Make it yours.",
    description: "Switch to Rose for something warmer. Your home, your aesthetic.",
    norwegianTitle: "Gjør det til ditt.",
    norwegianDescription: "Bytt til Rose for et varmere uttrykk. Ditt hjem, din stil."
  }
];

export function AppDetail() {
  const { slug } = useParams();
  const app = apps.find((item) => item.slug === slug);
  const [recentApps, setRecentApps] = useLocalStorage<string[]>("tjt.recentApps", []);
  const { language } = useLanguage();
  const norwegian = Boolean(app?.norwegian && language === "no");
  const languageIsNorwegian = language === "no";
  const isKollekt = app?.slug === "kollekt";

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
          <img
            src={app.image}
            alt={languageIsNorwegian ? `${app.name} forhåndsvisning` : `${app.name} preview`}
            className="w-full rounded-lg shadow-soft"
          />
        ) : (
          <div className="brand-panel grid aspect-[16/10] place-items-center rounded-lg text-6xl font-semibold text-slate-300">
            {app.name.slice(0, 1)}
          </div>
        )}
        <aside className="brand-panel rounded-lg p-6">
          <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-blue">
            {norwegian ? app.norwegian!.tagline : app.tagline}
          </p>
          <h2 className="mt-3 text-xl font-semibold">
            {languageIsNorwegian ? "Hvorfor følge med?" : "Why follow it?"}
          </h2>
          {app.highlights ? (
            <ul className="brand-copy mt-4 space-y-3 text-sm leading-6">
              {(norwegian ? app.norwegianHighlights ?? app.highlights : app.highlights).map((highlight) => (
                <li key={highlight}>• {highlight}</li>
              ))}
            </ul>
          ) : null}
          <a
            href="mailto:bedrift.tolo@gmail.com?subject=Kollekt%20early%20access"
            className="mt-6 inline-flex rounded bg-brand-blue px-4 py-3 text-sm font-semibold text-white shadow-glow"
          >
            {languageIsNorwegian ? "Meld interesse" : "Request early access"}
          </a>

          <details className="brand-control mt-7 rounded border border-line p-4">
            <summary className="cursor-pointer text-sm font-semibold">
              {languageIsNorwegian ? "Teknisk info for arbeidsgivere" : "Technical notes for employers"}
            </summary>
            <ul className="mt-4 space-y-3 text-sm leading-6 brand-copy">
              {(app.technicalHighlights ?? app.technologies).map((item) => (
                <li key={item}>• {item}</li>
              ))}
            </ul>
          </details>

          {isKollekt ? (
            <details className="brand-control mt-4 rounded border border-line p-4">
              <summary className="cursor-pointer text-sm font-semibold">
                {languageIsNorwegian ? "Samarbeidspartnere" : "Collaboration partners"}
              </summary>
              <ul className="brand-copy mt-4 space-y-2 text-sm leading-6">
                <li>
                  <a href="https://www.linkedin.com/in/thomastolojensen/" target="_blank" rel="noreferrer">
                    Thomas Tolo Jensen (Owner)
                  </a>
                </li>
                <li>
                  <a href="https://www.linkedin.com/in/magnus-fjeldstad/" target="_blank" rel="noreferrer">
                    Magnus Fjeldstad
                  </a>
                </li>
                <li>
                  <a href="https://www.linkedin.com/in/jonas-heen-opsahl-54043b244/" target="_blank" rel="noreferrer">
                    Jonas Heen Opsahl
                  </a>
                </li>
                <li>
                  <a href="https://www.linkedin.com/in/fredric-hegland-8a8972206/" target="_blank" rel="noreferrer">
                    Fredric Hegland
                  </a>
                </li>
                <li>
                  <a href="https://www.linkedin.com/in/erlend-andre-hoentorp/" target="_blank" rel="noreferrer">
                    Erlend André Høntorp
                  </a>
                </li>
                <li>
                  <a href="https://www.linkedin.com/in/tobias-skodven-496835240/" target="_blank" rel="noreferrer">
                    Tobias Skodven
                  </a>
                </li>
              </ul>
            </details>
          ) : null}

          <h2 className="mt-7 text-xl font-semibold">{languageIsNorwegian ? "Teknologi" : "Technology"}</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {app.technologies.map((technology) => (
              <span key={technology} className="rounded border border-line px-3 py-1 text-sm">
                {technology}
              </span>
            ))}
          </div>
        </aside>
      </div>

      {isKollekt ? (
        <section className="mt-16">
          <div className="max-w-3xl">
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-blue">
              {languageIsNorwegian ? "Slik fungerer Kollekt" : "How Kollekt works"}
            </p>
            <h2 className="brand-title mt-3 text-3xl font-semibold">
              {languageIsNorwegian ? "Fra innflytting til hverdagsflyt." : "From moving in to daily flow."}
            </h2>
            <p className="brand-copy mt-4 leading-7">
              {languageIsNorwegian
                ? "Se appen steg for steg: først hjemskjermen, deretter de viktigste verktøyene som gjør kollektivet ryddigere, mer rettferdig og litt morsommere."
                : "Walk through the app step by step: first the home screen, then the tools that make shared living clearer, fairer, and a little more fun."}
            </p>
          </div>

          <article className="kollekt-feature mt-8 brand-panel rounded-lg p-5 md:grid md:grid-cols-[0.88fr_1.12fr] md:items-center md:gap-8 md:p-8">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.18em] text-brand-blue">
                {languageIsNorwegian ? "Hjem" : "Home"}
              </p>
              <h3 className="mt-3 text-2xl font-semibold">
                {languageIsNorwegian ? kollektWalkthrough[0].norwegianTitle : kollektWalkthrough[0].title}
              </h3>
              <p className="brand-copy mt-4 leading-7">
                {languageIsNorwegian
                  ? kollektWalkthrough[0].norwegianDescription
                  : kollektWalkthrough[0].description}
              </p>
            </div>
            <div className="kollekt-phone-frame mt-6 md:mt-0">
              <img
                src={kollektWalkthrough[0].image}
                alt={languageIsNorwegian ? "Kollekt hjemskjerm" : "Kollekt home screen"}
                loading="lazy"
              />
            </div>
          </article>

          <div className="mt-8 grid gap-5 lg:grid-cols-2">
            {kollektWalkthrough.slice(1).map((item) => (
              <article key={item.title} className="kollekt-screen-card brand-panel rounded-lg p-5">
                <div className="kollekt-phone-frame">
                  <img
                    src={item.image}
                    alt={languageIsNorwegian ? item.norwegianTitle : item.title}
                    loading="lazy"
                  />
                </div>
                <div className="mt-5">
                  <h3 className="text-xl font-semibold">{languageIsNorwegian ? item.norwegianTitle : item.title}</h3>
                  <p className="brand-copy mt-3 text-sm leading-6">
                    {languageIsNorwegian ? item.norwegianDescription : item.description}
                  </p>
                </div>
              </article>
            ))}
          </div>
        </section>
      ) : null}
    </PageShell>
  );
}
