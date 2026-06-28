export function getDailyPuzzle<T>(puzzles: T[]) {
  return puzzles[getDailyPuzzleIndex(puzzles)];
}

export function getDailyPuzzleIndex<T>(puzzles: T[]) {
  return getLocalDayNumber() % puzzles.length;
}

export function getDailyStorageKey(prefix: string) {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const date = String(today.getDate()).padStart(2, "0");

  return `${prefix}.${year}-${month}-${date}`;
}

function getLocalDayNumber() {
  const today = new Date();
  const localMidnight = new Date(today.getFullYear(), today.getMonth(), today.getDate()).getTime();

  return Math.floor(localMidnight / 86400000);
}
