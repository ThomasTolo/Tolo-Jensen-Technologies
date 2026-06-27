import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

type GameCardProps = {
  title: string;
  description: string;
  to: string;
};

export function GameCard({ title, description, to }: GameCardProps) {
  return (
    <Link
      to={to}
      className="brand-panel group rounded-lg p-6 transition hover:-translate-y-1 hover:shadow-glow"
    >
      <h2 className="text-2xl font-semibold">{title}</h2>
      <p className="brand-copy mt-3 leading-7">{description}</p>
      <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold">
        Open <ArrowRight size={16} className="transition group-hover:translate-x-1" />
      </span>
    </Link>
  );
}
