import { Reveal } from "./Reveal";
import portfolioData from "@/data.json";

export function About() {
  const { highlight, heading, paragraphs } = portfolioData.about;
  return (
    <section id="about" className="container-x pb-section pt-32">
      <Reveal>
        <p
          className="font-display text-3xl sm:text-5xl lg:text-6xl font-thin leading-tight tracking-tight max-w-5xl"
          style={{ fontWeight: 100 }}
        >
          {highlight}
        </p>
      </Reveal>

      <div className="border-b border-border my-20" />
      <Reveal>
        <div className="text-sm uppercase tracking-[0.25em] text-muted-foreground mb-16">This is me.</div>
      </Reveal>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <Reveal className="lg:col-span-5">
          <h3 className="font-display text-5xl sm:text-6xl lg:text-7xl uppercase leading-[0.9]">
            {heading}
          </h3>
        </Reveal>
        <div className="lg:col-span-7 space-y-6 text-lg text-muted-foreground leading-relaxed">
          {paragraphs.map((p, i) => (
            <Reveal key={i} delay={150 * (i + 1)}>
              <p dangerouslySetInnerHTML={{ __html: p }} />
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}