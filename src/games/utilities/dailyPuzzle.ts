export function getDailyPuzzle<T>(puzzles: T[]) {
  const day = Math.floor(Date.now() / 86400000);
  return puzzles[day % puzzles.length];
}
