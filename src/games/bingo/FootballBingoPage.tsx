import { useMemo } from "react";
import { PageShell } from "../../components/PageShell";
import { useLanguage } from "../../context/LanguageContext";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { getDailyPuzzle, getDailyStorageKey } from "../utilities/dailyPuzzle";

const footballPrompts = [
  "Goalkeeper clean sheet",
  "Header goal",
  "Derby match",
  "Late winner",
  "Penalty scored",
  "Academy player",
  "Captain assist",
  "Free kick",
  "VAR check",
  "Away win",
  "Red card",
  "First half goal",
  "Counter attack",
  "Substitution goal",
  "Corner goal",
  "Debut player",
  "Long shot",
  "Comeback",
  "Own goal",
  "Woodwork hit",
  "Hat trick",
  "Clean tackle",
  "Yellow card",
  "Extra time",
  "Injury break",
  "Goal line save",
  "Nutmeg",
  "Offside goal",
  "Manager card",
  "Penalty miss",
  "Volley",
  "Through ball",
  "Last-minute save",
  "Rival chant",
  "Captain goal",
  "Teen scorer",
  "Loan player",
  "Cup upset",
  "New signing",
  "Stoppage time"
];

const boards = Array.from({ length: 100 }, (_, boardIndex) =>
  Array.from({ length: 9 }, (__, squareIndex) => footballPrompts[(boardIndex * 5 + squareIndex * 7) % footballPrompts.length])
);

export function FootballBingoPage() {
  const { language } = useLanguage();
  const norwegian = language === "no";
  const board = useMemo(() => getDailyPuzzle(boards), []);
  const storageKey = useMemo(() => getDailyStorageKey("tjt.bingo.progress"), []);
  const [marked, setMarked] = useLocalStorage<string[]>(storageKey, []);

  function toggleSquare(square: string) {
    setMarked(marked.includes(square) ? marked.filter((item) => item !== square) : [...marked, square]);
  }

  return (
    <PageShell
      eyebrow="Football Bingo"
      title={norwegian ? "Marker dagens fotballrute." : "Mark today's football grid."}
      intro={
        norwegian
          ? "Et daglig brett som byttes ved midnatt og lagres i denne nettleseren."
          : "A daily board that changes at midnight and saves in this browser."
      }
    >
      <div className="mx-auto grid max-w-2xl grid-cols-3 gap-3">
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
        className="mx-auto mt-6 block text-sm font-semibold text-brand-blue"
      >
        {norwegian ? "Nullstill dagens brett" : "Reset today's board"}
      </button>
    </PageShell>
  );
}
