import { Reveal } from "./Reveal";
import { SectionTitle } from "./SectionTitle";
import portfolioData from "@/data.json";

export function Stack() {
  const cats = portfolioData.stack;
  return (
    <section className="container-x pb-section">
      <SectionTitle>My Stack</SectionTitle>
      <div className="space-y-14">
        {cats.map((cat) => (
          <div key={cat.label} className="grid grid-cols-1 lg:grid-cols-12 gap-6 border-b border-border pb-10">
            <Reveal className="lg:col-span-5">
              <div className="text-2xl text-muted-foreground">{cat.label}</div>
            </Reveal>
            <div className="lg:col-span-7 flex flex-wrap gap-x-8 gap-y-4">
              {cat.items.map((it, i) => (
                <Reveal key={it} delay={i * 60}>
                  <span className="text-2xl">{it}</span>
                </Reveal>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}