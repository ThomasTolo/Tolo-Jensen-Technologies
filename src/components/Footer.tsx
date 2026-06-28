import { Link } from "react-router-dom";
import { useLanguage } from "../context/LanguageContext";

export function Footer() {
  const { language } = useLanguage();
  const norwegian = language === "no";

  return (
    <footer className="brand-nav border-t border-line px-5 py-10 sm:px-8">
      <div className="brand-copy mx-auto flex max-w-7xl flex-col gap-6 text-sm md:flex-row md:items-center md:justify-between">
        <p>© {new Date().getFullYear()} Tolo Jensen Technologies.</p>
        <div className="flex flex-wrap gap-5">
          <Link to="/apps">{norwegian ? "Apper" : "Apps"}</Link>
          <Link to="/games">{norwegian ? "Spill" : "Games"}</Link>
          <Link to="/roadmap">{norwegian ? "Plan" : "Roadmap"}</Link>
          <Link to="/contact">{norwegian ? "Kontakt" : "Contact"}</Link>
        </div>
        <p>{norwegian ? "Prøv det vi bygger." : "Try what we are building."}</p>
      </div>
    </footer>
  );
}
