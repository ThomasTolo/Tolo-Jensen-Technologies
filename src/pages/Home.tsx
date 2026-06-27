import { motion } from "framer-motion";
import { AppCard } from "../components/AppCard";
import { GameCard } from "../components/GameCard";
import { Hero } from "../components/Hero";
import { apps } from "../data/apps";

export function Home() {
  return (
    <main>
      <Hero />
      <section className="mx-auto grid max-w-7xl gap-6 px-5 py-20 sm:px-8 lg:grid-cols-3">
        {["Student life", "Entertainment", "Useful tools"].map((label) => (
          <motion.article
            key={label}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            className="brand-panel rounded-lg p-6"
          >
            <h2 className="text-2xl font-semibold">{label}</h2>
            <p className="brand-copy mt-3 leading-7">
              Focused software experiences designed to feel calm, fast, and deliberate.
            </p>
          </motion.article>
        ))}
      </section>
      <section className="mx-auto max-w-7xl px-5 py-20 sm:px-8">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.24em] text-brand-blue">
              Featured app
            </p>
            <h2 className="mt-3 text-4xl font-semibold">Kollekt</h2>
          </div>
        </div>
        <div className="max-w-xl">
          <AppCard app={apps[0]} />
        </div>
      </section>
      <section className="mx-auto grid max-w-7xl gap-6 px-5 py-20 sm:px-8 md:grid-cols-3">
        <GameCard title="Daily Wordle" description="Guess today's five-letter word." to="/games/wordle" />
        <GameCard
          title="Daily Connections"
          description="Group sixteen words into four hidden categories."
          to="/games/connections"
        />
        <GameCard title="Football Bingo" description="A quick daily football-themed grid." to="/games/bingo" />
      </section>
    </main>
  );
}
