import { Reveal } from "./Reveal";
import { SectionTitle } from "./SectionTitle";
import portfolioData from "@/data.json";

export function Experience() {
  const exps = portfolioData.experience;
  return (
    <section id="experience" className="container-x py-section">
      <SectionTitle>My Experience</SectionTitle>
      <div>
        {exps.map((e, i) => (
          <Reveal key={e.company} delay={i * 100}>
            <div
              className={`py-12 grid grid-cols-1 lg:grid-cols-12 gap-6 ${i < exps.length - 1 ? "border-b border-border" : ""}`}
            >
              <div className="lg:col-span-5 space-y-3">
                <div className="text-xl text-muted-foreground">{e.company}</div>
                <div className="font-display text-4xl sm:text-5xl lg:text-6xl uppercase leading-none">{e.role}</div>
                <div className="text-muted-foreground">{e.period}</div>
              </div>
              <ul className="lg:col-span-7 list-disc pl-5 space-y-3 text-muted-foreground text-lg leading-relaxed self-center">
                {e.bullets.map((b, j) => (
                  <li key={j} dangerouslySetInnerHTML={{ __html: b }} />
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}