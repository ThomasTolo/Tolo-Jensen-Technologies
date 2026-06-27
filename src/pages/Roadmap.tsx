import { PageShell } from "../components/PageShell";
import { Timeline } from "../components/Timeline";

export function Roadmap() {
  return (
    <PageShell
      eyebrow="Roadmap"
      title="A focused path from brand foundation to product ecosystem."
      intro="The roadmap keeps the official website, Kollekt, and browser games moving in a deliberate order."
    >
      <Timeline />
    </PageShell>
  );
}
