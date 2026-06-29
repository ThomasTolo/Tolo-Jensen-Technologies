import { useEffect, useMemo, useState } from "react";
import { PageShell } from "../../components/PageShell";
import { useLanguage } from "../../context/LanguageContext";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { getDailyStorageKey } from "../utilities/dailyPuzzle";

// ── Constants ──────────────────────────────────────────────────────────────────

const ROWS      = 5;
const COLS      = 6;
const TRAY_SIZE = 7;
const TIMER_SEC = 5 * 60;

const THEMES = [
  { name: "Fruit",   noName: "Frukt",   items: ["🍎","🍊","🍋","🍇","🍓","🍑","🍒","🫐","🍈","🍍"] },
  { name: "Animals", noName: "Dyr",     items: ["🐶","🐱","🐸","🦊","🐻","🐼","🐨","🦁","🐯","🦝"] },
  { name: "Travel",  noName: "Reise",   items: ["✈️","🚂","🚗","🚀","🛸","⛵","🚁","🏎️","🛻","🚢"] },
  { name: "Nature",  noName: "Natur",   items: ["⭐","🌙","🌻","🍁","🌈","❄️","🌊","⚡","🌺","🍄"] },
  { name: "Ocean",   noName: "Hav",     items: ["🐠","🐙","🦈","🐋","🦀","🐚","🐡","🦑","🦞","🐬"] },
  { name: "Food",    noName: "Mat",     items: ["🍕","🍔","🌮","🍜","🍣","🍩","🧁","🍦","🥐","🍫"] },
];

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

// ── Types ──────────────────────────────────────────────────────────────────────

type Item  = string | null;
type Theme = typeof THEMES[number];
type Mode  = "daily" | "free";

// ── RNG ────────────────────────────────────────────────────────────────────────

function makeRng(seed: number) {
  let s = seed | 0;
  const next = () => { s = Math.imul(1664525, s) + 1013904223 | 0; return (s >>> 0) / 4294967296; };
  return {
    int: (lo: number, hi: number) => Math.floor(next() * (hi - lo + 1)) + lo,
    shuffle: <T,>(arr: T[]): T[] => {
      const a = [...arr];
      for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(next() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; }
      return a;
    },
  };
}

// ── Helpers ────────────────────────────────────────────────────────────────────

function getDailySeed(): number {
  const today = new Date();
  const start = new Date(today.getFullYear(), 0, 1);
  return DAILY_SEEDS[Math.floor((today.getTime() - start.getTime()) / 86400000) % 100];
}

function fmt(s: number) {
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
}

// ── Game generation ────────────────────────────────────────────────────────────

type GameData = { grid: Item[][]; theme: Theme };

function buildGame(seed: number): GameData {
  const rng = makeRng(seed);
  const theme = THEMES[rng.int(0, THEMES.length - 1)];

  // Fill grid: ROWS×COLS cells all occupied, items in multiples of 3
  const totalCells = ROWS * COLS; // 30
  const numTypes   = totalCells / 3;  // 10 types × 3 = 30
  const types = rng.shuffle([...theme.items]).slice(0, numTypes);
  const pool  = rng.shuffle(types.flatMap(t => [t, t, t]));

  const grid: Item[][] = [];
  for (let r = 0; r < ROWS; r++) {
    grid.push(pool.slice(r * COLS, (r + 1) * COLS));
  }

  return { grid, theme };
}

// ── Component ──────────────────────────────────────────────────────────────────

export function ShelfSortPage() {
  const { language } = useLanguage();
  const no = language === "no";

  const [mode,     setMode]     = useState<Mode>("daily");
  const [freeSeed, setFreeSeed] = useState(() => Math.floor(Math.random() * 1e6));
  const dailySeed  = useMemo(getDailySeed, []);
  const bestKey    = useMemo(() => getDailyStorageKey("tjt.ryddig3.best"), []);
  const [dailyBest, setDailyBest] = useLocalStorage(bestKey, 0);

  const seed = mode === "daily" ? dailySeed : freeSeed;
  const init = useMemo(() => buildGame(seed), [seed]);

  const [grid,     setGrid]     = useState<Item[][]>(init.grid);
  const [theme,    setTheme]    = useState<Theme>(init.theme);
  const [tray,     setTray]     = useState<Item[]>(Array(TRAY_SIZE).fill(null));
  // indices in the tray being cleared (animation)
  const [clearing, setClearing] = useState<Set<number>>(new Set());
  const [score,    setScore]    = useState(0);
  const [matchCnt, setMatchCnt] = useState(0);
  const [running,  setRunning]  = useState(false);
  const [won,      setWon]      = useState(false);
  const [lost,     setLost]     = useState(false);
  const [timeLeft, setTimeLeft] = useState(TIMER_SEC);
  const [dragSrc,  setDragSrc]  = useState<{ row: number; col: number } | null>(null);
  const [dragTgt,  setDragTgt]  = useState<{ row: number; col: number } | null>(null);

  // Reset on seed change
  useEffect(() => {
    const g = buildGame(seed);
    setGrid(g.grid); setTheme(g.theme);
    setTray(Array(TRAY_SIZE).fill(null));
    setClearing(new Set()); setScore(0); setMatchCnt(0);
    setRunning(false); setWon(false); setLost(false); setTimeLeft(TIMER_SEC);
  }, [seed]);

  // Countdown
  useEffect(() => {
    if (!running || won || lost) return;
    if (timeLeft <= 0) { setLost(true); setRunning(false); return; }
    const t = setInterval(() => setTimeLeft(s => s - 1), 1000);
    return () => clearInterval(t);
  }, [running, won, lost, timeLeft]);

  // Execute clear after 500 ms animation
  useEffect(() => {
    if (clearing.size === 0) return;
    const t = setTimeout(() => {
      const n = clearing.size / 3;
      // Remove cleared items and compact
      const remaining = tray.filter((_, i) => !clearing.has(i));
      const newTray: Item[] = [...remaining, ...Array(TRAY_SIZE - remaining.length).fill(null)];
      const newScore   = score + n * 200;
      const newMatchCnt = matchCnt + n;

      setTray(newTray);
      setScore(newScore);
      setMatchCnt(newMatchCnt);
      setClearing(new Set());

      if (mode === "daily" && newScore > dailyBest) setDailyBest(newScore);

      // Check win: grid fully empty and tray fully empty
      if (grid.every(row => row.every(c => c === null)) && newTray.every(c => c === null)) {
        setWon(true); setRunning(false);
      }
    }, 480);
    return () => clearTimeout(t);
  }, [clearing, tray, grid, score, matchCnt, mode, dailyBest, setDailyBest]);

  // ── Tap a grid item ──────────────────────────────────────────────────────

  function tapItem(row: number, col: number) {
    if (!running || won || lost || clearing.size > 0) return;
    const item = grid[row][col];
    if (!item) return;

    // Find first empty tray slot
    const slot = tray.findIndex(t => t === null);
    if (slot === -1) return; // tray full, can't pick

    // Move item to tray
    const newGrid = grid.map(r => [...r]);
    newGrid[row][col] = null;

    const newTray = [...tray];
    newTray[slot] = item;

    // Sort tray so matching items group together (by emoji codepoint)
    const filled = newTray.filter((x): x is string => x !== null).sort();
    const sorted: Item[] = [...filled, ...Array(TRAY_SIZE - filled.length).fill(null)];

    // Check for 3-match
    const counts: Record<string, number[]> = {};
    sorted.forEach((x, i) => {
      if (x) { if (!counts[x]) counts[x] = []; counts[x].push(i); }
    });

    let newClearing = new Set<number>();
    for (const [, idxs] of Object.entries(counts)) {
      if (idxs.length >= 3) idxs.slice(0, 3).forEach(i => newClearing.add(i));
    }

    setGrid(newGrid);
    setTray(sorted);

    if (newClearing.size > 0) {
      setClearing(newClearing);
    } else {
      // Check lose: tray full and no 3-match possible
      if (sorted.every(x => x !== null)) {
        setLost(true); setRunning(false);
      }
      // Check win
      if (newGrid.every(r => r.every(c => c === null)) && sorted.every(c => c === null)) {
        setWon(true); setRunning(false);
      }
    }
  }

  // ── Drag handlers ────────────────────────────────────────────────────────

  function onDragStart(e: React.DragEvent, row: number, col: number) {
    if (!running || won || lost || busy || !grid[row][col]) { e.preventDefault(); return; }
    setDragSrc({ row, col });
    e.dataTransfer.effectAllowed = "move";
  }

  function onDragOver(e: React.DragEvent, row: number, col: number) {
    if (!dragSrc) return;
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragTgt({ row, col });
  }

  function onDragLeave() { setDragTgt(null); }

  function onDrop(e: React.DragEvent, row: number, col: number) {
    e.preventDefault();
    if (!dragSrc || (dragSrc.row === row && dragSrc.col === col)) {
      setDragSrc(null); setDragTgt(null); return;
    }
    const newGrid = grid.map(r => [...r]);
    // Swap the two cells (works even if target is empty)
    [newGrid[row][col], newGrid[dragSrc.row][dragSrc.col]] =
      [newGrid[dragSrc.row][dragSrc.col], newGrid[row][col]];
    setGrid(newGrid);
    setDragSrc(null); setDragTgt(null);
  }

  function onDragEnd() { setDragSrc(null); setDragTgt(null); }

  function newGame(nextMode: Mode = mode) {
    if (nextMode === "free") setFreeSeed(Math.floor(Math.random() * 1e6));
    setMode(nextMode);
  }

  const itemsLeft = grid.flat().filter(Boolean).length;
  const trayUsed  = tray.filter(Boolean).length;
  const busy      = clearing.size > 0;

  // ── JSX ───────────────────────────────────────────────────────────────────

  return (
    <PageShell
      eyebrow={no ? "Daglig sortering" : "Daily Sort"}
      title={no ? "Ryddig" : "Tidyup"}
      intro={
        no
          ? `Trykk på gjenstander for å plukke dem opp. Samle 3 like i brettet nedenfor for å rydde dem. Tema: ${theme.noName}`
          : `Tap items to pick them up. Collect 3 identical in the tray below to clear them. Theme: ${theme.name}`
      }
    >
      <div className="grid gap-6 lg:grid-cols-[1fr_18rem]">

        {/* ── Board ─────────────────────────────────────────────────── */}
        <section className="flex flex-col gap-4">
          {/* Header */}
          <div className="flex items-center justify-between rounded-lg border border-line bg-slate-900/60 px-4 py-2 text-sm font-medium">
            <span className={timeLeft < 60 ? "font-bold text-red-400" : "brand-copy"}>
              ⏱ {fmt(timeLeft)}
            </span>
            <span className="font-semibold text-brand-blue">
              {no ? theme.noName : theme.name}
            </span>
            <span className="brand-copy">
              {no ? "Poeng" : "Score"}: <strong className="text-white">{score}</strong>
            </span>
          </div>

          {/* Shelf grid */}
          <div className="overflow-hidden rounded-xl border border-amber-900/40 bg-[#1a1008]">
            {grid.map((row, r) => (
              <div
                key={r}
                className="grid"
                style={{ gridTemplateColumns: `repeat(${COLS}, 1fr)` }}
              >
                {row.map((cell, c) => {
                  const isSrc = dragSrc?.row === r && dragSrc?.col === c;
                  const isTgt = dragTgt?.row === r && dragTgt?.col === c;
                  const canAct = running && !won && !lost && !busy;
                  return (
                    <button
                      key={c}
                      type="button"
                      draggable={!!cell && canAct}
                      onClick={() => tapItem(r, c)}
                      onDragStart={e => onDragStart(e, r, c)}
                      onDragOver={e => onDragOver(e, r, c)}
                      onDragLeave={onDragLeave}
                      onDrop={e => onDrop(e, r, c)}
                      onDragEnd={onDragEnd}
                      disabled={!canAct}
                      className={[
                        "group relative flex aspect-square select-none items-center justify-center",
                        "border-b-[3px] border-r border-amber-900/30 border-b-amber-800/60",
                        "text-3xl transition-all duration-100",
                        c === COLS - 1 ? "border-r-0" : "",
                        isSrc ? "opacity-40 scale-95" : "",
                        isTgt ? "ring-2 ring-inset ring-brand-blue bg-brand-blue/15" : "",
                        cell && canAct && !isSrc && !isTgt
                          ? "cursor-grab hover:bg-amber-600/15 hover:scale-105 active:cursor-grabbing active:scale-95"
                          : "cursor-default",
                        !cell ? "bg-[#120c04]/40" : "bg-[#1e1309]/60",
                      ].join(" ")}
                    >
                      <span className={cell ? "drop-shadow-sm pointer-events-none" : "opacity-0"}>
                        {cell ?? "·"}
                      </span>
                      <span className="pointer-events-none absolute bottom-0 left-0 right-0 h-1 bg-amber-950/40" />
                    </button>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Holding tray */}
          <div className="rounded-xl border border-line bg-slate-900/70 p-3">
            <p className="mb-2 text-center text-xs font-semibold uppercase tracking-widest brand-copy">
              {no ? "Brett" : "Tray"} — {trayUsed}/{TRAY_SIZE}
            </p>
            <div className="flex gap-1.5">
              {tray.map((item, i) => {
                const isClearing = clearing.has(i);
                return (
                  <div
                    key={i}
                    className={[
                      "flex flex-1 aspect-square items-center justify-center rounded-lg text-2xl transition-all duration-200",
                      isClearing  ? "scale-125 opacity-0 !duration-[480ms]" : "",
                      item && !isClearing
                        ? "border-2 border-brand-blue/40 bg-brand-blue/10 shadow-sm"
                        : "border border-white/8 bg-transparent",
                    ].join(" ")}
                  >
                    {item}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Status */}
          <div className="min-h-5 text-center text-sm">
            {won  && <p className="font-semibold text-green-400">🎉 {no ? "Alt ryddet – bra jobbet!" : "All cleared – well done!"}</p>}
            {lost && (
              <p className="font-semibold text-red-400">
                {timeLeft <= 0
                  ? (no ? "Tiden er ute!" : "Time's up!")
                  : (no ? "Brettet er fullt – prøv igjen!" : "Tray is full – try again!")}
              </p>
            )}
            {!running && !won && !lost && (
              <p className="brand-copy text-xs">{no ? "Trykk Start for å begynne." : "Press Start to begin."}</p>
            )}
          </div>
        </section>

        {/* ── Sidebar ───────────────────────────────────────────────── */}
        <aside className="grid gap-4 self-start">
          <section className="brand-panel rounded-lg p-5">
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
            <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
              <Stat label={no ? "Poeng"   : "Score"}    value={score} />
              <Stat label={no ? "Matcher" : "Matches"}  value={matchCnt} />
              <Stat label={no ? "Igjen"   : "Left"}     value={itemsLeft} />
              {mode === "daily"
                ? <Stat label={no ? "Beste" : "Best"}   value={dailyBest} />
                : <Stat label={no ? "Tema"  : "Theme"}  value={no ? theme.noName : theme.name} />
              }
            </div>
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

          <section className="brand-panel rounded-lg p-5">
            <h2 className="font-semibold">{no ? "Slik spiller du" : "How to play"}</h2>
            <ul className="mt-3 space-y-2 text-sm brand-copy leading-6">
              <li>👆 {no ? "Trykk på en gjenstand for å plukke den opp i brettet." : "Tap an item to pick it up into the tray."}</li>
              <li>🎯 {no ? "3 like gjenstander i brettet ryddes automatisk og gir 200 poeng." : "3 identical items in the tray auto-clear for 200 points."}</li>
              <li>⚠️ {no ? "Brettet har 7 plasser — la det ikke fylles helt opp!" : "The tray holds 7 items — don't let it fill up completely!"}</li>
              <li>🏆 {no ? "Rydd alle gjenstander fra hyllene for å vinne." : "Clear all items from the shelves to win."}</li>
            </ul>
          </section>
        </aside>
      </div>
    </PageShell>
  );
}

// ── Stat ──────────────────────────────────────────────────────────────────────

function Stat({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="brand-control rounded border border-line p-3">
      <p className="brand-copy text-xs">{label}</p>
      <p className="mt-1 text-xl font-semibold">{value}</p>
    </div>
  );
}
