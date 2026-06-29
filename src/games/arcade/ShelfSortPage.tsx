import { useEffect, useMemo, useRef, useState } from "react";
import { PageShell } from "../../components/PageShell";
import { useLanguage } from "../../context/LanguageContext";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { getDailyStorageKey } from "../utilities/dailyPuzzle";

// ── Constants ──────────────────────────────────────────────────────────────────

const ROWS = 5;
const COLS = 4;
const SHELF_SIZE = 3;   // items visible per side shelf
const MATCH_LEN  = 3;
const TIMER_SECONDS = 5 * 60;

const THEMES = [
  { name: "Fruit",    noName: "Frukt",   items: ["🍎","🍊","🍋","🍇","🍓","🍑"] },
  { name: "Animals",  noName: "Dyr",     items: ["🐶","🐱","🐸","🦊","🐻","🐼"] },
  { name: "Travel",   noName: "Reise",   items: ["✈️","🚂","🚗","🚀","🛸","⛵"] },
  { name: "Nature",   noName: "Natur",   items: ["⭐","🌙","🌻","🍁","🌈","❄️"] },
  { name: "Ocean",    noName: "Hav",     items: ["🐠","🐙","🦈","🐋","🦀","🐡"] },
  { name: "Music",    noName: "Musikk",  items: ["🎵","🎸","🎹","🎺","🎻","🥁"] },
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

// Each side shelf: 3 fixed slots + a refill counter (max 1 refill, then empties)
type ShelfState = { items: Item[]; refillsUsed: number };

type Sel =
  | { from: "left";   item: string; slotIdx: number }
  | { from: "right";  item: string; slotIdx: number }
  | { from: "center"; item: string; row: number; col: number };

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

/** Generate a batch of SHELF_SIZE items that are NOT all the same type. */
function makeBatch(theme: Theme, seed: number): string[] {
  const rng = makeRng(seed);
  const pool = rng.shuffle([...theme.items, ...theme.items]);
  const picks = pool.slice(0, SHELF_SIZE);
  // Ensure not all identical (would be trivially matchable from the shelf alone)
  if (picks.every(p => p === picks[0])) {
    const others = theme.items.filter(i => i !== picks[0]);
    if (others.length > 0) picks[SHELF_SIZE - 1] = others[rng.int(0, others.length - 1)];
  }
  return picks;
}

/**
 * Advance a side shelf after a center match:
 *   - 0 refills used → refill with a new batch (refillsUsed becomes 1)
 *   - 1 refill used  → empty the shelf       (refillsUsed becomes 2)
 *   - already empty  → no change
 */
function advanceShelf(shelf: ShelfState, theme: Theme, seed: number): ShelfState {
  if (shelf.refillsUsed === 0) {
    return { items: makeBatch(theme, seed), refillsUsed: 1 };
  }
  return { items: Array(SHELF_SIZE).fill(null), refillsUsed: 2 };
}

function getDailySeed(): number {
  const today = new Date();
  const start = new Date(today.getFullYear(), 0, 1);
  return DAILY_SEEDS[Math.floor((today.getTime() - start.getTime()) / 86400000) % 100];
}

function fmt(s: number) {
  return `${String(Math.floor(s / 60)).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
}

// ── Match detection ────────────────────────────────────────────────────────────

function findMatches(grid: Item[][]): Set<string> {
  const out = new Set<string>();
  for (let r = 0; r < ROWS; r++) {
    let s = 0;
    while (s < COLS) {
      const item = grid[r][s];
      if (!item) { s++; continue; }
      let e = s + 1;
      while (e < COLS && grid[r][e] === item) e++;
      if (e - s >= MATCH_LEN) for (let c = s; c < e; c++) out.add(`${r},${c}`);
      s = e;
    }
  }
  return out;
}

// ── Game generation ────────────────────────────────────────────────────────────

type GameData = { grid: Item[][]; leftShelf: ShelfState; rightShelf: ShelfState; theme: Theme };

function buildGame(seed: number): GameData {
  const rng = makeRng(seed);
  const theme  = THEMES[rng.int(0, THEMES.length - 1)];
  const numTypes = rng.int(4, theme.items.length);
  const types  = rng.shuffle([...theme.items]).slice(0, numTypes);

  // Center: 1–2 copies of each type (never 3, so no immediate match)
  const centerItems = rng.shuffle(types.flatMap(t => Array(rng.int(1, 2)).fill(t)));
  const positions   = rng.shuffle(Array.from({ length: ROWS * COLS }, (_, i) => i));
  const grid: Item[][] = Array.from({ length: ROWS }, () => Array(COLS).fill(null));
  centerItems.forEach((item, i) => {
    const pos = positions[i];
    grid[Math.floor(pos / COLS)][pos % COLS] = item;
  });

  // Side shelves: initial batch of SHELF_SIZE items each, refillsUsed = 0
  const leftShelf:  ShelfState = { items: makeBatch(theme, seed + 1), refillsUsed: 0 };
  const rightShelf: ShelfState = { items: makeBatch(theme, seed + 2), refillsUsed: 0 };

  return { grid, leftShelf, rightShelf, theme };
}

// ── Component ──────────────────────────────────────────────────────────────────

export function ShelfSortPage() {
  const { language } = useLanguage();
  const no = language === "no";

  const [mode,     setMode]     = useState<Mode>("daily");
  const [freeSeed, setFreeSeed] = useState(() => Math.floor(Math.random() * 1e6));
  const dailySeed  = useMemo(getDailySeed, []);
  const bestKey    = useMemo(() => getDailyStorageKey("tjt.ryddig2.best"), []);
  const [dailyBest, setDailyBest] = useLocalStorage(bestKey, 0);

  const seed = mode === "daily" ? dailySeed : freeSeed;
  const init = useMemo(() => buildGame(seed), [seed]);

  const [grid,       setGrid]       = useState<Item[][]>(init.grid);
  const [leftShelf,  setLeftShelf]  = useState<ShelfState>(init.leftShelf);
  const [rightShelf, setRightShelf] = useState<ShelfState>(init.rightShelf);
  const [theme,      setTheme]      = useState<Theme>(init.theme);
  const [sel,        setSel]        = useState<Sel | null>(null);
  const [clearing,   setClearing]   = useState<Set<string>>(new Set());
  const [score,      setScore]      = useState(0);
  const [matchCnt,   setMatchCnt]   = useState(0);
  const [running,    setRunning]    = useState(false);
  const [lost,       setLost]       = useState(false);
  const [timeLeft,   setTimeLeft]   = useState(TIMER_SECONDS);

  // Keep a ref so the clearing timeout can read the latest matchCnt without stale closure
  const matchCntRef = useRef(0);
  useEffect(() => { matchCntRef.current = matchCnt; }, [matchCnt]);

  // Reset when seed changes
  useEffect(() => {
    const g = buildGame(seed);
    setGrid(g.grid); setLeftShelf(g.leftShelf); setRightShelf(g.rightShelf); setTheme(g.theme);
    setSel(null); setClearing(new Set()); setScore(0); setMatchCnt(0);
    setRunning(false); setLost(false); setTimeLeft(TIMER_SECONDS);
  }, [seed]);

  // Countdown
  useEffect(() => {
    if (!running || lost) return;
    if (timeLeft <= 0) { setLost(true); setRunning(false); return; }
    const t = setInterval(() => setTimeLeft(s => s - 1), 1000);
    return () => clearInterval(t);
  }, [running, lost, timeLeft]);

  // After 500 ms animation: remove cleared cells and advance both shelves
  useEffect(() => {
    if (clearing.size === 0) return;
    const t = setTimeout(() => {
      const n = clearing.size / MATCH_LEN;
      const newCnt = matchCntRef.current + n;

      setGrid(prev => prev.map((row, r) => row.map((c, col) => clearing.has(`${r},${col}`) ? null : c)));
      setScore(prev => prev + Math.round(n * 150));
      setMatchCnt(newCnt);

      // Each centre match advances BOTH side shelves by one stage
      const batchSeed = Date.now();
      setLeftShelf(prev  => advanceShelf(prev,  theme, batchSeed));
      setRightShelf(prev => advanceShelf(prev,  theme, batchSeed + 1));

      setClearing(new Set());
    }, 500);
    return () => clearTimeout(t);
  }, [clearing, theme]);

  // Detect matches whenever the grid settles (and we are not mid-animation)
  useEffect(() => {
    if (!running || lost || clearing.size > 0) return;
    const m = findMatches(grid);
    if (m.size > 0) setClearing(m);
  }, [grid, clearing, running, lost]);

  // Save daily best
  useEffect(() => {
    if (mode === "daily" && score > dailyBest) setDailyBest(score);
  }, [score, mode, dailyBest, setDailyBest]);

  // ── Interaction ────────────────────────────────────────────────────────────

  function pickShelf(side: "left" | "right", slotIdx: number) {
    if (!running || lost || clearing.size > 0) return;
    const shelf = side === "left" ? leftShelf : rightShelf;
    const item  = shelf.items[slotIdx];
    if (!item) return;
    // Toggle deselect for same slot
    if (sel?.from === side && (sel as { slotIdx: number }).slotIdx === slotIdx) {
      setSel(null); return;
    }
    setSel({ from: side, item, slotIdx });
  }

  function clickCenter(row: number, col: number) {
    if (!running || lost || clearing.size > 0) return;
    const cell = grid[row][col];

    if (!sel) {
      if (cell) setSel({ from: "center", item: cell, row, col });
      return;
    }

    // Deselect same center cell
    if (sel.from === "center" && sel.row === row && sel.col === col) {
      setSel(null); return;
    }

    const newGrid = grid.map(r => [...r]);

    if (sel.from === "left" || sel.from === "right") {
      if (cell) {
        // Target occupied → switch selection to that centre cell instead
        setSel({ from: "center", item: cell, row, col });
        return;
      }
      // Place shelf item into empty cell, clear its slot
      newGrid[row][col] = sel.item;
      const si = sel.slotIdx;
      if (sel.from === "left") {
        setLeftShelf(prev => { const it = [...prev.items]; it[si] = null; return { ...prev, items: it }; });
      } else {
        setRightShelf(prev => { const it = [...prev.items]; it[si] = null; return { ...prev, items: it }; });
      }
    } else {
      // Swap two centre cells
      newGrid[row][col]         = sel.item;
      newGrid[sel.row][sel.col] = cell;
    }

    setGrid(newGrid);
    setSel(null);
  }

  function newGame(nextMode: Mode = mode) {
    if (nextMode === "free") setFreeSeed(Math.floor(Math.random() * 1e6));
    setMode(nextMode);
  }

  const busy      = clearing.size > 0;
  const itemsLeft = grid.flat().filter(Boolean).length;

  // ── JSX ───────────────────────────────────────────────────────────────────

  return (
    <PageShell
      eyebrow={no ? "Daglig sortering" : "Daily Sort"}
      title={no ? "Ryddig" : "Tidyup"}
      intro={
        no
          ? `Plasser gjenstander fra sidehyllene i midten og match 3 like i en rad. Tema: ${theme.noName}`
          : `Place items from the side shelves into the middle and match 3 in a row. Theme: ${theme.name}`
      }
    >
      <div className="grid gap-6 lg:grid-cols-[1fr_19rem]">

        {/* ── Board ─────────────────────────────────────────────────── */}
        <section className="brand-panel rounded-lg p-4 sm:p-5">
          {/* Header strip */}
          <div className="mb-4 flex items-center justify-between text-sm font-medium">
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

          {/* Left shelf | Centre grid | Right shelf */}
          <div className="flex items-start justify-center gap-2 sm:gap-3">

            <SideShelf
              shelf={leftShelf}
              side="left"
              selSlot={sel?.from === "left" ? (sel as { slotIdx: number }).slotIdx : null}
              disabled={!running || lost || busy}
              onPick={(i) => pickShelf("left", i)}
              no={no}
            />

            {/* Centre grid */}
            <div
              className="grid flex-1 gap-1 sm:gap-1.5"
              style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0,1fr))`, maxWidth: `${COLS * 68}px` }}
            >
              {grid.map((row, r) =>
                row.map((cell, c) => {
                  const key    = `${r},${c}`;
                  const isClr  = clearing.has(key);
                  const isSel  = sel?.from === "center" && sel.row === r && sel.col === c;
                  const canDrop = sel !== null && !isSel && !cell;

                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => clickCenter(r, c)}
                      disabled={!running || lost}
                      className={[
                        "relative flex aspect-square select-none items-center justify-center rounded-lg text-2xl transition-all duration-150",
                        isClr  ? "scale-125 opacity-0 !duration-500" : "",
                        isSel  ? "border-2 border-brand-blue bg-brand-blue/25 scale-110 shadow-glow" : "",
                        !isClr && !isSel && cell
                          ? "brand-panel border border-brand-blue/25 cursor-pointer hover:border-brand-blue hover:scale-105 active:scale-95"
                          : "",
                        !cell && canDrop
                          ? "border-2 border-dashed border-brand-blue/50 bg-brand-blue/5 cursor-pointer"
                          : "",
                        !cell && !canDrop && !isClr
                          ? "border border-white/5 cursor-default"
                          : "",
                      ].join(" ")}
                    >
                      {cell}
                    </button>
                  );
                })
              )}
            </div>

            <SideShelf
              shelf={rightShelf}
              side="right"
              selSlot={sel?.from === "right" ? (sel as { slotIdx: number }).slotIdx : null}
              disabled={!running || lost || busy}
              onPick={(i) => pickShelf("right", i)}
              no={no}
            />
          </div>

          {/* Hint / status */}
          <div className="mt-4 min-h-[1.4rem] text-center text-xs font-medium brand-copy">
            {sel && !lost && (
              sel.from === "center"
                ? (no ? "Klikk et annet felt for å flytte eller bytte." : "Click another cell to move or swap.")
                : (no ? `${sel.item} valgt — klikk en tom rute i midten.` : `${sel.item} selected — click an empty centre cell.`)
            )}
            {lost  && <span className="text-red-400 font-semibold">{no ? "Tiden er ute!" : "Time's up!"}</span>}
            {!running && !lost && !sel && <span>{no ? "Trykk Start for å begynne." : "Press Start to begin."}</span>}
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
              {!running && !lost ? (
                <button type="button" onClick={() => setRunning(true)} className="w-full rounded bg-brand-blue px-4 py-3 text-sm font-semibold text-white shadow-glow">
                  {no ? "Start" : "Start"}
                </button>
              ) : (
                <button type="button" onClick={() => newGame()} className="w-full brand-control rounded border border-line px-4 py-3 text-sm font-semibold">
                  {no ? "Ny runde" : "New game"}
                </button>
              )}
            </div>
          </section>

          <section className="brand-panel rounded-lg p-5">
            <h2 className="font-semibold">{no ? "Slik spiller du" : "How to play"}</h2>
            <ul className="mt-3 space-y-2 text-sm brand-copy leading-6">
              <li>👈 {no ? "Klikk én av de 3 gjenstander i sidehyllen for å velge den." : "Click any of the 3 side-shelf items to select it."}</li>
              <li>📥 {no ? "Klikk en tom rute i midten for å plassere den der." : "Click an empty centre cell to place it."}</li>
              <li>↔️ {no ? "Klikk en gjenstand i midten for å bytte plass med en annen." : "Click a centre item to swap it with another."}</li>
              <li>✨ {no ? "3 like ved siden av hverandre i en rad ryddes automatisk og gir 150 poeng." : "3 identical adjacent in a row auto-clear for 150 points."}</li>
              <li>🔄 {no ? "Etter første match: hyllen får 3 nye gjenstander. Etter andre match: hyllen tømmes." : "After 1st match: shelf refills with 3 new items. After 2nd: shelf empties."}</li>
            </ul>
          </section>
        </aside>
      </div>
    </PageShell>
  );
}

// ── SideShelf ─────────────────────────────────────────────────────────────────

function SideShelf({ shelf, side, selSlot, disabled, onPick, no }: {
  shelf: ShelfState;
  side: "left" | "right";
  selSlot: number | null;
  disabled: boolean;
  onPick: (slotIdx: number) => void;
  no: boolean;
}) {
  const isEmpty = shelf.items.every(i => i === null);

  return (
    <div className="flex w-12 flex-col items-center gap-1.5 sm:w-14">
      <p className="mb-0.5 text-xs font-bold text-brand-blue">{side === "left" ? "◀" : "▶"}</p>

      {Array.from({ length: SHELF_SIZE }).map((_, i) => {
        const item   = shelf.items[i];
        const isSel  = selSlot === i;
        return (
          <button
            key={i}
            type="button"
            onClick={() => item && onPick(i)}
            disabled={!item || disabled}
            className={[
              "flex h-11 w-11 select-none items-center justify-center rounded-lg text-xl transition-all duration-150 sm:h-12 sm:w-12 sm:text-2xl",
              item
                ? isSel
                  ? "border-2 border-brand-blue bg-brand-blue/20 scale-110 shadow-glow cursor-pointer"
                  : "brand-panel border border-brand-blue/30 cursor-pointer hover:border-brand-blue hover:scale-105 active:scale-95"
                : "border border-white/8 bg-transparent cursor-default",
            ].join(" ")}
          >
            {item}
          </button>
        );
      })}

      {isEmpty && shelf.refillsUsed >= 2 && (
        <p className="mt-1 text-center text-xs brand-copy leading-4">
          {no ? "Tom" : "Empty"}
        </p>
      )}
    </div>
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
