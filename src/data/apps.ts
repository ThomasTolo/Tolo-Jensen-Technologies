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
      "A mobile-first app for collectives and shared households: chores, expenses, shopping, calendar, chat, rewards, and party games in one polished place.",
    technologies: ["React", "TypeScript", "Capacitor", "Kotlin", "Spring Boot", "PostgreSQL", "WebSockets"],
    image: kollektImage,
    norwegian: {
      status: "Under utvikling",
      tagline: "Kollektivlivet, gjort enklere.",
      description:
        "En mobilførst app for kollektiv og delte hjem: oppgaver, utgifter, handleliste, kalender, chat, belønninger og festspill samlet på ett ryddig sted."
    },
    highlights: [
      "Split expenses and settle up with payment links",
      "Keep chores, shopping, events, quiet hours, and house rules together",
      "Make shared living more fun with XP, achievements, leaderboards, kudos, and in-app party games"
    ],
    norwegianHighlights: [
      "Del utgifter og gjør opp med betalingslenker",
      "Samle oppgaver, handling, kalender, stilletid og husregler",
      "Gjør kollektivlivet morsommere med XP, achievements, topplister, kudos og partyspill"
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
    technologies: ["React", "TypeScript"]
  },
  {
    slug: "app-3",
    name: "App 3",
    status: "Planned",
    description: "A polished software experience currently on the roadmap.",
    technologies: ["Product Design", "Frontend"]
  }
];
