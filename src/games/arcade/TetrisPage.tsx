import { useCallback, useEffect, useMemo, useState } from "react";
import type { ReactNode } from "react";
import { ArrowDown, ArrowLeft, ArrowRight, Pause, Play, RotateCw } from "lucide-react";
import { PageShell } from "../../components/PageShell";
import { useLanguage } from "../../context/LanguageContext";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { getDailyStorageKey } from "../utilities/dailyPuzzle";

type Mode = "daily" | "free";
type Cell = string | null;
type PieceType = (typeof pieceOrder)[number];
type ActivePiece = {
  type: PieceType;
  shape: number[][];
  row: number;
  column: number;
};

const boardRows = 20;
const boardColumns = 10;
const pieceOrder = ["I", "J", "L", "O", "S", "T", "Z"] as const;
const pieceColors: Record<PieceType, string> = {
  I: "bg-cyan-400",
  J: "bg-blue-500",
  L: "bg-orange-400",
  O: "bg-yellow-400",
  S: "bg-green-500",
  T: "bg-purple-500",
  Z: "bg-red-500"
};
const pieces = {
  I: [[1, 1, 1, 1]],
  J: [
    [1, 0, 0],
    [1, 1, 1]
  ],
  L: [
    [0, 0, 1],
    [1, 1, 1]
  ],
  O: [
    [1, 1],
    [1, 1]
  ],
  S: [
    [0, 1, 1],
    [1, 1, 0]
  ],
  T: [
    [0, 1, 0],
    [1, 1, 1]
  ],
  Z: [
    [1, 1, 0],
    [0, 1, 1]
  ]
};

export function TetrisPage() {
  const { language } = useLanguage();
  const norwegian = language === "no";
  const dailyTarget = useMemo(() => getDailyTarget("tetris", 1200, 3200, 100), []);
  const bestKey = useMemo(() => getDailyStorageKey("tjt.tetris.best"), []);
  const [dailyBest, setDailyBest] = useLocalStorage(bestKey, 0);
  const [mode, setMode] = useState<Mode>("daily");
  const [board, setBoard] = useState(createBoard);
  const [active, setActive] = useState(() => createPiece(getPieceType(0)));
  const [nextType, setNextType] = useState<PieceType>(getPieceType(1));
  const [pieceIndex, setPieceIndex] = useState(2);
  const [score, setScore] = useState(0);
  const [lines, setLines] = useState(0);
  const [running, setRunning] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  const reachedTarget = mode === "daily" && score >= dailyTarget;
  const visibleBoard = useMemo(() => drawActivePiece(board, active), [active, board]);

  const resetGame = useCallback((nextMode = mode) => {
    const firstType = getPieceType(0);
    const secondType = getPieceType(1);
    setMode(nextMode);
    setBoard(createBoard());
    setActive(createPiece(firstType));
    setNextType(secondType);
    setPieceIndex(2);
    setScore(0);
    setLines(0);
    setRunning(false);
    setGameOver(false);
  }, [mode]);

  const lockPiece = useCallback(() => {
    const merged = mergePiece(board, active);
    const { nextBoard, cleared } = clearLines(merged);
    const spawned = createPiece(nextType);

    setBoard(nextBoard);
    setActive(spawned);
    setNextType(getPieceType(pieceIndex));
    setPieceIndex((current) => current + 1);
    setLines((current) => current + cleared);
    setScore((current) => current + 25 + cleared * cleared * 100);

    if (hasCollision(nextBoard, spawned)) {
      setRunning(false);
      setGameOver(true);
    }
  }, [active, board, nextType, pieceIndex]);

  const moveActive = useCallback((rowDelta: number, columnDelta: number) => {
    setActive((current) => {
      const moved = { ...current, row: current.row + rowDelta, column: current.column + columnDelta };
      return hasCollision(board, moved) ? current : moved;
    });
  }, [board]);

  const softDrop = useCallback(() => {
    const moved = { ...active, row: active.row + 1 };

    if (hasCollision(board, moved)) {
      lockPiece();
      return;
    }

    setActive(moved);
    setScore((current) => current + 1);
  }, [active, board, lockPiece]);

  const rotateActive = useCallback(() => {
    setActive((current) => {
      const rotated = { ...current, shape: rotateShape(current.shape) };
      return hasCollision(board, rotated) ? current : rotated;
    });
  }, [board]);

  useEffect(() => {
    if (!running || gameOver || reachedTarget) {
      return;
    }

    const timer = window.setInterval(softDrop, Math.max(260, 760 - lines * 18));
    return () => window.clearInterval(timer);
  }, [gameOver, lines, reachedTarget, running, softDrop]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (!running || gameOver || reachedTarget) {
        return;
      }

      if (event.key === "ArrowLeft") {
        event.preventDefault();
        moveActive(0, -1);
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        moveActive(0, 1);
      } else if (event.key === "ArrowDown") {
        event.preventDefault();
        softDrop();
      } else if (event.key === "ArrowUp" || event.key === " ") {
        event.preventDefault();
        rotateActive();
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [gameOver, moveActive, reachedTarget, rotateActive, running, softDrop]);

  useEffect(() => {
    if (mode === "daily" && score > dailyBest) {
      setDailyBest(score);
    }
  }, [dailyBest, mode, score, setDailyBest]);

  return (
    <PageShell
      eyebrow={norwegian ? "Daglig blokkfall" : "Daily Block Drop"}
      title="Tetris"
      intro={
        norwegian
          ? "Stable blokker, rydd linjer og nå dagens poengmål, eller spill fritt uten mål."
          : "Stack blocks, clear lines, and reach today's target score, or play freely without a target."
      }
    >
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <section className="brand-panel rounded-lg p-4 sm:p-6">
          <div className="mx-auto grid max-w-[24rem] grid-cols-10 gap-1 rounded bg-slate-950/60 p-2">
            {visibleBoard.flatMap((row, rowIndex) =>
              row.map((cell, columnIndex) => (
                <div
                  key={`${rowIndex}-${columnIndex}`}
                  className={`aspect-square rounded-sm border border-white/10 ${cell ? pieceColors[cell as PieceType] : "bg-slate-900/80"}`}
                />
              ))
            )}
          </div>
        </section>

        <aside className="grid gap-4">
          <section className="brand-panel rounded-lg p-5">
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => resetGame("daily")}
                className={`rounded border border-line px-3 py-2 text-sm font-semibold ${mode === "daily" ? "bg-brand-blue text-white" : "brand-control"}`}
              >
                {norwegian ? "Dagens mål" : "Daily target"}
              </button>
              <button
                type="button"
                onClick={() => resetGame("free")}
                className={`rounded border border-line px-3 py-2 text-sm font-semibold ${mode === "free" ? "bg-brand-blue text-white" : "brand-control"}`}
              >
                {norwegian ? "Fri spilling" : "Free play"}
              </button>
            </div>
            <div className="mt-5 grid grid-cols-2 gap-3 text-sm">
              <Stat label={norwegian ? "Poeng" : "Score"} value={score} />
              <Stat label={norwegian ? "Linjer" : "Lines"} value={lines} />
              <Stat label={norwegian ? "Mål" : "Target"} value={mode === "daily" ? dailyTarget : "–"} />
              <Stat label={norwegian ? "Dagens beste" : "Daily best"} value={dailyBest} />
            </div>
            <p className="brand-copy mt-4 text-sm">
              {gameOver
                ? norwegian
                  ? "Spillet er over."
                  : "Game over."
                : reachedTarget
                  ? norwegian
                    ? "Dagens mål er nådd."
                    : "Daily target reached."
                  : running
                    ? norwegian
                      ? "Spillet kjører."
                      : "Game running."
                    : norwegian
                      ? "Start når du er klar."
                      : "Start when ready."}
            </p>
            <div className="mt-4 flex flex-wrap gap-2">
              <button
                type="button"
                onClick={() => setRunning((current) => !current)}
                disabled={gameOver || reachedTarget}
                className="inline-flex items-center gap-2 rounded bg-brand-blue px-4 py-3 text-sm font-semibold text-white shadow-glow disabled:opacity-50"
              >
                {running ? <Pause size={16} /> : <Play size={16} />}
                {running ? (norwegian ? "Pause" : "Pause") : norwegian ? "Start" : "Start"}
              </button>
              <button type="button" onClick={() => resetGame()} className="brand-control rounded border border-line px-4 py-3 text-sm font-semibold">
                {norwegian ? "Ny runde" : "New game"}
              </button>
            </div>
          </section>

          <section className="brand-panel rounded-lg p-5">
            <h2 className="text-lg font-semibold">{norwegian ? "Neste blokk" : "Next piece"}</h2>
            <div className="mt-4 grid w-fit grid-cols-4 gap-1 rounded bg-slate-950/50 p-2">
              {previewCells(nextType).map((cell, index) => (
                <div key={index} className={`h-6 w-6 rounded-sm ${cell ? pieceColors[nextType] : "bg-transparent"}`} />
              ))}
            </div>
          </section>

          <section className="brand-panel rounded-lg p-5">
            <h2 className="text-lg font-semibold">{norwegian ? "Kontroller" : "Controls"}</h2>
            <div className="mt-4 grid grid-cols-3 gap-2">
              <ControlButton label={<ArrowLeft size={18} />} onClick={() => moveActive(0, -1)} disabled={!running} />
              <ControlButton label={<RotateCw size={18} />} onClick={rotateActive} disabled={!running} />
              <ControlButton label={<ArrowRight size={18} />} onClick={() => moveActive(0, 1)} disabled={!running} />
              <div />
              <ControlButton label={<ArrowDown size={18} />} onClick={softDrop} disabled={!running} />
              <div />
            </div>
          </section>
        </aside>
      </div>
    </PageShell>
  );
}

function Stat({ label, value }: { label: string; value: number | string }) {
  return (
    <div className="brand-control rounded border border-line p-3">
      <p className="brand-copy text-xs">{label}</p>
      <p className="mt-1 text-xl font-semibold">{value}</p>
    </div>
  );
}

function ControlButton({ label, onClick, disabled }: { label: ReactNode; onClick: () => void; disabled: boolean }) {
  return (
    <button type="button" onClick={onClick} disabled={disabled} className="brand-control grid h-12 place-items-center rounded border border-line disabled:opacity-50">
      {label}
    </button>
  );
}

function createBoard(): Cell[][] {
  return Array.from({ length: boardRows }, () => Array<Cell>(boardColumns).fill(null));
}

function getPieceType(offset: number): PieceType {
  const day = Math.floor(new Date(new Date().getFullYear(), new Date().getMonth(), new Date().getDate()).getTime() / 86400000);
  return pieceOrder[(day * 5 + offset * 3) % pieceOrder.length];
}

function createPiece(type: PieceType): ActivePiece {
  return {
    type,
    shape: pieces[type],
    row: 0,
    column: Math.floor((boardColumns - pieces[type][0].length) / 2)
  };
}

function hasCollision(board: Cell[][], piece: ActivePiece) {
  return piece.shape.some((row, rowIndex) =>
    row.some((value, columnIndex) => {
      if (!value) {
        return false;
      }

      const nextRow = piece.row + rowIndex;
      const nextColumn = piece.column + columnIndex;
      return nextColumn < 0 || nextColumn >= boardColumns || nextRow >= boardRows || Boolean(board[nextRow]?.[nextColumn]);
    })
  );
}

function mergePiece(board: Cell[][], piece: ActivePiece) {
  const nextBoard = board.map((row) => [...row]);
  piece.shape.forEach((row, rowIndex) => {
    row.forEach((value, columnIndex) => {
      if (value && nextBoard[piece.row + rowIndex]) {
        nextBoard[piece.row + rowIndex][piece.column + columnIndex] = piece.type;
      }
    });
  });
  return nextBoard;
}

function clearLines(board: Cell[][]) {
  const remaining = board.filter((row) => row.some((cell) => !cell));
  const cleared = boardRows - remaining.length;
  return {
    nextBoard: [...Array.from({ length: cleared }, () => Array<Cell>(boardColumns).fill(null)), ...remaining],
    cleared
  };
}

function drawActivePiece(board: Cell[][], piece: ActivePiece) {
  return mergePiece(board, piece);
}

function rotateShape(shape: number[][]) {
  return shape[0].map((_, columnIndex) => shape.map((row) => row[columnIndex]).reverse());
}

function previewCells(type: PieceType) {
  const shape = pieces[type];
  return Array.from({ length: 16 }).map((_, index) => {
    const row = Math.floor(index / 4);
    const column = index % 4;
    return Boolean(shape[row]?.[column]);
  });
}

function getDailyTarget(seed: string, min: number, max: number, step: number) {
  const today = new Date();
  const value = Number(`${today.getFullYear()}${today.getMonth() + 1}${today.getDate()}`);
  const hash = seed.split("").reduce((total, letter) => total + letter.charCodeAt(0), value);
  const steps = Math.floor((max - min) / step);
  return min + (hash % (steps + 1)) * step;
}
