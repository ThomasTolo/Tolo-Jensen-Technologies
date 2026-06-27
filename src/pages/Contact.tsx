import { Mail } from "lucide-react";
import { PageShell } from "../components/PageShell";

export function Contact() {
  return (
    <PageShell
      eyebrow="Contact"
      title="Start a conversation with Tolo Jensen Technologies."
      intro="This frontend-only site avoids collecting form data. Email is the safest contact path until a backend and privacy policy are added."
    >
      <a
        href="mailto:hello@tolojensen.com"
        className="inline-flex items-center gap-3 rounded bg-brand-blue px-5 py-3 text-sm font-semibold text-white shadow-glow"
      >
        <Mail size={18} />
        hello@tolojensen.com
      </a>
    </PageShell>
  );
}
