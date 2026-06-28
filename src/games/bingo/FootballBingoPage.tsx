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

type WorldCupPrompt = {
  en: string;
  no: string;
};

const worldCupPrompts = [
  { en: "Goal from a set piece", no: "Mål etter dødball" },
  { en: "VAR check changes a call", no: "VAR endrer avgjørelse" },
  { en: "Penalty awarded", no: "Straffe dømmes" },
  { en: "Penalty missed or saved", no: "Straffe misses eller reddes" },
  { en: "Goal after 80 minutes", no: "Mål etter 80 minutter" },
  { en: "Header from a cross", no: "Heading etter innlegg" },
  { en: "Counter-attack goal", no: "Mål på kontring" },
  { en: "Substitute scores", no: "Innbytter scorer" },
  { en: "Captain gets an assist", no: "Kaptein får assist" },
  { en: "Goalkeeper makes a big save", no: "Keeper gjør stor redning" },
  { en: "Shot hits the post or bar", no: "Skudd i stolpe eller tverrligger" },
  { en: "Yellow card for time wasting", no: "Gult kort for drøying" },
  { en: "Free kick on target", no: "Frispark på mål" },
  { en: "Corner leads to a chance", no: "Corner blir til sjanse" },
  { en: "Offside goal ruled out", no: "Offsidemål annulleres" },
  { en: "Underdog scores first", no: "Underdog scorer først" },
  { en: "Favorite controls possession", no: "Favoritt styrer ballen" },
  { en: "Extra time is mentioned", no: "Ekstraomganger nevnes" },
  { en: "Player cramps late", no: "Spiller får krampe sent" },
  { en: "Defender blocks a shot", no: "Forsvarer blokkerer skudd" },
  { en: "Long-range shot", no: "Langskudd" },
  { en: "Own goal scare", no: "Nesten selvmål" },
  { en: "Teenager comes on", no: "Tenåring byttes inn" },
  { en: "Coach changes formation", no: "Trener endrer formasjon" },
  { en: "Crowd sings after a goal", no: "Publikum synger etter mål" },
  { en: "Handball appeal", no: "Hands-rop" },
  { en: "Keeper punches a cross", no: "Keeper bokser innlegg" },
  { en: "Striker misses a sitter", no: "Spiss bommer på stor sjanse" },
  { en: "Midfielder wins a duel", no: "Midtbanespiller vinner duell" },
  { en: "Fullback overlaps", no: "Back kommer på overlap" },
  { en: "Group table shown", no: "Gruppetabell vises" },
  { en: "Knockout bracket mentioned", no: "Sluttspilltre nevnes" },
  { en: "Stoppage-time chance", no: "Sjanse på overtid" },
  { en: "Two quick corners", no: "To raske cornere" },
  { en: "Player asks for a card", no: "Spiller ber om kort" },
  { en: "Cooling break or hydration talk", no: "Drikkepause eller væskeprat" },
  { en: "Tournament debut mentioned", no: "Turneringsdebut nevnes" },
  { en: "Past World Cup referenced", no: "Tidligere VM nevnes" },
  { en: "VAR line graphic shown", no: "VAR-linje vises" },
  { en: "Fans shown celebrating", no: "Jublende fans vises" },
  { en: "Tactical foul", no: "Taktisk frispark" },
  { en: "Goal checked for offside", no: "Mål sjekkes for offside" },
  { en: "Keeper catches a cross", no: "Keeper fanger innlegg" },
  { en: "Late defensive clearance", no: "Sen defensiv klarering" },
  { en: "First shot on target", no: "Første skudd på mål" },
  { en: "Manager shown shouting", no: "Trener vises ropende" },
  { en: "National anthem clip", no: "Klipp fra nasjonalsang" },
  { en: "Player swaps boots", no: "Spiller bytter sko" }
] satisfies WorldCupPrompt[];

const dailyPromptBoards = Array.from({ length: 100 }, (_, boardIndex) =>
  Array.from({ length: 16 }, (__, squareIndex) => worldCupPrompts[(boardIndex * 7 + squareIndex * 5) % worldCupPrompts.length])
);

export function FootballBingoPage() {
  const { language } = useLanguage();
  const norwegian = language === "no";
  const dailyPromptBoard = useMemo(() => getDailyPuzzle(dailyPromptBoards), []);
  const dailyBoard = useMemo(() => dailyPromptBoard.map((prompt) => (norwegian ? prompt.no : prompt.en)), [dailyPromptBoard, norwegian]);
  const storageKey = useMemo(() => getDailyStorageKey("tjt.world-cup-bingo.progress"), []);
  const [marked, setMarked] = useLocalStorage<string[]>(storageKey, []);
  const [customBoards, setCustomBoards] = useLocalStorage<CustomBoard[]>("tjt.world-cup-bingo.custom", []);
  const [selectedBoardId, setSelectedBoardId] = useState("daily");
  const [title, setTitle] = useState("");
  const [customPrompts, setCustomPrompts] = useState<string[]>(Array(16).fill(""));
  const selectedCustom = customBoards.find((board) => board.id === selectedBoardId);
  const board = selectedCustom?.prompts ?? dailyBoard;
  const filledCustomPrompts = customPrompts.map((prompt) => prompt.trim()).filter(Boolean);

  function toggleSquare(square: string) {
    setMarked(marked.includes(square) ? marked.filter((item) => item !== square) : [...marked, square]);
  }

  function createCustomBoard() {
    const prompts = customPrompts.map((prompt) => prompt.trim());

    if (prompts.some((prompt) => !prompt)) {
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
    setCustomPrompts(Array(16).fill(""));
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
            <p className="brand-copy text-sm">
              {norwegian
                ? "Fyll inn alle 16 rutene. Du ser brettet mens du lager det."
                : "Fill all 16 squares. You can see the board while creating it."}
            </p>
            <div className="grid grid-cols-4 gap-3">
              {customPrompts.map((prompt, index) => (
                <textarea
                  key={index}
                  value={prompt}
                  onChange={(event) => {
                    const nextPrompts = [...customPrompts];
                    nextPrompts[index] = event.target.value;
                    setCustomPrompts(nextPrompts);
                  }}
                  placeholder={`${index + 1}`}
                  className="brand-control aspect-square resize-none rounded border border-line p-2 text-center text-xs font-semibold sm:text-sm"
                />
              ))}
            </div>
            <button
              type="button"
              onClick={createCustomBoard}
              disabled={filledCustomPrompts.length !== 16}
              className="w-fit rounded bg-brand-blue px-5 py-3 text-sm font-semibold text-white shadow-glow disabled:opacity-50"
            >
              {norwegian ? `Lagre lokalt (${filledCustomPrompts.length}/16)` : `Save locally (${filledCustomPrompts.length}/16)`}
            </button>
          </div>
        </details>
      </div>
    </PageShell>
  );
}
