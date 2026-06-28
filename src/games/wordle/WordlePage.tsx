import { useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { Delete } from "lucide-react";
import { PageShell } from "../../components/PageShell";
import { useLanguage } from "../../context/LanguageContext";
import { wordleWords } from "../../data/wordleWords";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { getDailyPuzzle, getDailyStorageKey } from "../utilities/dailyPuzzle";

type LetterStatus = "correct" | "present" | "absent" | "empty";

const keyboardRows = ["QWERTYUIOP", "ASDFGHJKL", "ZXCVBNM"];
const statusClasses: Record<LetterStatus, string> = {
  correct: "border-brand-green bg-brand-green text-white",
  present: "border-yellow-500 bg-yellow-500 text-ink",
  absent: "border-slate-600 bg-slate-700 text-white",
  empty: "brand-control"
};
const keyboardRank: Record<LetterStatus, number> = {
  empty: 0,
  absent: 1,
  present: 2,
  correct: 3
};

export function WordlePage() {
  const { language } = useLanguage();
  const norwegian = language === "no";
  const answer = useMemo(() => getDailyPuzzle(wordleWords).toUpperCase(), []);
  const storageKey = useMemo(() => getDailyStorageKey("tjt.wordle.progress"), []);
  const [guesses, setGuesses] = useLocalStorage<string[]>(storageKey, []);
  const [entry, setEntry] = useState("");
  const [message, setMessage] = useState(norwegian ? "Skriv inn et ord." : "Enter a word.");
  const won = guesses.includes(answer);
  const finished = won || guesses.length >= 6;
  const keyboardStatuses = useMemo(() => getKeyboardStatuses(answer, guesses), [answer, guesses]);

  function submitGuess() {
    if (finished) {
      return;
    }

    if (entry.length !== 5) {
      setMessage(norwegian ? "Ikke nok bokstaver." : "Not enough letters.");
      return;
    }

    const nextGuesses = [...guesses, entry];
    setGuesses(nextGuesses);
    setEntry("");

    if (entry === answer) {
      setMessage(norwegian ? "Løst." : "Solved.");
      return;
    }

    if (nextGuesses.length >= 6) {
      setMessage(norwegian ? `Dagens ord var ${answer}.` : `Today's word was ${answer}.`);
      return;
    }

    setMessage(norwegian ? "Prøv igjen." : "Try again.");
  }

  function pressKey(key: string) {
    if (finished && key !== "RESET") {
      return;
    }

    if (key === "ENTER") {
      submitGuess();
      return;
    }

    if (key === "BACKSPACE") {
      setEntry((current) => current.slice(0, -1));
      return;
    }

    if (/^[A-Z]$/.test(key)) {
      setEntry((current) => `${current}${key}`.slice(0, 5));
    }
  }

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const key = event.key.toUpperCase();

      if (key === "ENTER" || key === "BACKSPACE" || /^[A-Z]$/.test(key)) {
        event.preventDefault();
        pressKey(key);
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  });

  return (
    <PageShell
      eyebrow={norwegian ? "Dagens Wordle" : "Daily Wordle"}
      title="Wordle"
      intro={
        norwegian
          ? "Seks forsøk. Fargene viser om bokstavene er riktige, feilplassert eller ikke med."
          : "Six guesses. Colors show whether letters are correct, misplaced, or absent."
      }
    >
      <div className="mx-auto flex max-w-lg flex-col items-center">
        <div className="grid w-full max-w-sm gap-2">
          {Array.from({ length: 6 }).map((_, row) => {
            const guess = guesses[row] ?? (row === guesses.length ? entry : "");
            const statuses = guesses[row] ? scoreGuess(answer, guess) : Array<LetterStatus>(5).fill("empty");

            return (
              <div key={row} className="grid grid-cols-5 gap-2">
                {Array.from({ length: 5 }).map((__, index) => {
                  const letter = guess[index] ?? "";

                  return (
                    <div
                      key={index}
                      className={`grid aspect-square place-items-center rounded border text-2xl font-semibold ${statusClasses[statuses[index]]}`}
                    >
                      {letter}
                    </div>
                  );
                })}
              </div>
            );
          })}
        </div>

        <p className="brand-copy mt-5 min-h-5 text-sm">{message}</p>

        <div className="mt-5 w-full space-y-2">
          {keyboardRows.map((row, rowIndex) => (
            <div key={row} className="flex justify-center gap-1.5">
              {rowIndex === 2 ? <KeyboardButton label="Enter" onClick={() => pressKey("ENTER")} wide /> : null}
              {row.split("").map((letter) => {
                const status = keyboardStatuses[letter] ?? "empty";

                return <KeyboardButton key={letter} label={letter} status={status} onClick={() => pressKey(letter)} />;
              })}
              {rowIndex === 2 ? (
                <KeyboardButton label={<Delete size={16} />} onClick={() => pressKey("BACKSPACE")} wide />
              ) : null}
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={() => {
            setGuesses([]);
            setEntry("");
            setMessage(norwegian ? "Skriv inn et ord." : "Enter a word.");
          }}
          className="mt-6 text-sm font-semibold text-brand-blue"
        >
          {norwegian ? "Nullstill dagens brett" : "Reset today's board"}
        </button>
      </div>
    </PageShell>
  );
}

function KeyboardButton({
  label,
  onClick,
  status = "empty",
  wide = false
}: {
  label: ReactNode;
  onClick: () => void;
  status?: LetterStatus;
  wide?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`grid h-12 place-items-center rounded px-2 text-xs font-semibold uppercase sm:h-14 sm:text-sm ${
        wide ? "min-w-14" : "min-w-8 flex-1"
      } ${statusClasses[status]}`}
    >
      {label}
    </button>
  );
}

function getKeyboardStatuses(answer: string, guesses: string[]) {
  return guesses.reduce<Record<string, LetterStatus>>((statuses, guess) => {
    scoreGuess(answer, guess).forEach((status, index) => {
      const letter = guess[index];

      if (!statuses[letter] || keyboardRank[status] > keyboardRank[statuses[letter]]) {
        statuses[letter] = status;
      }
    });

    return statuses;
  }, {});
}

function scoreGuess(answer: string, guess: string): LetterStatus[] {
  const statuses = Array<LetterStatus>(5).fill("absent");
  const remaining = new Map<string, number>();

  answer.split("").forEach((letter, index) => {
    if (guess[index] === letter) {
      statuses[index] = "correct";
      return;
    }

    remaining.set(letter, (remaining.get(letter) ?? 0) + 1);
  });

  guess.split("").forEach((letter, index) => {
    if (statuses[index] === "correct") {
      return;
    }

    const count = remaining.get(letter) ?? 0;

    if (count > 0) {
      statuses[index] = "present";
      remaining.set(letter, count - 1);
    }
  });

  return statuses;
}
