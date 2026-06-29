import kollektImage from "../assets/Kollekt.png";

export type AppInfo = {
  slug: string;
  name: string;
  status: string;
  description: string;
  technologies: string[];
  image?: string;
  tagline?: string;
  norwegian?: {
    status: string;
    description: string;
    tagline: string;
  };
  highlights?: string[];
  norwegianHighlights?: string[];
  technicalHighlights?: string[];
};

export const apps: AppInfo[] = [
  {
    slug: "kollekt",
    name: "Kollekt",
    status: "In Development",
    tagline: "Shared living, made lighter.",
    description:
      "A mobile-first app for shared households: chores, expenses, shopping, calendar, chat, rewards, and party games in one calm place.",
    technologies: ["React", "TypeScript", "Capacitor", "Kotlin", "Spring Boot", "PostgreSQL", "WebSockets"],
    image: kollektImage,
    norwegian: {
      status: "Under utvikling",
      tagline: "Kollektivlivet, gjort enklere.",
      description:
        "En mobil-app for kollektiv: oppgaver, utgifter, handleliste, kalender, chat, belønninger og drikkespill samlet på ett sted."
    },
    highlights: [
      "Auto-rotate chores, track progress, and reward completed tasks with XP",
      "Plan shared life with shopping, calendar, house rules, chat, polls, and kudos",
      "Split expenses, track bottle deposits, compare leaderboards, and start party games"
    ],
    norwegianHighlights: [
      "Roter oppgaver automatisk, følg fremdrift og belønn fullførte gjøremål med XP",
      "Planlegg hverdagen med handleliste, kalender, husregler, chat, avstemninger og kudos",
      "Del utgifter, følg pant, sammenlign topplister og start partyspill"
    ],
    technicalHighlights: [
      "React + TypeScript Vite frontend with Capacitor iOS/Android shells",
      "Kotlin Spring Boot API with PostgreSQL/Supabase persistence",
      "JWT auth, refresh-token storage, social login, and password reset",
      "Realtime household updates over WebSockets",
      "Docker Compose and GitHub Actions CI/CD"
    ]
  },
  {
    slug: "app-2",
    name: "App 2",
    status: "Exploration",
    description: "A future product from Tolo Jensen Technologies.",
    technologies: ["React", "TypeScript"],
    norwegian: {
      status: "Utforskes",
      tagline: "Neste idé i arbeid.",
      description: "Et fremtidig produkt fra Tolo Jensen Technologies."
    }
  },
  {
    slug: "app-3",
    name: "App 3",
    status: "Planned",
    description: "A focused software product currently on the roadmap.",
    technologies: ["Product Design", "Frontend"],
    norwegian: {
      status: "Planlagt",
      tagline: "På vei inn i planen.",
      description: "Et fokusert programvareprodukt som ligger på planen."
    }
  }
];
