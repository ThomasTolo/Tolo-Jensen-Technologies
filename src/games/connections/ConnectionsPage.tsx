import { useMemo, useState } from "react";
import { PageShell } from "../../components/PageShell";
import { useLanguage } from "../../context/LanguageContext";
import { connectionsPuzzles } from "../../data/connections";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { getDailyPuzzle, getDailyStorageKey } from "../utilities/dailyPuzzle";

const groupColors = ["bg-yellow-500", "bg-brand-green", "bg-brand-blue", "bg-purple-500"];
const maxMistakes = 4;

export function ConnectionsPage() {
  const { language } = useLanguage();
  const norwegian = language === "no";
  const puzzle = useMemo(() => getDailyPuzzle(connectionsPuzzles), []);
  const allWords = useMemo(() => puzzle.groups.flatMap((group) => group.words), [puzzle]);
  const initialWords = useMemo(() => shuffleWords(allWords, puzzle.groups.map((group) => group.title).join("|")), [allWords, puzzle]);
  const solvedStorageKey = useMemo(() => getDailyStorageKey("tjt.connections.solved.v2"), []);
  const mistakesStorageKey = useMemo(() => getDailyStorageKey("tjt.connections.mistakes.v2"), []);
  const [solvedGroups, setSolvedGroups] = useLocalStorage<string[]>(solvedStorageKey, []);
  const [mistakes, setMistakes] = useLocalStorage<number>(mistakesStorageKey, 0);
  const [selected, setSelected] = useState<string[]>([]);
  const [wordOrder, setWordOrder] = useState(initialWords);
  const [message, setMessage] = useState(norwegian ? "Lag fire grupper på fire." : "Create four groups of four.");
  const solvedSet = new Set(solvedGroups);
  const mistakesRemaining = Math.max(0, maxMistakes - mistakes);
  const won = solvedGroups.length === puzzle.groups.length;
  const lost = mistakesRemaining === 0 && !won;
  const disabled = won || lost;

  function toggleWord(word: string) {
    if (disabled || solvedGroups.some((title) => puzzle.groups.find((group) => group.title === title)?.words.includes(word))) {
      return;
    }

    setSelected((current) =>
      current.includes(word) ? current.filter((item) => item !== word) : [...current, word].slice(0, 4)
    );
  }

  function submitGroup() {
    if (selected.length !== 4 || disabled) {
      return;
    }

    const match = puzzle.groups.find(
      (group) => !solvedSet.has(group.title) && group.words.every((word) => selected.includes(word))
    );

    if (match) {
      const nextSolved = [...solvedGroups, match.title];
      setSolvedGroups(nextSolved);
      setSelected([]);
      setMessage(
        nextSolved.length === puzzle.groups.length
          ? norwegian
            ? "Alle grupper løst."
            : "All groups solved."
          : norwegian
            ? `${match.title} er riktig.`
            : `${match.title} is correct.`
      );
      return;
    }

    const oneAway = puzzle.groups.some(
      (group) => !solvedSet.has(group.title) && group.words.filter((word) => selected.includes(word)).length === 3
    );
    const nextMistakes = Math.min(maxMistakes, mistakes + 1);
    setMistakes(nextMistakes);
    setSelected([]);
    setMessage(
      nextMistakes >= maxMistakes
        ? norwegian
          ? "Ingen forsøk igjen."
          : "No mistakes remaining."
        : oneAway
          ? norwegian
            ? "1 unna"
            : "One away."
        : norwegian
          ? "Ikke en gruppe. Prøv igjen."
          : "Not a group. Try again."
    );
  }

  function shuffleBoard() {
    setWordOrder((current) => shuffleWords(current, `${Date.now()}`));
  }

  function resetPuzzle() {
    setSolvedGroups([]);
    setMistakes(0);
    setSelected([]);
    setWordOrder(initialWords);
    setMessage(norwegian ? "Lag fire grupper på fire." : "Create four groups of four.");
  }

  return (
    <PageShell
      eyebrow={norwegian ? "Dagens grupper" : "Daily Groups"}
      title={norwegian ? "Grupper" : "Groups"}
      intro={norwegian ? "Lag fire grupper på fire." : "Create four groups of four."}
    >
      <div className="mx-auto max-w-3xl">
        <details className="brand-panel mb-6 rounded-lg p-5">
          <summary className="cursor-pointer font-semibold">{norwegian ? "Slik spiller du" : "How it works"}</summary>
          <p className="brand-copy mt-3 leading-7">
            {norwegian
              ? "Velg fire ord som hører sammen og send inn. Du har fire feil. Hvis tre av ordene er fra samme gruppe får du beskjeden 1 unna."
              : "Select four related words and submit them. You have four mistakes. If three words are from the same group, you will see One away."}
          </p>
        </details>

        <div className="grid gap-3">
          {puzzle.groups
            .filter((group) => solvedSet.has(group.title))
            .map((group, index) => (
              <div key={group.title} className={`rounded p-4 text-center text-sm font-semibold text-ink ${groupColors[index]}`}>
                <p className="uppercase">{group.title}</p>
                <p className="mt-1 text-xs">{group.words.join(", ")}</p>
              </div>
            ))}
        </div>

        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
          {wordOrder
            .filter((word) => !puzzle.groups.some((group) => solvedSet.has(group.title) && group.words.includes(word)))
            .map((word) => {
              const isSelected = selected.includes(word);

              return (
                <button
                  key={word}
                  type="button"
                  onClick={() => toggleWord(word)}
                  disabled={disabled}
                  className={`min-h-20 rounded border border-line px-2 py-3 text-sm font-bold uppercase transition ${
                    isSelected ? "bg-brand-blue text-white shadow-glow" : "brand-control"
                  } disabled:opacity-60`}
                >
                  {word}
                </button>
              );
            })}
        </div>

        <div className="mt-5 flex flex-wrap items-center justify-center gap-2 text-sm">
          <span className="brand-copy">{norwegian ? "Feil igjen" : "Mistakes remaining"}:</span>
          {Array.from({ length: maxMistakes }).map((_, index) => (
            <span
              key={index}
              className={`h-3 w-3 rounded-full ${index < mistakesRemaining ? "bg-slate-400" : "bg-slate-700"}`}
            />
          ))}
        </div>

        <p className="brand-copy mt-4 min-h-5 text-center text-sm">{message}</p>

        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <button type="button" onClick={shuffleBoard} disabled={disabled} className="brand-control rounded border border-line px-5 py-3 text-sm font-semibold disabled:opacity-50">
            {norwegian ? "Stokk" : "Shuffle"}
          </button>
          <button
            type="button"
            onClick={() => setSelected([])}
            disabled={selected.length === 0 || disabled}
            className="brand-control rounded border border-line px-5 py-3 text-sm font-semibold disabled:opacity-50"
          >
            {norwegian ? "Fjern valg" : "Deselect all"}
          </button>
          <button
            type="button"
            onClick={submitGroup}
            disabled={selected.length !== 4 || disabled}
            className="rounded bg-brand-blue px-5 py-3 text-sm font-semibold text-white shadow-glow disabled:opacity-50"
          >
            {norwegian ? "Send inn" : "Submit"}
          </button>
          <button type="button" onClick={resetPuzzle} className="text-sm font-semibold text-brand-blue">
            {norwegian ? "Nullstill" : "Reset"}
          </button>
        </div>
      </div>
    </PageShell>
  );
}

function shuffleWords(words: string[], seed: string) {
  const shuffled = [...words];
  let state = hashSeed(seed);

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    state = (state * 1664525 + 1013904223) % 4294967296;
    const swapIndex = state % (index + 1);
    const current = shuffled[index];
    shuffled[index] = shuffled[swapIndex];
    shuffled[swapIndex] = current;
  }

  return shuffled;
}

function hashSeed(seed: string) {
  return seed.split("").reduce((hash, character) => {
    return (hash * 31 + character.charCodeAt(0)) >>> 0;
  }, 2166136261);
}
