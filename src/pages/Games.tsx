import { GameCard } from "../components/GameCard";
import { PageShell } from "../components/PageShell";

export function Games() {
  return (
    <PageShell
      eyebrow="Games"
      title="Daily browser games with shared puzzles and local progress."
      intro="Every visitor receives the same daily challenge without a backend."
    >
      <div className="grid gap-6 md:grid-cols-3">
        <GameCard title="Daily Wordle" description="Guess today's five-letter word." to="/games/wordle" />
        <GameCard
          title="Daily Connections"
          description="Find four hidden groups in a sixteen-word board."
          to="/games/connections"
        />
        <GameCard title="Football Bingo" description="Mark today's football prompts." to="/games/bingo" />
      </div>
    </PageShell>
  );
}
