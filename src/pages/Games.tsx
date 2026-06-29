import { GameCard } from "../components/GameCard";
import { PageShell } from "../components/PageShell";
import { useLanguage } from "../context/LanguageContext";

export function Games() {
  const { language } = useLanguage();
  const norwegian = language === "no";

  return (
    <PageShell
      eyebrow={norwegian ? "Spill" : "Games"}
      title={norwegian ? "Daglige spill." : "Daily games."}
      intro={
        norwegian
          ? "Daglige spill, ny hver dag."
          : "Daily games, new every day."
      }
    >
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        <GameCard
          title={norwegian ? "Gjettern" : "Guesser"}
          description={norwegian ? "Gjett dagens ord på fem bokstaver." : "Guess today's five-letter word."}
          to="/games/wordle"
        />
        <GameCard
          title={norwegian ? "Lenken" : "Knot"}
          description={
            norwegian
              ? "Finn fire skjulte grupper i et brett med seksten ord."
              : "Find four hidden groups in a sixteen-word board."
          }
          to="/games/connections"
        />
        <GameCard
          title={norwegian ? "Kampbingo" : "Match Bingo"}
          description={norwegian ? "Marker realistiske hendelser i et 4x4 kampbrett." : "Mark realistic match events on a 4x4 board."}
          to="/games/bingo"
        />
        <GameCard
          title="Tetris"
          description={
            norwegian
              ? "Stable blokker, rydd linjer og jag dagens varierende poengmål eller spill fritt."
              : "Stack blocks, clear lines, and chase today's changing score target or play freely."
          }
          to="/games/tetris"
        />
        <GameCard
          title="Snake"
          description={
            norwegian
              ? "Spis mat, voks og nå dagens mål, eller start en fri runde uten poengkrav."
              : "Eat food, grow, and reach today's target, or start a free round with no score requirement."
          }
          to="/games/snake"
        />
        <GameCard
          title={norwegian ? "Lydboks" : "Soundbox"}
          description={norwegian ? "Løs fem låttitler fra korte Apple/iTunes-previews." : "Solve five song titles from short Apple/iTunes previews."}
          to="/games/tune-grid"
        />
        <GameCard
          title={norwegian ? "Blindspor" : "BlindTrack"}
          description={norwegian ? "Gjett dagens låt. Hvert klipp kan bare spilles én gang." : "Guess today's song. Each clip can only be played once."}
          to="/games/song-snippet"
        />
        <GameCard
          title={norwegian ? "Ryddig" : "Tidyup"}
          description={norwegian ? "Plukk opp gjenstander og match tre like for å rydde hyllene." : "Pick up items and match three of a kind to clear the shelves."}
          to="/games/stacker"
        />
      </div>
    </PageShell>
  );
}
