import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import logo from "../assets/Company Logo.png";
import { useLanguage } from "../context/LanguageContext";

export function Hero() {
  const { language } = useLanguage();
  const norwegian = language === "no";

  return (
    <section className="mx-auto flex min-h-screen max-w-7xl flex-col justify-center px-5 pb-20 pt-32 sm:px-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.96 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.55, ease: "easeOut" }}
        className="grid gap-12 lg:grid-cols-[1fr_0.78fr] lg:items-center"
      >
        <div>
          <p className="mb-5 text-sm font-semibold uppercase tracking-[0.24em] text-brand-blue">
            Tolo Jensen Technologies
          </p>
          <h1 className="brand-title max-w-4xl text-5xl font-semibold tracking-normal sm:text-7xl">
            {norwegian
              ? "Apper du vil åpne. Spill du vil spille."
              : "Apps worth opening. Games worth playing."}
          </h1>
          <p className="brand-copy mt-7 max-w-2xl text-lg leading-8">
            {norwegian
              ? "Kollekt for kollektivet, sju daglige spill, og mer på vei."
              : "Kollekt for shared living, seven daily games, and more on the way."}
          </p>
          <div className="mt-9 flex flex-wrap gap-4">
            <Link
              to="/apps"
              className="inline-flex items-center gap-2 rounded bg-brand-blue px-5 py-3 text-sm font-semibold text-white shadow-glow"
            >
              {norwegian ? "Se appene" : "Explore apps"} <ArrowRight size={18} />
            </Link>
            <Link
              to="/games"
              className="brand-control inline-flex items-center gap-2 rounded border border-line px-5 py-3 text-sm font-semibold"
            >
              {norwegian ? "Spill dagens spill" : "Play daily games"}
            </Link>
          </div>
        </div>
        <div className="flex justify-center lg:justify-end">
          <img
            src={logo}
            alt="Tolo Jensen Technologies logo"
            className="aspect-square w-full max-w-md rounded-lg border border-line object-cover shadow-glow"
          />
        </div>
      </motion.div>
    </section>
  );
}
