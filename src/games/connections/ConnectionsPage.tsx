import { useMemo, useState } from "react";
import { PageShell } from "../../components/PageShell";
import { connectionsPuzzles } from "../../data/connections";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { getDailyPuzzle } from "../utilities/dailyPuzzle";

export function ConnectionsPage() {
  const puzzle = useMemo(() => getDailyPuzzle(connectionsPuzzles), []);
  const words = useMemo(() => puzzle.groups.flatMap((group) => group.words).sort(), [puzzle]);
  const [solved, setSolved] = useLocalStorage<string[]>("tjt.connections.progress", []);
  const [selected, setSelected] = useState<string[]>([]);

  function toggleWord(word: string) {
    if (solved.includes(word)) {
      return;
    }

    setSelected((current) =>
      current.includes(word) ? current.filter((item) => item !== word) : [...current, word].slice(0, 4)
    );
  }

  function submitGroup() {
    const match = puzzle.groups.find((group) =>
      group.words.every((word) => selected.includes(word))
    );

    if (match) {
      setSolved([...solved, ...match.words]);
      setSelected([]);
    }
  }

  return (
    <PageShell eyebrow="Daily Connections" title="Find the four hidden groups." intro="Select four words and submit a group.">
      <div className="max-w-2xl">
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {words.map((word) => {
            const isSolved = solved.includes(word);
            const isSelected = selected.includes(word);

            return (
              <button
                key={word}
                type="button"
                onClick={() => toggleWord(word)}
                className={`min-h-16 rounded border border-line px-3 py-3 text-sm font-semibold ${
                  isSolved
                    ? "bg-brand-green text-white"
                    : isSelected
                      ? "bg-brand-blue text-white"
                      : "bg-white/5"
                }`}
              >
                {word}
              </button>
            );
          })}
        </div>
        <button
          type="button"
          onClick={submitGroup}
          disabled={selected.length !== 4}
          className="mt-6 rounded bg-brand-blue px-5 py-3 text-white shadow-glow disabled:opacity-50"
        >
          Submit group
        </button>
        <div className="mt-8 grid gap-3">
          {puzzle.groups
            .filter((group) => group.words.every((word) => solved.includes(word)))
            .map((group) => (
              <div key={group.title} className="brand-panel rounded p-4">
                <p className="font-semibold">{group.title}</p>
                <p className="brand-copy mt-1 text-sm">{group.words.join(", ")}</p>
              </div>
            ))}
        </div>
      </div>
    </PageShell>
  );
}
