import { useEffect, useMemo, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";
import { PageShell } from "../../components/PageShell";
import { useLanguage } from "../../context/LanguageContext";
import { normalizeMusicAnswer, tuneGridDays, type MusicTrack } from "../../data/musicGames";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { getDailyPuzzle, getDailyStorageKey } from "../utilities/dailyPuzzle";
import { fetchTrackPreview, type TrackPreview } from "./preview";

type Direction = "across" | "down";

type Entry = {
  id: string;
  number: number;
  direction: Direction;
  row: number;
  column: number;
  answer: string;
  track: MusicTrack;
};

type Cell = {
  row: number;
  column: number;
  letter: string;
  entries: string[];
  number?: number;
};

type GridPuzzle = {
  cells: Record<string, Cell>;
  entries: Entry[];
  rows: number;
  columns: number;
};

const gridSize = 17;

export function TuneGridPage() {
  const { language } = useLanguage();
  const norwegian = language === "no";
  const tracks = useMemo(() => getDailyPuzzle(tuneGridDays), []);
  const puzzle = useMemo(() => buildTuneGrid(tracks), [tracks]);
  const storageKey = useMemo(() => getDailyStorageKey("tjt.tune-grid.cells.v2"), []);
  const [letters, setLetters] = useLocalStorage<Record<string, string>>(storageKey, {});
  const [selectedKey, setSelectedKey] = useState(Object.keys(puzzle.cells)[0]);
  const [activeEntryId, setActiveEntryId] = useState(puzzle.entries[0]?.id ?? "");
  const [previews, setPreviews] = useState<Record<string, TrackPreview | null>>({});
  const [playingEntryId, setPlayingEntryId] = useState<string | null>(null);
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const selectedCell = selectedKey ? puzzle.cells[selectedKey] : undefined;
  const activeEntry = puzzle.entries.find((entry) => entry.id === activeEntryId) ?? puzzle.entries[0];
  const solvedEntries = new Set(
    puzzle.entries
      .filter((entry) => getEntryValue(entry, letters) === entry.answer)
      .map((entry) => entry.id)
  );

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      const key = event.key;

      if (key === "ArrowRight" || key === "ArrowLeft" || key === "ArrowDown" || key === "ArrowUp") {
        event.preventDefault();
        moveSelection(key);
        return;
      }

      if (key === "Backspace") {
        event.preventDefault();
        setLetters((current) => ({ ...current, [selectedKey]: "" }));
        return;
      }

      if (/^[a-zA-Z0-9]$/.test(key)) {
        event.preventDefault();
        setLetters((current) => ({ ...current, [selectedKey]: key.toUpperCase() }));
        moveSelection(activeEntry?.direction === "down" ? "ArrowDown" : "ArrowRight");
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [activeEntry, selectedKey, setLetters]);

  function chooseCell(cell: Cell, entryId?: string) {
    setSelectedKey(cellKey(cell.row, cell.column));

    if (entryId) {
      setActiveEntryId(entryId);
      return;
    }

    if (!cell.entries.includes(activeEntryId)) {
      setActiveEntryId(cell.entries[0]);
    }
  }

  function moveSelection(key: string) {
    if (!selectedCell) {
      return;
    }

    const delta =
      key === "ArrowUp"
        ? [-1, 0]
        : key === "ArrowDown"
          ? [1, 0]
          : key === "ArrowLeft"
            ? [0, -1]
            : [0, 1];
    let row = selectedCell.row + delta[0];
    let column = selectedCell.column + delta[1];

    while (row >= 0 && row < puzzle.rows && column >= 0 && column < puzzle.columns) {
      const next = puzzle.cells[cellKey(row, column)];

      if (next) {
        chooseCell(next);
        return;
      }

      row += delta[0];
      column += delta[1];
    }
  }

  async function togglePreview(entry: Entry) {
    if (playingEntryId === entry.id) {
      audioRef.current?.pause();
      setPlayingEntryId(null);
      return;
    }

    const preview = previews[entry.id] ?? (await fetchTrackPreview(entry.track));
    setPreviews((current) => ({ ...current, [entry.id]: preview }));

    if (!preview) {
      return;
    }

    audioRef.current?.pause();
    const audio = new Audio(preview.previewUrl);
    audioRef.current = audio;
    setPlayingEntryId(entry.id);
    audio.addEventListener("ended", () => setPlayingEntryId(null));
    await audio.play();
  }

  return (
    <PageShell
      eyebrow={norwegian ? "Dagens lydkryss" : "Daily Tune Crossword"}
      title={norwegian ? "Lydkryss" : "Tune Crossword"}
      intro={
        norwegian
          ? "Løs låttitler i et kryssord av korte forhåndsvisninger. Bruk piltastene eller klikk i ruten."
          : "Solve song titles in a crossword of short previews. Use arrow keys or click through the grid."
      }
    >
      <div className="mx-auto max-w-7xl">
        <details className="brand-panel rounded-lg p-5">
          <summary className="cursor-pointer font-semibold">{norwegian ? "Slik spiller du" : "How it works"}</summary>
          <p className="brand-copy mt-3 leading-7">
            {norwegian
              ? "Alle svar er låttitler. Velg en rute eller en ledetråd, spill av previewen, og skriv låttittelen. Hint fyller inn riktig bokstav i ruten du står på."
              : "Every answer is a song title. Pick a square or clue, play the preview, and type the song title. Hints fill the correct letter in your current square."}
          </p>
        </details>

        <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1fr)_24rem]">
          <div className="brand-panel overflow-auto rounded-lg p-4">
            <div
              className="grid w-fit gap-1"
              style={{ gridTemplateColumns: `repeat(${puzzle.columns}, minmax(2rem, 2.5rem))` }}
            >
              {Array.from({ length: puzzle.rows }).flatMap((_, row) =>
                Array.from({ length: puzzle.columns }).map((__, column) => {
                  const key = cellKey(row, column);
                  const cell = puzzle.cells[key];

                  if (!cell) {
                    return <div key={key} className="h-9 w-9 sm:h-10 sm:w-10" />;
                  }

                  const active = selectedKey === key;
                  const inActiveEntry = cell.entries.includes(activeEntryId);
                  const solved = cell.entries.every((entryId) => solvedEntries.has(entryId));

                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => chooseCell(cell)}
                      className={`relative grid h-9 w-9 place-items-center rounded border text-sm font-semibold sm:h-10 sm:w-10 ${
                        solved
                          ? "border-brand-green bg-brand-green text-white"
                          : active
                            ? "border-brand-blue bg-brand-blue text-white"
                            : inActiveEntry
                              ? "border-brand-blue/60 bg-brand-blue/20"
                              : "brand-control"
                      }`}
                    >
                      {cell.number ? (
                        <span className="absolute left-1 top-0.5 text-[0.58rem] leading-none">{cell.number}</span>
                      ) : null}
                      {letters[key] ?? ""}
                    </button>
                  );
                })
              )}
            </div>
          </div>

          <aside className="grid gap-4">
            {(["across", "down"] as Direction[]).map((direction) => (
              <section key={direction} className="brand-panel rounded-lg p-5">
                <h2 className="text-xl font-semibold">{direction === "across" ? "Across" : "Down"}</h2>
                <div className="mt-4 grid gap-2">
                  {puzzle.entries
                    .filter((entry) => entry.direction === direction)
                    .map((entry) => {
                      const active = entry.id === activeEntryId;

                      return (
                        <button
                          key={entry.id}
                          type="button"
                          onClick={() => {
                            const start = puzzle.cells[cellKey(entry.row, entry.column)];
                            setActiveEntryId(entry.id);
                            if (start) {
                              chooseCell(start, entry.id);
                            }
                          }}
                          className={`rounded border border-line p-3 text-left text-sm ${active ? "bg-brand-blue text-white" : "brand-control"}`}
                        >
                          <span className="font-semibold">
                            {entry.number}
                            {direction === "across" ? "A" : "D"}
                          </span>{" "}
                          {norwegian
                            ? `Låttittel: ${entry.track.genre}-preview`
                            : `Song title: ${entry.track.genre} preview`}
                        </button>
                      );
                    })}
                </div>
              </section>
            ))}

            {activeEntry ? (
              <section className="brand-panel rounded-lg p-5">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-brand-blue">
                  {activeEntry.number}
                  {activeEntry.direction === "across" ? "A" : "D"}
                </p>
                <p className="brand-copy mt-3 text-sm">
                  {norwegian ? "Skriv låttittelen." : "Write the song title."}
                </p>
                <div className="mt-4 flex flex-wrap gap-3">
                  <button
                    type="button"
                    onClick={() => togglePreview(activeEntry)}
                    className="inline-flex items-center gap-2 rounded bg-brand-blue px-4 py-3 text-sm font-semibold text-white shadow-glow"
                  >
                    {playingEntryId === activeEntry.id ? <Pause size={16} /> : <Play size={16} />}
                    {playingEntryId === activeEntry.id ? (norwegian ? "Stopp" : "Stop") : (norwegian ? "Spill" : "Play")}
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (!selectedCell) {
                        return;
                      }

                      setLetters((current) => ({ ...current, [selectedKey]: selectedCell.letter }));
                    }}
                    className="brand-control rounded border border-line px-4 py-3 text-sm font-semibold"
                  >
                    {norwegian ? "Fyll bokstav" : "Fill letter"}
                  </button>
                </div>
                {previews[activeEntry.id]?.trackViewUrl ? (
                  <a
                    href={previews[activeEntry.id]?.trackViewUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="brand-copy mt-5 block text-sm"
                  >
                    {norwegian ? "Åpne i Apple Music" : "Open in Apple Music"}
                  </a>
                ) : null}
              </section>
            ) : null}
          </aside>
        </div>
      </div>
    </PageShell>
  );
}

function buildTuneGrid(tracks: MusicTrack[]): GridPuzzle {
  const candidates = tracks
    .map((trackItem) => ({ track: trackItem, answer: normalizeMusicAnswer(trackItem.title) }))
    .filter((item) => item.answer.length >= 4 && item.answer.length <= 15);
  const placements: Entry[] = [];
  const occupied = new Map<string, string>();

  candidates.slice(0, 1).forEach((item) => {
    const row = Math.floor(gridSize / 2);
    const column = Math.max(0, Math.floor((gridSize - item.answer.length) / 2));
    placements.push({ id: "entry-0", number: 0, direction: "across", row, column, answer: item.answer, track: item.track });
    writePlacement(occupied, placements[0]);
  });

  candidates.slice(1).some((item, index) => {
    const placement = findPlacement(item.answer, item.track, placements, occupied, index + 1);

    if (placement) {
      placements.push(placement);
      writePlacement(occupied, placement);
    }

    return placements.length >= 8;
  });

  if (placements.length < 5) {
    candidates.slice(placements.length, 8).forEach((item, index) => {
      const row = index * 2;
      const column = 0;
      const placement = {
        id: `entry-fallback-${index}`,
        number: 0,
        direction: "across" as Direction,
        row,
        column,
        answer: item.answer.slice(0, Math.min(item.answer.length, gridSize)),
        track: item.track
      };
      placements.push(placement);
      writePlacement(occupied, placement);
    });
  }

  const cells: Record<string, Cell> = {};
  placements.forEach((entry) => {
    entry.answer.split("").forEach((letter, index) => {
      const row = entry.row + (entry.direction === "down" ? index : 0);
      const column = entry.column + (entry.direction === "across" ? index : 0);
      const key = cellKey(row, column);
      const existing = cells[key];

      cells[key] = existing
        ? { ...existing, entries: [...existing.entries, entry.id] }
        : { row, column, letter, entries: [entry.id] };
    });
  });

  const numbered = assignNumbers(placements, cells);
  const maxRow = Math.max(...Object.values(cells).map((cell) => cell.row), 0);
  const maxColumn = Math.max(...Object.values(cells).map((cell) => cell.column), 0);

  return { cells, entries: numbered, rows: Math.min(gridSize, maxRow + 1), columns: Math.min(gridSize, maxColumn + 1) };
}

function findPlacement(
  answer: string,
  track: MusicTrack,
  placements: Entry[],
  occupied: Map<string, string>,
  idNumber: number
): Entry | null {
  for (const existing of placements) {
    for (let existingIndex = 0; existingIndex < existing.answer.length; existingIndex += 1) {
      for (let answerIndex = 0; answerIndex < answer.length; answerIndex += 1) {
        if (existing.answer[existingIndex] !== answer[answerIndex]) {
          continue;
        }

        const direction: Direction = existing.direction === "across" ? "down" : "across";
        const row = existing.row + (existing.direction === "down" ? existingIndex : 0) - (direction === "down" ? answerIndex : 0);
        const column =
          existing.column + (existing.direction === "across" ? existingIndex : 0) - (direction === "across" ? answerIndex : 0);
        const entry = { id: `entry-${idNumber}`, number: 0, direction, row, column, answer, track };

        if (canPlace(entry, occupied)) {
          return entry;
        }
      }
    }
  }

  return null;
}

function canPlace(entry: Entry, occupied: Map<string, string>) {
  if (entry.row < 0 || entry.column < 0) {
    return false;
  }

  for (let index = 0; index < entry.answer.length; index += 1) {
    const row = entry.row + (entry.direction === "down" ? index : 0);
    const column = entry.column + (entry.direction === "across" ? index : 0);

    if (row >= gridSize || column >= gridSize) {
      return false;
    }

    const existing = occupied.get(cellKey(row, column));

    if (existing && existing !== entry.answer[index]) {
      return false;
    }
  }

  return true;
}

function writePlacement(occupied: Map<string, string>, entry: Entry) {
  entry.answer.split("").forEach((letter, index) => {
    const row = entry.row + (entry.direction === "down" ? index : 0);
    const column = entry.column + (entry.direction === "across" ? index : 0);
    occupied.set(cellKey(row, column), letter);
  });
}

function assignNumbers(entries: Entry[], cells: Record<string, Cell>) {
  let nextNumber = 1;
  const numberedEntries = [...entries]
    .sort((first, second) => first.row - second.row || first.column - second.column)
    .map((entry) => {
      const startKey = cellKey(entry.row, entry.column);
      const existingNumber = cells[startKey].number;
      const number = existingNumber ?? nextNumber;

      if (!existingNumber) {
        cells[startKey].number = number;
        nextNumber += 1;
      }

      return { ...entry, number };
    });

  return numberedEntries.sort((first, second) => first.number - second.number || first.direction.localeCompare(second.direction));
}

function getEntryValue(entry: Entry, letters: Record<string, string>) {
  return entry.answer
    .split("")
    .map((_, index) => {
      const row = entry.row + (entry.direction === "down" ? index : 0);
      const column = entry.column + (entry.direction === "across" ? index : 0);
      return letters[cellKey(row, column)] ?? "";
    })
    .join("");
}

function cellKey(row: number, column: number) {
  return `${row},${column}`;
}
