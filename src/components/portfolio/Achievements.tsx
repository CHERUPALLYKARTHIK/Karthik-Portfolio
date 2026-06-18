import { Reveal } from "./Reveal";
import { SectionTitle } from "./SectionTitle";
import portfolioData from "@/data.json";

export function Achievements() {
  const achievements = portfolioData.achievements;
  const certs = portfolioData.certifications;

  return (
    <section className="container-x pb-section">
      <SectionTitle>Achievements & Certifications</SectionTitle>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
        <div>
          <h3 className="text-sm uppercase tracking-[0.25em] text-muted-foreground mb-8">Achievements</h3>
          <div className="space-y-6">
            {achievements.map((a, i) => (
              <Reveal key={a.title} delay={i * 100}>
                <div className="flex gap-4 border-b border-border pb-6">
                  <div className="text-3xl">{a.icon}</div>
                  <div>
                    <div className="font-display text-xl uppercase">{a.title}</div>
                    <div className="text-muted-foreground mt-1">{a.desc}</div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-sm uppercase tracking-[0.25em] text-muted-foreground mb-8">Certifications</h3>
          <div className="space-y-6">
            {certs.map((c, i) => (
              <Reveal key={c.name} delay={i * 100}>
                <div className="border-b border-border pb-6">
                  <div className="font-display text-xl uppercase">{c.name}</div>
                  <div className="text-muted-foreground mt-1">{c.issuer} — {c.date}</div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}