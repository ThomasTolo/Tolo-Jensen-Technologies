import { useMemo, useState } from "react";
import { PageShell } from "../../components/PageShell";
import { useLanguage } from "../../context/LanguageContext";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { getDailyPuzzle, getDailyStorageKey } from "../utilities/dailyPuzzle";

type CustomBoard = {
  id: string;
  title: string;
  prompts: string[];
};

const worldCupPrompts = [
  "Goal from a set piece",
  "VAR check changes a call",
  "Penalty awarded",
  "Penalty missed or saved",
  "Goal after 80 minutes",
  "Header from a cross",
  "Counter-attack goal",
  "Substitute scores",
  "Captain gets an assist",
  "Goalkeeper makes a big save",
  "Shot hits the post or bar",
  "Yellow card for time wasting",
  "Free kick on target",
  "Corner leads to a chance",
  "Offside goal ruled out",
  "Underdog scores first",
  "Favorite controls possession",
  "Extra time is mentioned",
  "Player cramps late",
  "Defender blocks a shot",
  "Long-range shot",
  "Own goal scare",
  "Teenager comes on",
  "Coach changes formation",
  "Crowd sings after a goal",
  "Handball appeal",
  "Keeper punches a cross",
  "Striker misses a sitter",
  "Midfielder wins a duel",
  "Fullback overlaps",
  "Group table shown",
  "Knockout bracket mentioned",
  "Stoppage-time chance",
  "Two quick corners",
  "Player asks for a card",
  "Cooling break or hydration talk",
  "Tournament debut mentioned",
  "Past World Cup referenced",
  "VAR line graphic shown",
  "Fans shown celebrating",
  "Tactical foul",
  "Goal checked for offside",
  "Keeper catches a cross",
  "Late defensive clearance",
  "First shot on target",
  "Manager shown shouting",
  "National anthem clip",
  "Player swaps boots"
];

const dailyBoards = Array.from({ length: 100 }, (_, boardIndex) =>
  Array.from({ length: 16 }, (__, squareIndex) => worldCupPrompts[(boardIndex * 7 + squareIndex * 5) % worldCupPrompts.length])
);

export function FootballBingoPage() {
  const { language } = useLanguage();
  const norwegian = language === "no";
  const dailyBoard = useMemo(() => getDailyPuzzle(dailyBoards), []);
  const storageKey = useMemo(() => getDailyStorageKey("tjt.world-cup-bingo.progress"), []);
  const [marked, setMarked] = useLocalStorage<string[]>(storageKey, []);
  const [customBoards, setCustomBoards] = useLocalStorage<CustomBoard[]>("tjt.world-cup-bingo.custom", []);
  const [selectedBoardId, setSelectedBoardId] = useState("daily");
  const [title, setTitle] = useState("");
  const [customText, setCustomText] = useState("");
  const selectedCustom = customBoards.find((board) => board.id === selectedBoardId);
  const board = selectedCustom?.prompts ?? dailyBoard;

  function toggleSquare(square: string) {
    setMarked(marked.includes(square) ? marked.filter((item) => item !== square) : [...marked, square]);
  }

  function createCustomBoard() {
    const prompts = customText
      .split("\n")
      .map((line) => line.trim())
      .filter(Boolean)
      .slice(0, 16);

    if (prompts.length !== 16) {
      return;
    }

    const boardToSave = {
      id: `${Date.now()}`,
      title: title.trim() || (norwegian ? "Mitt brett" : "My board"),
      prompts
    };

    setCustomBoards([boardToSave, ...customBoards].slice(0, 10));
    setSelectedBoardId(boardToSave.id);
    setMarked([]);
    setTitle("");
    setCustomText("");
  }

  return (
    <PageShell
      eyebrow={norwegian ? "VM-bingo" : "World Cup Bingo"}
      title={norwegian ? "Marker dagens 4x4 fotballbrett." : "Mark today's 4x4 football board."}
      intro={
        norwegian
          ? "Realistiske ting som kan skje i VM-kamper. Daglig brett byttes ved midnatt."
          : "Realistic things that can happen in World Cup matches. The daily board changes at midnight."
      }
    >
      <div className="mx-auto max-w-5xl">
        <details className="brand-panel rounded-lg p-5">
          <summary className="cursor-pointer font-semibold">{norwegian ? "Slik spiller du" : "How it works"}</summary>
          <p className="brand-copy mt-3 leading-7">
            {norwegian
              ? "Marker ruter når hendelser skjer i kampen. Få fire på rad vannrett, loddrett eller diagonalt. Egne brett lagres bare i denne nettleseren."
              : "Mark squares as events happen during a match. Get four in a row horizontally, vertically, or diagonally. Custom boards are saved only in this browser."}
          </p>
        </details>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <select
            value={selectedBoardId}
            onChange={(event) => {
              setSelectedBoardId(event.target.value);
              setMarked([]);
            }}
            className="brand-control rounded border border-line px-4 py-3 text-sm"
          >
            <option value="daily">{norwegian ? "Dagens brett" : "Daily board"}</option>
            {customBoards.map((customBoard) => (
              <option key={customBoard.id} value={customBoard.id}>
                {customBoard.title}
              </option>
            ))}
          </select>
          <button type="button" onClick={() => setMarked([])} className="text-sm font-semibold text-brand-blue">
            {norwegian ? "Nullstill markeringer" : "Reset marks"}
          </button>
        </div>

        <div className="mx-auto mt-6 grid max-w-3xl grid-cols-4 gap-3">
          {board.map((square) => {
            const active = marked.includes(square);

            return (
              <button
                key={square}
                type="button"
                onClick={() => toggleSquare(square)}
                className={`aspect-square rounded border border-line p-2 text-xs font-semibold sm:text-sm ${
                  active ? "bg-brand-blue text-white shadow-glow" : "brand-control"
                }`}
              >
                {square}
              </button>
            );
          })}
        </div>

        <details className="brand-panel mt-8 rounded-lg p-5">
          <summary className="cursor-pointer font-semibold">
            {norwegian ? "Lag lokalt bingo-brett" : "Create a local bingo board"}
          </summary>
          <div className="mt-5 grid gap-4">
            <input
              value={title}
              onChange={(event) => setTitle(event.target.value)}
              placeholder={norwegian ? "Navn på brettet" : "Board name"}
              className="brand-control rounded border border-line px-4 py-3"
            />
            <textarea
              value={customText}
              onChange={(event) => setCustomText(event.target.value)}
              placeholder={
                norwegian
                  ? "Skriv 16 linjer, én hendelse per linje"
                  : "Write 16 lines, one event per line"
              }
              className="brand-control min-h-48 rounded border border-line px-4 py-3"
            />
            <button
              type="button"
              onClick={createCustomBoard}
              disabled={customText.split("\n").filter((line) => line.trim()).length !== 16}
              className="w-fit rounded bg-brand-blue px-5 py-3 text-sm font-semibold text-white shadow-glow disabled:opacity-50"
            >
              {norwegian ? "Lagre lokalt" : "Save locally"}
            </button>
          </div>
        </details>
      </div>
    </PageShell>
  );
}
