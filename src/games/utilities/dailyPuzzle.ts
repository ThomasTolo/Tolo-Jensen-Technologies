export function getDailyPuzzle<T>(puzzles: T[]) {
  return puzzles[getDailyPuzzleIndex(puzzles)];
}

export function getDailyPuzzleIndex<T>(puzzles: T[]) {
  const day = Math.floor(Date.now() / 86400000);
  return day % puzzles.length;
}

export function getDailyStorageKey(prefix: string) {
  const day = Math.floor(Date.now() / 86400000);
  return `${prefix}.${day}`;
}
