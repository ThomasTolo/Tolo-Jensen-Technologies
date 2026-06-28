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
          ? "Fem daglige spill med 100-dagers sykluser, lokale resultater og ingen innlogging."
          : "Five daily games with 100-day cycles, local progress, and no sign-in."
      }
    >
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
        <GameCard
          title={norwegian ? "Dagens ord" : "Daily Word Guess"}
          description={norwegian ? "Gjett dagens ord på fem bokstaver." : "Guess today's five-letter word."}
          to="/games/wordle"
        />
        <GameCard
          title={norwegian ? "Dagens grupper" : "Daily Groups"}
          description={
            norwegian
              ? "Finn fire skjulte grupper i et brett med seksten ord."
              : "Find four hidden groups in a sixteen-word board."
          }
          to="/games/connections"
        />
        <GameCard
          title={norwegian ? "VM-bingo" : "World Cup Bingo"}
          description={norwegian ? "Marker realistiske hendelser i et 4x4 kampbrett." : "Mark realistic match events on a 4x4 board."}
          to="/games/bingo"
        />
        <GameCard
          title={norwegian ? "Lydrute" : "Tune Grid"}
          description={norwegian ? "Løs fem låttitler fra korte Apple/iTunes-previews." : "Solve five song titles from short Apple/iTunes previews."}
          to="/games/tune-grid"
        />
        <GameCard
          title={norwegian ? "Låtklipp" : "Snippet Guess"}
          description={norwegian ? "Gjett dagens låt. Hvert klipp kan bare spilles én gang." : "Guess today's song. Each clip can only be played once."}
          to="/games/song-snippet"
        />
      </div>
    </PageShell>
  );
}
