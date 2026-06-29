import { Github, Linkedin, Mail } from "lucide-react";
import { PageShell } from "../components/PageShell";
import { useLanguage } from "../context/LanguageContext";

export function Contact() {
  const { language } = useLanguage();
  const norwegian = language === "no";
  return (
    <PageShell
      eyebrow={norwegian ? "Kontakt" : "Contact"}
      title={
        norwegian
          ? "Ta kontakt med Tolo Jensen Technologies."
          : "Get in touch with Tolo Jensen Technologies."
      }
      intro={
        norwegian
          ? "Send en e-post, så svarer jeg direkte."
          : "Send an email and I will reply directly."
      }
    >
      <div className="flex flex-wrap gap-4">
        <a
          href="mailto:bedrift.tolo@gmail.com"
          className="inline-flex items-center gap-3 rounded bg-brand-blue px-5 py-3 text-sm font-semibold text-white shadow-glow"
        >
          <Mail size={18} />
          bedrift.tolo@gmail.com
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
