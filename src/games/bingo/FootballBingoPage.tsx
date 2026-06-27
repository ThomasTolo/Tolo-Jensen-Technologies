import { useMemo } from "react";
import { PageShell } from "../../components/PageShell";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { getDailyPuzzle, getDailyStorageKey } from "../utilities/dailyPuzzle";

const boards = [
  [
    "Goalkeeper clean sheet",
    "Header goal",
    "Derby match",
    "Late winner",
    "Penalty scored",
    "Academy player",
    "Captain assist",
    "Free kick",
    "VAR check"
  ],
  [
    "Away win",
    "Red card",
    "First half goal",
    "Counter attack",
    "Substitution goal",
    "Corner goal",
    "Debut player",
    "Long shot",
    "Comeback"
  ]
];

export function FootballBingoPage() {
  const board = useMemo(() => getDailyPuzzle(boards), []);
  const storageKey = useMemo(() => getDailyStorageKey("tjt.bingo.progress"), []);
  const [marked, setMarked] = useLocalStorage<string[]>(storageKey, []);

  function toggleSquare(square: string) {
    setMarked(marked.includes(square) ? marked.filter((item) => item !== square) : [...marked, square]);
  }

  return (
    <PageShell eyebrow="Football Bingo" title="Mark today's football grid." intro="A lightweight daily board saved in this browser.">
      <div className="grid max-w-2xl grid-cols-3 gap-3">
        {board.map((square) => {
          const active = marked.includes(square);

          return (
            <button
              key={square}
              type="button"
              onClick={() => toggleSquare(square)}
              className={`aspect-square rounded border border-line p-3 text-sm font-semibold ${
                active ? "bg-brand-blue text-white shadow-glow" : "brand-control"
              }`}
            >
              {square}
            </button>
          );
        })}
      </div>
      <button
        type="button"
        onClick={() => setMarked([])}
        className="mt-6 text-sm font-semibold text-brand-blue"
      >
        Reset today's board
      </button>
    </PageShell>
  );
}
