import kollektImage from "../assets/Kollekt.png";

export type AppInfo = {
  slug: string;
  name: string;
  status: string;
  description: string;
  technologies: string[];
  image?: string;
};

export const apps: AppInfo[] = [
  {
    slug: "kollekt",
    name: "Kollekt",
    status: "In Development",
    description:
      "A student-focused platform for collecting what matters: resources, plans, routines, and everyday campus life in one calm place.",
    technologies: ["React", "Capacitor", "Supabase"],
    image: kollektImage
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
