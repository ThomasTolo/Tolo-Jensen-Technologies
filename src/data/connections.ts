export type ConnectionsPuzzle = {
  groups: {
    title: string;
    words: string[];
  }[];
};

export const connectionsPuzzles: ConnectionsPuzzle[] = [
  {
    groups: [
      { title: "Frontend tools", words: ["React", "Vite", "Tailwind", "Router"] },
      { title: "Company pages", words: ["Home", "About", "Apps", "Contact"] },
      { title: "Daily games", words: ["Wordle", "Bingo", "Sudoku", "Memory"] },
      { title: "Brand traits", words: ["Clean", "Fast", "Polished", "Secure"] }
    ]
  },
  {
    groups: [
      { title: "Norway signals", words: ["Bergen", "Fjord", "Nordic", "Oslo"] },
      { title: "App states", words: ["Planned", "Live", "Beta", "Draft"] },
      { title: "Tech stack", words: ["React", "TypeScript", "Vercel", "Lucide"] },
      { title: "Motion words", words: ["Fade", "Slide", "Scale", "Reveal"] }
    ]
  }
];
