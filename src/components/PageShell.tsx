import { motion } from "framer-motion";
import type { ReactNode } from "react";

type PageShellProps = {
  eyebrow?: string;
  title: string;
  intro?: string;
  children: ReactNode;
};

export function PageShell({ eyebrow, title, intro, children }: PageShellProps) {
  return (
    <motion.main
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -18 }}
      transition={{ duration: 0.35, ease: "easeOut" }}
      className="mx-auto min-h-screen w-full max-w-7xl px-5 pb-20 pt-32 sm:px-8"
    >
      <section className="max-w-3xl">
        {eyebrow ? (
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.24em] text-brand-blue">
            {eyebrow}
          </p>
        ) : null}
        <h1 className="brand-title text-4xl font-semibold tracking-normal sm:text-6xl">
          {title}
        </h1>
        {intro ? (
          <p className="brand-copy mt-6 text-lg leading-8">{intro}</p>
        ) : null}
      </section>
      <section className="mt-12">{children}</section>
    </motion.main>
  );
}
