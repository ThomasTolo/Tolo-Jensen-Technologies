export type ConnectionsGroup = {
  title: string;
  words: string[];
};

export type ConnectionsPuzzle = {
  groups: ConnectionsGroup[];
};

const groupBank: ConnectionsGroup[] = [
  { title: "Frontend tools", words: ["REACT", "VITE", "TAILWIND", "ROUTER"] },
  { title: "Company pages", words: ["HOME", "ABOUT", "APPS", "CONTACT"] },
  { title: "Daily games", words: ["WORDS", "BINGO", "SUDOKU", "MEMORY"] },
  { title: "Brand traits", words: ["CLEAN", "FAST", "POLISHED", "SECURE"] },
  { title: "Norway signals", words: ["BERGEN", "FJORD", "NORDIC", "OSLO"] },
  { title: "App states", words: ["PLANNED", "LIVE", "BETA", "DRAFT"] },
  { title: "Tech stack", words: ["TYPESCRIPT", "VERCEL", "LUCIDE", "SPRING"] },
  { title: "Motion words", words: ["FADE", "SLIDE", "SCALE", "REVEAL"] },
  { title: "Shared living", words: ["CHORES", "RENT", "ROOMS", "RULES"] },
  { title: "Study terms", words: ["LECTURE", "EXAM", "THESIS", "CREDITS"] },
  { title: "Machine learning", words: ["MODEL", "TRAIN", "FEATURE", "LABEL"] },
  { title: "Software verbs", words: ["BUILD", "TEST", "SHIP", "DEPLOY"] },
  { title: "UI pieces", words: ["BUTTON", "MODAL", "NAVBAR", "TOGGLE"] },
  { title: "Data stores", words: ["CACHE", "TABLE", "INDEX", "QUEUE"] },
  { title: "House planning", words: ["CALENDAR", "BUDGET", "SHOPPING", "DINNER"] },
  { title: "Football moments", words: ["PENALTY", "HEADER", "DERBY", "ASSIST"] },
  { title: "Browser basics", words: ["TAB", "COOKIE", "HISTORY", "BOOKMARK"] },
  { title: "Design goals", words: ["FOCUS", "BALANCE", "CONTRAST", "RHYTHM"] },
  { title: "Project roles", words: ["OWNER", "DESIGNER", "ENGINEER", "REVIEWER"] },
  { title: "Code nouns", words: ["MODULE", "HOOK", "STATE", "PROP"] },
  { title: "Calendar words", words: ["TODAY", "WEEK", "MONTH", "YEAR"] },
  { title: "Payment words", words: ["SPLIT", "SETTLE", "INVOICE", "RECEIPT"] },
  { title: "App navigation", words: ["BACK", "NEXT", "OPEN", "CLOSE"] },
  { title: "Learning branches", words: ["AI", "STATS", "MATH", "ECON"] },
  { title: "Team signals", words: ["KUDOS", "CHAT", "VOTE", "MENTION"] },
  { title: "Release stages", words: ["ALPHA", "PREVIEW", "LAUNCH", "PATCH"] },
  { title: "Visual assets", words: ["LOGO", "ICON", "IMAGE", "FONT"] },
  { title: "Quality checks", words: ["LINT", "BUILD", "AUDIT", "REVIEW"] },
  { title: "Input controls", words: ["SLIDER", "SELECT", "FIELD", "CHECKBOX"] },
  { title: "Cloud pieces", words: ["SERVER", "API", "DATABASE", "STORAGE"] },
  { title: "Student housing", words: ["KITCHEN", "LAUNDRY", "KEYS", "SOFA"] },
  { title: "Task flow", words: ["TODO", "DONE", "BLOCKED", "PRIORITY"] },
  { title: "Game feedback", words: ["CORRECT", "MISSED", "SOLVED", "STREAK"] },
  { title: "Security basics", words: ["LOGIN", "TOKEN", "SECRET", "ACCESS"] },
  { title: "Map words", words: ["NORTH", "SOUTH", "EAST", "WEST"] },
  { title: "Text actions", words: ["COPY", "PASTE", "UNDO", "REDO"] },
  { title: "Numbers in code", words: ["ARRAY", "COUNT", "TOTAL", "LIMIT"] },
  { title: "Meeting words", words: ["AGENDA", "NOTES", "ACTION", "FOLLOWUP"] },
  { title: "Energy words", words: ["SPARK", "LIGHT", "POWER", "CHARGE"] },
  { title: "Product values", words: ["USEFUL", "CALM", "CLEAR", "TRUSTED"] }
];

export const connectionsPuzzles: ConnectionsPuzzle[] = Array.from({ length: 100 }, (_, puzzleIndex) => ({
  groups: Array.from({ length: 4 }, (__, groupOffset) => {
    const groupIndex = (puzzleIndex * 7 + groupOffset * 11) % groupBank.length;

    return groupBank[groupIndex];
  })
}));
