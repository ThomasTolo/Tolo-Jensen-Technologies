import { Github, Linkedin, Mail } from "lucide-react";
import { PageShell } from "../components/PageShell";

export function Contact() {
  return (
    <PageShell
      eyebrow="Contact"
      title="Start a conversation with Tolo Jensen Technologies."
      intro="This frontend-only site avoids collecting form data. Email is the safest contact path until a backend and privacy policy are added."
    >
      <div className="flex flex-wrap gap-4">
        <a
          href="mailto:hello@tolojensen.com"
          className="inline-flex items-center gap-3 rounded bg-brand-blue px-5 py-3 text-sm font-semibold text-white shadow-glow"
        >
          <Mail size={18} />
          hello@tolojensen.com
        </a>
        <a
          href="https://www.linkedin.com/in/thomastolojensen/"
          target="_blank"
          rel="noreferrer"
          className="brand-control inline-flex items-center gap-3 rounded border border-line px-5 py-3 text-sm font-semibold"
        >
          <Linkedin size={18} />
          LinkedIn
        </a>
        <a
          href="https://github.com/ThomasTolo"
          target="_blank"
          rel="noreferrer"
          className="brand-control inline-flex items-center gap-3 rounded border border-line px-5 py-3 text-sm font-semibold"
        >
          <Github size={18} />
          GitHub
        </a>
      </div>
    </PageShell>
  );
}
