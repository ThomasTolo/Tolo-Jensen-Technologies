/
├── Home
├── About
├── My Apps
│     ├── Kollekt
│     ├── App 2
│     └── App 3
├── Games
│     ├── Daily Wordle
│     ├── Daily Connections
│     ├── Football Bingo
│     └── More coming...
├── Roadmap
├── Blog (optional)
└── Contact



### My recommended stack

**Framework**

- React 19
- TypeScript
- Vite

**Styling**

- Tailwind CSS
- Framer Motion (for smooth animations)

**Routing**

- React Router

**Icons**

- Lucide React

**State management**

- React Context for global state (theme, game settings)
- Zustand if the app grows larger

**Storage**

- Local Storage for:
    - Wordle progress
    - Connections progress
    - Theme preference
    - Statistics
    - Recently viewed apps

No backend required.



src/
│
├── assets/
├── components/
│   ├── Navbar
│   ├── Footer
│   ├── AppCard
│   ├── Hero
│   ├── Timeline
│   └── GameCard
│
├── pages/
│   ├── Home
│   ├── About
│   ├── Apps
│   ├── Games
│   ├── Roadmap
│   └── Contact
│
├── games/
│   ├── wordle/
│   ├── connections/
│   ├── bingo/
│   └── utilities/
│
├── data/
│   ├── apps.json
│   ├── roadmap.json
│   ├── wordleWords.ts
│   └── connections.ts
│
├── hooks/
├── utils/
├── styles/
└── App.tsx


### Daily games

Instead of generating games randomly, use a deterministic approach:

```
const day = Math.floor(Date.now() / 86400000);const todayPuzzle = puzzles[day % puzzles.length];
```

This means:

- Every visitor gets the same puzzle that day.
- No server is needed.
- Progress can be saved locally in the browser.

---

### Apps page

Store app information in a JSON or TypeScript file:

```
export const apps = [  {    name: "Kollekt",    status: "In Development",    description: "...",    technologies: ["React", "Capacitor", "Supabase"],    image: "/images/kollekt.png"  }];
```

Then simply map over the array to render cards.

---

### Games section

You could include cards like:

```
🎮 Daily Games□ Wordle□ Connections□ Football Bingo□ Guess the Logo□ Guess the Country□ Guess the Footballer□ Memory□ Sudoku
```

Each game can be its own React page.

---

### Theme

I'd support both light and dark mode from the start:

- 🌞 Light
- 🌙 Dark
- 💻 System preference

Persist the choice with `localStorage`.

---

### Animations

Use Framer Motion sparingly for:

- Page transitions
- Hover effects
- Card animations
- Hero entrance
- Timeline reveals

Subtle animations tend to feel more polished than constant movement.

---

### Deployment

A simple workflow works well:

```
VS Code    ↓GitHub    ↓Vercel    ↓yourcompany.com
```

Every push to your main branch automatically triggers a new deployment.

### Why not use Next.js?

If your site is primarily:

- a portfolio,
- company information,
- app showcase,
- roadmap,
- and browser-based games,

then **Vite + React** is simpler and very fast.

If, later on, you want:

- a blog with SEO-focused server rendering,
- user accounts,
- dashboards,
- authenticated areas,
- or server-side APIs,

then **Next.js** becomes a stronger choice.

Given what you've described—and knowing you're also building apps like **Kollekt**—I'd start with **React + TypeScript + Vite + Tailwind CSS**. It keeps development straightforward while leaving plenty of room to add backend services or migrate parts of the site later if your needs grow.
