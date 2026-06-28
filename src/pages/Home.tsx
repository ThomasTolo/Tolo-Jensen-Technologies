import { motion } from "framer-motion";
import { AppCard } from "../components/AppCard";
import { GameCard } from "../components/GameCard";
import { Hero } from "../components/Hero";
import { useLanguage } from "../context/LanguageContext";
import { apps } from "../data/apps";

export function Home() {
  const { language } = useLanguage();
  const norwegian = language === "no";
  const pillars = [
    {
      label: norwegian ? "Student ved UiB og HVL" : "Student at UiB and HVL",
      text: norwegian
        ? "Jeg har fullført en bachelor i informatikk, matematikk og økonomi, og tar nå master i programvareutvikling ved UiB og HVL med maskinlæring som retning."
        : "I completed a bachelor in informatics, mathematics, and economics, and I am now taking a collaborative Software Engineering master at UiB and HVL with a machine-learning branch."
    },
    {
      label: norwegian ? "Daglige spill" : "Daily games",
      text: norwegian
        ? "Ord, grupper, VM-bingo og to musikkspill har 100 daglige brett og bytter ved midnatt."
        : "Word guessing, groups, World Cup bingo, and two music games have 100 daily boards and change at midnight."
    },
    {
      label: norwegian ? "Prosjekter" : "Projects",
      text: norwegian
        ? "Kollekt er nyeste prosjekt: et ryddigere sted for oppgaver, utgifter, planer og alt som følger med å bo sammen."
        : "Kollekt is the latest project: a cleaner place for chores, expenses, plans, and everything that comes with living together."
    }
  ];

  return (
    <main>
      <Hero />
      <section className="mx-auto grid max-w-7xl gap-6 px-5 py-20 sm:px-8 lg:grid-cols-3">
        {pillars.map((pillar) => (
          <motion.article
            key={pillar.label}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            className="brand-panel rounded-lg p-6"
          >
            <h2 className="text-2xl font-semibold">{pillar.label}</h2>
            <p className="brand-copy mt-3 leading-7">
              {pillar.text}
            </p>
          </motion.article>
        ))}
      </section>
      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-blue">
              {norwegian ? "Fremhevet app" : "Featured app"}
            </p>
            <h2 className="mt-3 text-4xl font-semibold">Kollekt</h2>
          </div>
        </div>
        <div className="max-w-xl">
          <AppCard app={apps[0]} />
        </div>
      </section>
      <section className="mx-auto grid max-w-7xl gap-6 px-5 py-20 sm:px-8 md:grid-cols-3">
        <GameCard
          title={norwegian ? "Dagens ord" : "Daily Word Guess"}
          description={norwegian ? "Gjett dagens ord på fem bokstaver." : "Guess today's five-letter word."}
          to="/games/wordle"
        />
        <GameCard
          title={norwegian ? "Dagens grupper" : "Daily Groups"}
          description={
            norwegian
              ? "Sorter seksten ord i fire skjulte grupper."
              : "Group sixteen words into four hidden categories."
          }
          to="/games/connections"
        />
        <GameCard
          title={norwegian ? "Lydrute" : "Tune Grid"}
          description={norwegian ? "Løs korte musikkpreviews i et rutenett." : "Solve short music previews in a grid."}
          to="/games/tune-grid"
        />
        <GameCard
          title={norwegian ? "VM-bingo" : "World Cup Bingo"}
          description={norwegian ? "Marker realistiske VM-hendelser." : "Mark realistic World Cup events."}
          to="/games/bingo"
        />
        <GameCard
          title={norwegian ? "Låtklipp" : "Snippet Guess"}
          description={norwegian ? "Gjett låten uten å kunne spille klipp på nytt." : "Guess the song without replaying clips."}
          to="/games/song-snippet"
        />
      </section>
    </main>
  );
}
