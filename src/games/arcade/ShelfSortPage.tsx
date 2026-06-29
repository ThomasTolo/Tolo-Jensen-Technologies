import { useCallback, useEffect, useMemo, useState } from "react";
import { PageShell } from "../../components/PageShell";
import { useLanguage } from "../../context/LanguageContext";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { getDailyStorageKey } from "../utilities/dailyPuzzle";

// ── Types ─────────────────────────────────────────────────────────────────────

type Mode = "daily" | "free";
type Cell = { item: string; locked: boolean } | null;
type Puzzle = { cells: Cell[]; rows: number; cols: number; theme: Theme; totalItems: number };
type Theme = { name: string; noName: string; items: readonly string[] };

// ── Constants ─────────────────────────────────────────────────────────────────

const BAR_SIZE = 7;
const TIMER_SECONDS = 5 * 60;

const THEMES: Theme[] = [
  { name: "Fruit",    noName: "Frukt",    items: ["🍎","🍊","🍋","🍇","🍓","🍑","🍒","🫐"] },
  { name: "Animals",  noName: "Dyr",      items: ["🐶","🐱","🐸","🦊","🐻","🐼","🐨","🦁"] },
  { name: "Travel",   noName: "Reise",    items: ["✈️","🚂","🚗","🛸","🚁","⛵","🏎️","🚀"] },
  { name: "Nature",   noName: "Natur",    items: ["⭐","🌙","🌻","🍁","🌈","❄️","🌊","⚡"] },
  { name: "Ocean",    noName: "Hav",      items: ["🐠","🐙","🦈","🐋","🦀","🐚","🐡","🦑"] },
  { name: "Music",    noName: "Musikk",   items: ["🎵","🎸","🎹","🎺","🎻","🥁","🎷","🎙️"] },
];

const GRID_CONFIGS = [
  { rows: 3, cols: 4 },
  { rows: 4, cols: 4 },
  { rows: 4, cols: 5 },
  { rows: 5, cols: 5 },
  { rows: 4, cols: 6 },
  { rows: 5, cols: 6 },
];

// 100 unique seeds — one per day of year, cycling
const DAILY_SEEDS = [
   7919, 15791,  3517, 22039,  9871, 41381, 17209, 53173, 29131, 61927,
   4001, 33391, 11317, 42839, 19423, 58631, 27107, 65537, 31397, 70249,
   5003, 38237, 13219, 45677, 21011, 62131, 29303, 73003, 35317, 78433,
   6007, 43013, 15121, 49057, 23209, 66407, 31489, 79531, 39113, 83431,
   7001, 47387, 17029, 52511, 25301, 70631, 33491, 83761, 41201, 87049,
   8009, 51341, 19031, 55619, 27403, 74701, 35527, 87929, 43123, 90401,
   9001, 54371, 20107, 58771, 29501, 78001, 37309, 91027, 45007, 93187,
  10007, 57367, 21013, 61519, 31607, 81203, 39313, 93943, 47017, 95929,
  11003, 60503, 22013, 64381, 33713, 84239, 41479, 96557, 49003, 98017,
  12007, 63299, 23011, 67219, 35803, 87101, 43577, 97219, 51001, 99991,
];

// ── Seeded RNG ────────────────────────────────────────────────────────────────

function makeRng(seed: number) {
  let s = seed | 0;
  const next = () => { s = Math.imul(1664525, s) + 1013904223 | 0; return (s >>> 0) / 4294967296; };
  return {
    int: (lo: number, hi: number) => Math.floor(next() * (hi - lo + 1)) + lo,
    pick: <T,>(arr: readonly T[]) => arr[Math.floor(next() * arr.length)] as T,
    shuffle: <T,>(arr: T[]): T[] => {
      const a = [...arr];
      for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(next() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
      return a;
    },
  };
}

// ── Puzzle generation ─────────────────────────────────────────────────────────

function generatePuzzle(seed: number): Puzzle {
  const rng = makeRng(seed);
  const cfg = GRID_CONFIGS[rng.int(0, GRID_CONFIGS.length - 1)];
  const theme = THEMES[rng.int(0, THEMES.length - 1)];

  const totalCells = cfg.rows * cfg.cols;
  const numTypes = Math.min(Math.floor(totalCells / 3), theme.items.length);
  const totalItems = numTypes * 3;

  const selectedTypes = rng.shuffle([...theme.items]).slice(0, numTypes);
  const pool = rng.shuffle(selectedTypes.flatMap(item => [item, item, item]));

  const positions = rng.shuffle(Array.from({ length: totalCells }, (_, i) => i));
  const grid: (string | null)[] = Array(totalCells).fill(null);
  pool.forEach((item, i) => { grid[positions[i]] = item; });

  // Lock ~25% of filled cells — but ensure every locked cell has an adjacent filled cell
  const filledPositions = positions.slice(0, totalItems);
  const lockCandidates = rng.shuffle(filledPositions).slice(0, Math.floor(totalItems * 0.25));
  const toLock = new Set(lockCandidates);

  const cells: Cell[] = grid.map((item, i) =>
    item ? { item, locked: toLock.has(i) } : null
  );

  // Guarantee ≥40% of filled cells are accessible from the start
  const target = Math.ceil(totalItems * 0.4);
  let unlocked = cells.filter(c => c && !c.locked).length;
  for (let i = 0; i < cells.length && unlocked < target; i++) {
    if (cells[i]?.locked) { cells[i] = { ...cells[i]!, locked: false }; unlocked++; }
  }

  return { cells, rows: cfg.rows, cols: cfg.cols, theme, totalItems };
}

function getDailySeed(): number {
  const today = new Date();
  const start = new Date(today.getFullYear(), 0, 1);
  const day = Math.floor((today.getTime() - start.getTime()) / 86400000);
  return DAILY_SEEDS[day % 100];
}

// ── Utilities ─────────────────────────────────────────────────────────────────

function adjacents(index: number, cols: number, rows: number): number[] {
  const r = Math.floor(index / cols), c = index % cols, out: number[] = [];
  if (r > 0) out.push(index - cols);
  if (r < rows - 1) out.push(index + cols);
  if (c > 0) out.push(index - 1);
  if (c < cols - 1) out.push(index + 1);
  return out;
}

function fmt(s: number): string {
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
}

// ── Component ─────────────────────────────────────────────────────────────────

export function ShelfSortPage() {
  const { language } = useLanguage();
  const no = language === "no";

  const dailySeed = useMemo(getDailySeed, []);
  const bestKey   = useMemo(() => getDailyStorageKey("tjt.stacker.best"), []);
  const [dailyBest, setDailyBest] = useLocalStorage(bestKey, 0);

  const [mode, setMode]         = useState<Mode>("daily");
  const [freeSeed, setFreeSeed] = useState(() => Math.floor(Math.random() * 1e6));
  const seed   = mode === "daily" ? dailySeed : freeSeed;
  const puzzle = useMemo(() => generatePuzzle(seed), [seed]);

  const [cells,    setCells]    = useState<Cell[]>([]);
  const [bar,      setBar]      = useState<(string | null)[]>(Array(BAR_SIZE).fill(null));
  const [score,    setScore]    = useState(0);
  const [matches,  setMatches]  = useState(0);
  const [running,  setRunning]  = useState(false);
  const [won,      setWon]      = useState(false);
  const [lost,     setLost]     = useState(false);
  const [timeLeft, setTimeLeft] = useState(TIMER_SECONDS);

  // Reset when puzzle changes
  useEffect(() => {
    setCells(puzzle.cells);
    setBar(Array(BAR_SIZE).fill(null));
    setScore(0); setMatches(0);
    setRunning(false); setWon(false); setLost(false);
    setTimeLeft(TIMER_SECONDS);
  }, [puzzle]);

  // Countdown
  useEffect(() => {
    if (!running || won || lost) return;
    if (timeLeft <= 0) { setLost(true); setRunning(false); return; }
    const t = setInterval(() => setTimeLeft(s => s - 1), 1000);
    return () => clearInterval(t);
  }, [running, won, lost, timeLeft]);

  const pickCell = useCallback((index: number) => {
    if (!running || won || lost) return;
    const cell = cells[index];
    if (!cell || cell.locked) return;

    const slot = bar.findIndex(b => b === null);
    if (slot === -1) return;

    // Place item in bar
    const newBar = [...bar];
    newBar[slot] = cell.item;

    // Remove from grid, unlock adjacent locked cells
    const newCells = [...cells];
    newCells[index] = null;
    adjacents(index, puzzle.cols, puzzle.rows).forEach(adj => {
      if (newCells[adj]?.locked) newCells[adj] = { ...newCells[adj]!, locked: false };
    });

    // Detect matches of 3
    const counts: Record<string, number> = {};
    newBar.forEach(b => { if (b) counts[b] = (counts[b] ?? 0) + 1; });

    let addedScore = 0, addedMatches = 0;
    let finalBar = [...newBar];
    for (const [item, cnt] of Object.entries(counts)) {
      if (cnt >= 3) {
        let removed = 0;
        finalBar = finalBar.map(b => (b === item && removed++ < 3) ? null : b);
        addedScore += 100;
        addedMatches += 1;
      }
    }

    // Sort non-null items so identical ones group together, pad with nulls
    const filled = finalBar.filter((b): b is string => b !== null).sort();
    const compacted: (string | null)[] = [...filled, ...Array(BAR_SIZE).fill(null)].slice(0, BAR_SIZE);

    const newScore   = score + addedScore;
    const newMatches = matches + addedMatches;

    setCells(newCells);
    setBar(compacted);
    setScore(newScore);
    setMatches(newMatches);

    // Win: all cells cleared and bar empty
    if (newCells.every(c => c === null) && compacted.every(b => b === null)) {
      setWon(true); setRunning(false);
      if (mode === "daily" && newScore > dailyBest) setDailyBest(newScore);
      return;
    }

    // Lose: bar completely full after pick (no match cleared space)
    if (compacted.every(b => b !== null)) { setLost(true); setRunning(false); }
  }, [running, won, lost, cells, bar, puzzle, score, matches, mode, dailyBest, setDailyBest]);

  function newGame(nextMode: Mode = mode) {
    if (nextMode === "free") setFreeSeed(Math.floor(Math.random() * 1e6));
    setMode(nextMode);
  }

  const itemsLeft = cells.filter(Boolean).length;
  const barUsed   = bar.filter(Boolean).length;

  return (
    <PageShell
      eyebrow={no ? "Daglig sortering" : "Daily Sort"}
      title={no ? "Ryddig" : "Tidyup"}
      intro={
        no
          ? `Tøm hyllene ved å matche tre like gjenstander. Tema i dag: ${puzzle.theme.noName}`
          : `Clear the shelves by matching three identical items. Today's theme: ${puzzle.theme.name}`
      }
    >
      <div className="grid gap-6 lg:grid-cols-[1fr_20rem]">

        {/* ── Board ──────────────────────────────────────── */}
        <section className="brand-panel rounded-lg p-4 sm:p-6">
          {/* Header strip */}
          <div className="mb-4 flex items-center justify-between text-sm font-medium">
            <span className={timeLeft < 60 ? "font-bold text-red-400" : "brand-copy"}>
              ⏱ {fmt(timeLeft)}
            </span>
            <span className="text-brand-blue font-semibold">
              {no ? puzzle.theme.noName : puzzle.theme.name}
            </span>
            <span className="brand-copy">
              {no ? "Poeng" : "Score"}: <strong className="text-white">{score}</strong>
            </span>
          </div>

          {/* Item grid */}
          <div
            className="mx-auto grid gap-1.5"
            style={{ gridTemplateColumns: `repeat(${puzzle.cols}, minmax(0, 1fr))`, maxWidth: `${puzzle.cols * 66}px` }}
          >
            {cells.map((cell, i) => (
              <button
                key={i}
                type="button"
                onClick={() => pickCell(i)}
                disabled={!cell || cell.locked || !running || won || lost}
                className={[
                  "relative flex aspect-square select-none items-center justify-center rounded-lg text-2xl transition-all duration-100",
                  !cell
                    ? "cursor-default border-transparent"
                    : cell.locked
                      ? "brand-panel cursor-not-allowed border border-white/10 opacity-50"
                      : "brand-panel cursor-pointer border border-brand-blue/25 hover:border-brand-blue hover:scale-105 active:scale-95",
                ].join(" ")}
              >
                {cell?.item}
                {cell?.locked && (
                  <span className="absolute inset-0 flex items-center justify-center rounded-lg bg-slate-900/50 text-sm">
                    🔒
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Holding bar */}
          <div className="mt-6">
            <p className="mb-2 text-center text-xs font-semibold uppercase tracking-widest brand-copy">
              {no ? "Holdelinje" : "Holding bar"} — {barUsed}/{BAR_SIZE}
            </p>
            <div className="mx-auto flex max-w-sm gap-1.5 rounded-lg border border-line bg-slate-900/40 p-2">
              {bar.map((item, i) => (
                <div
                  key={i}
                  className={[
                    "flex h-10 flex-1 items-center justify-center rounded text-xl transition-all duration-150",
                    item ? "brand-panel border border-brand-blue/20" : "border border-white/5",
                  ].join(" ")}
                >
                  {item}
                </div>
              ))}
            </div>
          </div>

          {/* Status line */}
          <div className="mt-4 min-h-[1.75rem] text-center text-sm">
            {won  && <p className="font-semibold text-green-400">{no ? "🎉 Alt ryddet – bra jobbet!" : "🎉 All cleared – well done!"}</p>}
            {lost && (
              <p className="font-semibold text-red-400">
                {timeLeft <= 0 ? (no ? "Tiden er ute!" : "Time's up!") : (no ? "Holdelinjen er full – prøv igjen!" : "Holding bar full – try again!")}
              </p>
            )}
            {!running && !won && !lost && (
              <p className="brand-copy">{no ? "Trykk Start når du er klar." : "Press Start when ready."}</p>
            )}
          </div>
        </section>

        {/* ── Sidebar ────────────────────────────────────── */}
        <aside className="grid gap-4 self-start">
          <section className="brand-panel rounded-lg p-5">
            {/* Mode switcher */}
            <div className="grid grid-cols-2 gap-2">
              {(["daily", "free"] as Mode[]).map(m => (
                <button
                  key={m}
                  type="button"
                  onClick={() => newGame(m)}
                  className={`rounded border px-3 py-2 text-sm font-semibold ${mode === m ? "bg-brand-blue border-brand-blue text-white" : "brand-control border-line"}`}
                >
                  {m === "daily" ? (no ? "Daglig" : "Daily") : (no ? "Fri spilling" : "Free play")}
                </button>
              ))}
            </div>

            {/* Stats grid */}
            <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
              <Stat label={no ? "Poeng" : "Score"}   value={score} />
              <Stat label={no ? "Matcher" : "Matches"} value={matches} />
              <Stat label={no ? "Igjen" : "Left"}     value={itemsLeft} />
              {mode === "daily"
                ? <Stat label={no ? "Beste" : "Best"} value={dailyBest} />
                : <Stat label={no ? "Tema" : "Theme"} value={no ? puzzle.theme.noName : puzzle.theme.name} />
              }
            </div>

            {/* Action button */}
            <div className="mt-4">
              {!running && !won && !lost ? (
                <button
                  type="button"
                  onClick={() => setRunning(true)}
                  className="w-full rounded bg-brand-blue px-4 py-3 text-sm font-semibold text-white shadow-glow"
                >
                  {no ? "Start" : "Start"}
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => newGame()}
                  className="w-full brand-control rounded border border-line px-4 py-3 text-sm font-semibold"
                >
                  {no ? "Ny runde" : "New game"}
                </button>
              )}
            </div>
          </section>

          {/* How to play */}
          <section className="brand-panel rounded-lg p-5">
            <h2 className="font-semibold">{no ? "Slik spiller du" : "How to play"}</h2>
            <ul className="mt-3 space-y-2 text-sm brand-copy leading-6">
              <li>👆 {no ? "Trykk et objekt for å plukke det opp." : "Tap an item to pick it up."}</li>
              <li>🎯 {no ? "Samle 3 like for å rydde dem." : "Collect 3 identical items to clear them."}</li>
              <li>🔒 {no ? "Låste objekt åpnes når naboen plukkes opp." : "Locked items unlock when a neighbour is picked up."}</li>
              <li>⚠️ {no ? "Holdelinjen har 7 plasser — la den ikke fylles!" : "The bar holds 7 items — don't let it fill up!"}</li>
              <li>⏱ {no ? "Rydd hyllene før de 5 minuttene er ute." : "Clear the shelves before 5 minutes are up."}</li>
            </ul>
          </section>
        </aside>
      </div>
    </PageShell>
  );
}

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="brand-control rounded border border-line p-3">
      <p className="brand-copy text-xs">{label}</p>
      <p className="mt-1 text-xl font-semibold">{value}</p>
    </div>
  );
}
