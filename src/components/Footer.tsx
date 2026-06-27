import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="border-t border-line bg-ink/86 px-5 py-10 sm:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-6 text-sm text-slate-300 md:flex-row md:items-center md:justify-between">
        <p>© {new Date().getFullYear()} Tolo Jensen Technologies.</p>
        <div className="flex flex-wrap gap-5">
          <Link to="/apps">Apps</Link>
          <Link to="/games">Games</Link>
          <Link to="/roadmap">Roadmap</Link>
          <Link to="/contact">Contact</Link>
        </div>
        <p>HTTPS-first frontend hosted on Vercel.</p>
      </div>
    </footer>
  );
}
