import { Menu, Moon, Monitor, Sun, X } from "lucide-react";
import { useState } from "react";
import { Link, NavLink } from "react-router-dom";
import logo from "../assets/Company Logo.png";
import { useTheme } from "../context/ThemeContext";

const links = [
  { to: "/apps", label: "Apps" },
  { to: "/games", label: "Games" },
  { to: "/about", label: "About" },
  { to: "/roadmap", label: "Roadmap" },
  { to: "/contact", label: "Contact" }
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const themeIcons = { light: Sun, dark: Moon, system: Monitor };
  const ThemeIcon = themeIcons[theme];

  return (
    <header className="fixed left-0 right-0 top-0 z-50 border-b border-line bg-ink/82 backdrop-blur-xl">
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-5 sm:px-8">
        <Link to="/" className="flex items-center gap-3" onClick={() => setOpen(false)}>
          <img src={logo} alt="Tolo Jensen Technologies" className="h-11 w-11 rounded object-cover shadow-glow" />
          <span className="text-sm font-semibold uppercase tracking-[0.22em] text-steel">
            TJT
          </span>
        </Link>

        <div className="hidden items-center gap-7 md:flex">
          {links.map((link) => (
            <NavLink
              key={link.to}
              to={link.to}
              className={({ isActive }) =>
                `text-sm font-medium ${isActive ? "text-brand-blue" : "text-slate-300"}`
              }
            >
              {link.label}
            </NavLink>
          ))}
          <button
            type="button"
            title={`Theme: ${theme}`}
            onClick={() => setTheme(theme === "system" ? "light" : theme === "light" ? "dark" : "system")}
            className="grid h-10 w-10 place-items-center rounded border border-line bg-white/5 text-slate-200"
          >
            <ThemeIcon size={18} />
          </button>
        </div>

        <button
          type="button"
          title="Menu"
          onClick={() => setOpen((value) => !value)}
          className="grid h-10 w-10 place-items-center rounded border border-line bg-white/5 md:hidden"
        >
          {open ? <X size={20} /> : <Menu size={20} />}
        </button>
      </nav>

      {open ? (
        <div className="border-t border-line bg-ink px-5 py-4 md:hidden">
          <div className="flex flex-col gap-4">
            {links.map((link) => (
              <NavLink key={link.to} to={link.to} onClick={() => setOpen(false)} className="text-base">
                {link.label}
              </NavLink>
            ))}
            <button
              type="button"
              onClick={() =>
                setTheme(theme === "system" ? "light" : theme === "light" ? "dark" : "system")
              }
              className="flex items-center gap-3 rounded border border-line px-4 py-3 text-left"
            >
              <ThemeIcon size={18} />
              Theme: {theme}
            </button>
          </div>
        </div>
      ) : null}
    </header>
  );
}
