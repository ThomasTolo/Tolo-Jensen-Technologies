import { useMemo, useState } from "react";
import type { FormEvent } from "react";
import { PageShell } from "../../components/PageShell";
import { wordleWords } from "../../data/wordleWords";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { getDailyPuzzle } from "../utilities/dailyPuzzle";

export function WordlePage() {
  const answer = useMemo(() => getDailyPuzzle(wordleWords).toUpperCase(), []);
  const [guesses, setGuesses] = useLocalStorage<string[]>("tjt.wordle.progress", []);
  const [entry, setEntry] = useState("");
  const won = guesses.includes(answer);
  const finished = won || guesses.length >= 6;

  function submitGuess(event: FormEvent) {
    event.preventDefault();
    const guess = entry.toUpperCase();

    if (guess.length !== 5 || finished) {
      return;
    }

    setGuesses([...guesses, guess]);
    setEntry("");
  }

  return (
    <PageShell eyebrow="Daily Wordle" title="Guess today's word." intro="Six guesses. Same word for every visitor today.">
      <div className="max-w-md">
        <div className="grid gap-2">
          {Array.from({ length: 6 }).map((_, row) => {
            const guess = guesses[row] ?? "";
            return (
              <div key={row} className="grid grid-cols-5 gap-2">
                {Array.from({ length: 5 }).map((__, index) => {
                  const letter = guess[index] ?? "";
                  const status =
                    letter && answer[index] === letter
                      ? "bg-brand-blue text-white"
                      : letter && answer.includes(letter)
                        ? "bg-brand-ice text-ink"
                        : letter
                          ? "bg-brand-navy/70 text-white"
                          : "bg-white/5";

                  return (
                    <div
                      key={index}
                      className={`grid aspect-square place-items-center rounded border border-line text-xl font-semibold ${status}`}
                    >
                      {letter}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>
        <form onSubmit={submitGuess} className="mt-6 flex gap-3">
          <input
            value={entry}
            onChange={(event) => setEntry(event.target.value.slice(0, 5))}
            disabled={finished}
            aria-label="Wordle guess"
            className="min-w-0 flex-1 rounded border border-line bg-white/5 px-4 py-3 uppercase text-white"
          />
          <button type="submit" disabled={finished} className="rounded bg-brand-blue px-5 py-3 text-white shadow-glow disabled:opacity-50">
            Guess
          </button>
        </form>
        {finished ? (
          <p className="brand-copy mt-4 text-sm">
            {won ? "Solved." : `Today's word was ${answer}.`}
          </p>
        ) : null}
      </div>
    </PageShell>
  );
}
