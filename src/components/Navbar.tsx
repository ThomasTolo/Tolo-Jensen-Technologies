import { Globe2, Menu, Moon, Sun, X } from "lucide-react";
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import logo from "../assets/Company Logo.png";
import { useLanguage } from "../context/LanguageContext";
import { useTheme } from "../context/ThemeContext";

const links = [
  { to: "/apps", en: "Apps", no: "Apper" },
  { to: "/games", en: "Games", no: "Spill" },
  { to: "/about", en: "About", no: "Om" },
  { to: "/roadmap", en: "Roadmap", no: "Plan" },
  { to: "/contact", en: "Contact", no: "Kontakt" }
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const { language, toggleLanguage } = useLanguage();
  const themeIcons = { light: Sun, dark: Moon, system: Moon };
  const ThemeIcon = themeIcons[theme];
  const nextTheme = theme === "light" ? "dark" : "light";
  const languageLabel = language === "no" ? "🇳🇴 NO" : "🇬🇧 EN";
  const norwegian = language === "no";

  return (
    <header className="brand-nav fixed left-0 right-0 top-0 z-50 border-b border-line backdrop-blur-xl">
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8">
        <Link to="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
          <img src={logo} alt="Tolo Jensen Technologies" className="h-11 w-11 rounded object-cover shadow-glow" />
          <span className="brand-title text-sm font-semibold uppercase tracking-[0.22em]">
            TJT
          </span>
        </Link>

        <div className="hidden items-center gap-7 md:flex">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `text-sm font-medium ${isActive ? "text-brand-blue" : "brand-copy"}`
              }
            >
              {norwegian ? link.no : link.en}
            </NavLink>
          ))}
          <button
            type="button"
            title={norwegian ? `Tema: ${theme}` : `Theme: ${theme}`}
            onClick={() => setTheme(nextTheme)}
            className="brand-control grid h-10 w-10 place-items-center rounded border border-line"
          >
            <ThemeIcon size={18} />
          </button>
          <button
            type="button"
            title={norwegian ? "Språk: norsk" : "Language: English"}
            onClick={toggleLanguage}
            className="brand-control inline-flex h-10 items-center gap-2 rounded border border-line px-3 text-sm font-semibold"
          >
            <Globe2 size={17} />
            <span>{languageLabel}</span>
          </button>
        </div>

        <button
          type="button"
          title={norwegian ? "Meny" : "Menu"}
          onClick={() => setOpen((value) => !value)}
          className="brand-control grid h-10 w-10 place-items-center rounded border border-line md:hidden"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {open ? (
        <div className="brand-nav border-t border-line px-5 py-4 md:hidden">
          <div className="flex flex-col gap-4">
            {links.map((link) => (
              <NavLink key={link.to} to={link.to} onClick={() => setOpen(false)} className="text-base">
                {norwegian ? link.no : link.en}
              </NavLink>
            ))}
            <button
              type="button"
              onClick={() => setTheme(nextTheme)}
              className="brand-control flex items-center gap-3 rounded border border-line px-4 py-3 text-left"
            >
              <ThemeIcon size={18} />
              {norwegian ? "Tema" : "Theme"}: {theme}
            </button>
            <button
              type="button"
              onClick={toggleLanguage}
              className="brand-control flex items-center gap-3 rounded border border-line px-4 py-3 text-left"
            >
              <Globe2 size={18} />
              {norwegian ? "Språk" : "Language"}: {languageLabel}
            </button>
          </div>
        </div>
      ) : null}
    </header>
  );
}
