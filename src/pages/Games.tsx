import { GameCard } from "../components/GameCard";
import { PageShell } from "../components/PageShell";
import { useLanguage } from "../context/LanguageContext";

export function Games() {
  const { language } = useLanguage();
  const norwegian = language === "no";

  return (
    <PageShell
      eyebrow={norwegian ? "Spill" : "Games"}
      title={norwegian ? "Daglige spill som byttes ved midnatt." : "Daily games that change at midnight."}
      intro={
        norwegian
          ? "Wordle, Connections og Football Bingo har hver sin 100-dagers syklus. Fremgangen lagres bare i nettleseren din."
          : "Wordle, Connections, and Football Bingo each have a 100-day cycle. Progress stays in your browser."
      }
    >
      <div className="grid gap-6 md:grid-cols-3">
        <GameCard
          title={norwegian ? "Dagens Wordle" : "Daily Wordle"}
          description={norwegian ? "Gjett dagens ord på fem bokstaver." : "Guess today's five-letter word."}
          to="/games/wordle"
        />
        <GameCard
          title={norwegian ? "Dagens Connections" : "Daily Connections"}
          description={
            norwegian
              ? "Finn fire skjulte grupper i et brett med seksten ord."
              : "Find four hidden groups in a sixteen-word board."
          }
          to="/games/connections"
        />
        <GameCard
          title="Football Bingo"
          description={norwegian ? "Marker dagens fotballhendelser." : "Mark today's football prompts."}
          to="/games/bingo"
        />
      </div>
    </PageShell>
  );
}
