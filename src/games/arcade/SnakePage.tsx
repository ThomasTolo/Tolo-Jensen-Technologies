import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import type { ReactNode } from "react";
import { ArrowDown, ArrowLeft, ArrowRight, ArrowUp, Pause, Play } from "lucide-react";
import { PageShell } from "../../components/PageShell";
import { useLanguage } from "../../context/LanguageContext";
import { useLocalStorage } from "../../hooks/useLocalStorage";
import { getDailyStorageKey } from "../utilities/dailyPuzzle";

type Mode = "daily" | "free";
type Direction = "up" | "down" | "left" | "right";
type Point = {
  row: number;
  column: number;
};

const boardSize = 18;
const startSnake: Point[] = [
  { row: 9, column: 8 },
  { row: 9, column: 7 },
  { row: 9, column: 6 }
];
const directionDelta: Record<Direction, Point> = {
  up: { row: -1, column: 0 },
  down: { row: 1, column: 0 },
  left: { row: 0, column: -1 },
  right: { row: 0, column: 1 }
};
const oppositeDirection: Record<Direction, Direction> = {
  up: "down",
  down: "up",
  left: "right",
  right: "left"
};

export function SnakePage() {
  const { language } = useLanguage();
  const norwegian = language === "no";
  const dailyTarget = useMemo(() => getDailyTarget("snake", 12, 36, 3), []);
  const bestKey = useMemo(() => getDailyStorageKey("tjt.snake.best"), []);
  const [dailyBest, setDailyBest] = useLocalStorage(bestKey, 0);
  const [mode, setMode] = useState<Mode>("daily");
  const [snake, setSnake] = useState<Point[]>(startSnake);
  const [food, setFood] = useState<Point>(() => createFood(startSnake, 1));
  const [direction, setDirection] = useState<Direction>("right");
  const [running, setRunning] = useState(false);
  const [gameOver, setGameOver] = useState(false);
  const [foodSeed, setFoodSeed] = useState(2);
  const directionRef = useRef<Direction>("right");
  const score = snake.length - startSnake.length;
  const reachedTarget = mode === "daily" && score >= dailyTarget;

  const resetGame = useCallback((nextMode = mode) => {
    const firstFood = createFood(startSnake, 1);
    setMode(nextMode);
    setSnake(startSnake);
    setFood(firstFood);
    setFoodSeed(2);
    setDirection("right");
    directionRef.current = "right";
    setRunning(false);
    setGameOver(false);
  }, [mode]);

  const setNextDirection = useCallback((nextDirection: Direction) => {
    if (oppositeDirection[directionRef.current] === nextDirection) {
      return;
    }

    directionRef.current = nextDirection;
    setDirection(nextDirection);
  }, []);

  const step = useCallback(() => {
    setSnake((currentSnake) => {
      const head = currentSnake[0];
      const delta = directionDelta[directionRef.current];
      const nextHead = { row: head.row + delta.row, column: head.column + delta.column };
      const eatsFood = samePoint(nextHead, food);
      const nextSnake = eatsFood ? [nextHead, ...currentSnake] : [nextHead, ...currentSnake.slice(0, -1)];

      if (isWallHit(nextHead) || nextSnake.slice(1).some((point) => samePoint(point, nextHead))) {
        setRunning(false);
        setGameOver(true);
        return currentSnake;
      }

      if (eatsFood) {
        setFood(createFood(nextSnake, foodSeed));
        setFoodSeed((current) => current + 1);
      }

      return nextSnake;
    });
  }, [food, foodSeed]);

  useEffect(() => {
    if (!running || gameOver || reachedTarget) {
      return;
    }

    const timer = window.setInterval(step, Math.max(85, 170 - score * 2));
    return () => window.clearInterval(timer);
  }, [gameOver, reachedTarget, running, score, step]);

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === "ArrowUp") {
        event.preventDefault();
        setNextDirection("up");
      } else if (event.key === "ArrowDown") {
        event.preventDefault();
        setNextDirection("down");
      } else if (event.key === "ArrowLeft") {
        event.preventDefault();
        setNextDirection("left");
      } else if (event.key === "ArrowRight") {
        event.preventDefault();
        setNextDirection("right");
      }
    }

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, [setNextDirection]);

  useEffect(() => {
    if (mode === "daily" && score > dailyBest) {
      setDailyBest(score);
    }
  }, [dailyBest, mode, score, setDailyBest]);

  const cells = useMemo(() => {
    const snakeKeys = new Map(snake.map((point, index) => [pointKey(point), index]));
    return Array.from({ length: boardSize * boardSize }).map((_, index) => {
      const point = { row: Math.floor(index / boardSize), column: index % boardSize };
      const snakeIndex = snakeKeys.get(pointKey(point));

      if (samePoint(point, food)) {
        return "food";
      }

      if (snakeIndex === 0) {
        return "head";
      }

      if (typeof snakeIndex === "number") {
        return "body";
      }

      return "empty";
    });
  }, [food, snake]);

  return (
    <PageShell
      eyebrow={norwegian ? "Daglig slange" : "Daily Snake"}
      title="Snake"
      intro={
        norwegian
          ? "Spis mat, voks, unngå veggene og nå dagens mål, eller spill en fri runde for moro."
          : "Eat food, grow, avoid the walls, and hit today's target, or play a free round for fun."
      }
    >
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <section className="brand-panel rounded-lg p-4 sm:p-6">
          <div className="mx-auto grid max-w-[34rem] grid-cols-[repeat(18,minmax(0,1fr))] gap-1 rounded bg-slate-950/60 p-2">
            {cells.map((cell, index) => (
              <div
                key={index}
                className={`aspect-square rounded-sm border border-white/10 ${
                  cell === "head"
                    ? "bg-brand-blue shadow-glow"
                    : cell === "body"
                      ? "bg-brand-green"
                      : cell === "food"
                        ? "bg-yellow-400"
                        : "bg-slate-900/80"
                }`}
              />
            ))}
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
              <Stat label={norwegian ? "Lengde" : "Length"} value={snake.length} />
              <Stat label={norwegian ? "Mål" : "Target"} value={mode === "daily" ? dailyTarget : "–"} />
              <Stat label={norwegian ? "Dagens beste" : "Daily best"} value={dailyBest} />
            </div>
            <p className="brand-copy mt-4 text-sm">
              {gameOver
                ? norwegian
                  ? "Du traff veggen eller deg selv."
                  : "You hit the wall or yourself."
                : reachedTarget
                  ? norwegian
                    ? "Dagens mål er nådd."
                    : "Daily target reached."
                  : running
                    ? norwegian
                      ? `Retning: ${directionLabel(direction, norwegian)}.`
                      : `Direction: ${directionLabel(direction, norwegian)}.`
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
            <h2 className="text-lg font-semibold">{norwegian ? "Kontroller" : "Controls"}</h2>
            <div className="mt-4 grid grid-cols-3 gap-2">
              <div />
              <ControlButton label={<ArrowUp size={18} />} onClick={() => setNextDirection("up")} />
              <div />
              <ControlButton label={<ArrowLeft size={18} />} onClick={() => setNextDirection("left")} />
              <ControlButton label={<ArrowDown size={18} />} onClick={() => setNextDirection("down")} />
              <ControlButton label={<ArrowRight size={18} />} onClick={() => setNextDirection("right")} />
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

function ControlButton({ label, onClick }: { label: ReactNode; onClick: () => void }) {
  return (
    <button type="button" onClick={onClick} className="brand-control grid h-12 place-items-center rounded border border-line">
      {label}
    </button>
  );
}

function createFood(snake: Point[], seed: number): Point {
  const occupied = new Set(snake.map(pointKey));
  let index = getSeededIndex(seed);

  for (let attempt = 0; attempt < boardSize * boardSize; attempt += 1) {
    const point = { row: Math.floor(index / boardSize), column: index % boardSize };

    if (!occupied.has(pointKey(point))) {
      return point;
    }

    index = (index + 17) % (boardSize * boardSize);
  }

  return { row: 0, column: 0 };
}

function getSeededIndex(seed: number) {
  const today = new Date();
  const daySeed = today.getFullYear() * 10000 + (today.getMonth() + 1) * 100 + today.getDate();
  return (daySeed * 31 + seed * 47) % (boardSize * boardSize);
}

function samePoint(a: Point, b: Point) {
  return a.row === b.row && a.column === b.column;
}

function pointKey(point: Point) {
  return `${point.row}-${point.column}`;
}

function isWallHit(point: Point) {
  return point.row < 0 || point.row >= boardSize || point.column < 0 || point.column >= boardSize;
}

function directionLabel(direction: Direction, norwegian: boolean) {
  const labels: Record<Direction, string> = norwegian
    ? { up: "opp", down: "ned", left: "venstre", right: "høyre" }
    : { up: "up", down: "down", left: "left", right: "right" };
  return labels[direction];
}

function getDailyTarget(seed: string, min: number, max: number, step: number) {
  const today = new Date();
  const value = Number(`${today.getFullYear()}${today.getMonth() + 1}${today.getDate()}`);
  const hash = seed.split("").reduce((total, letter) => total + letter.charCodeAt(0), value);
  const steps = Math.floor((max - min) / step);
  return min + (hash % (steps + 1)) * step;
}
