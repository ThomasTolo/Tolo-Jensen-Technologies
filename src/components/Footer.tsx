import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="brand-nav border-t border-line px-5 py-10 sm:px-8">
      <div className="brand-copy mx-auto flex max-w-7xl flex-col gap-6 text-sm md:flex-row md:items-center md:justify-between">
        <p>© {new Date().getFullYear()} Tolo Jensen Technologies.</p>
        <div className="flex flex-wrap gap-5">
          <Link to="/apps">Apps</Link>
          <Link to="/games">Games</Link>
          <Link to="/roadmap">Roadmap</Link>
          <Link to="/contact">Contact</Link>
        </div>
        <p>Try out our apps!</p>
      </div>
    </footer>
  );
}
