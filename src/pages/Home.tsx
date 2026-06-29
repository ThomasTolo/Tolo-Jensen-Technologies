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
        ? "Åtte spill – ordgjetting, grupper, bingo, musikk, Tetris, Snake og hyllesortering – med daglige utfordringer og fri spilling."
        : "Eight games – word guessing, groups, bingo, music, Tetris, Snake, and shelf sorting – each with daily challenges and free play."
    },
    {
      label: norwegian ? "Prosjekter" : "Projects",
      text: norwegian
        ? "Kollekt er det aktive prosjektet: et ryddigere sted for oppgaver, utgifter, planer og alt som følger med å bo sammen. Tidligere prosjekter finnes på GitHub."
        : "Kollekt is the active project: a cleaner space for chores, expenses, plans, and everything that comes with living together. Earlier projects are on GitHub."
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
          title={norwegian ? "Gjettern" : "Guesser"}
          description={norwegian ? "Gjett dagens ord på fem bokstaver." : "Guess today's five-letter word."}
          to="/games/wordle"
        />
        <GameCard
          title={norwegian ? "Lenken" : "Knot"}
          description={
            norwegian
              ? "Sorter seksten ord i fire skjulte grupper."
              : "Group sixteen words into four hidden categories."
          }
          to="/games/connections"
        />
        <GameCard
          title={norwegian ? "Lydboks" : "Soundbox"}
          description={norwegian ? "Løs korte musikkpreviews i et rutenett." : "Solve short music previews in a grid."}
          to="/games/tune-grid"
        />
        <GameCard
          title="Tetris"
          description={norwegian ? "Rydd linjer og nå dagens poengmål." : "Clear lines and reach today's score target."}
          to="/games/tetris"
        />
        <GameCard
          title="Snake"
          description={norwegian ? "Spis mat, voks og jag dagens mål." : "Eat food, grow, and chase today's target."}
          to="/games/snake"
        />
        <GameCard
          title={norwegian ? "Kampbingo" : "Match Bingo"}
          description={norwegian ? "Marker realistiske VM-hendelser." : "Mark realistic World Cup events."}
          to="/games/bingo"
        />
        <GameCard
          title={norwegian ? "Blindspor" : "BlindTrack"}
          description={norwegian ? "Gjett låten uten å kunne spille klipp på nytt." : "Guess the song without replaying clips."}
          to="/games/song-snippet"
        />
        <GameCard
          title={norwegian ? "Ryddig" : "Tidyup"}
          description={norwegian ? "Plukk opp gjenstander og match tre like for å rydde hyllene." : "Pick up items and match three of a kind to clear the shelves."}
          to="/games/stacker"
        />
      </section>
    </main>
  );
}
