import { Reveal } from "./Reveal";
import { SectionTitle } from "./SectionTitle";

const exps = [
  {
    company: "InternPro",
    role: "AI / ML Intern",
    period: "Jul 2025 – Sep 2025",
    bullets: [
      <>
        Built a diabetes prediction model using <strong className="text-foreground">Random Forest</strong> on 5,000+
        patient records, achieving <strong className="text-foreground">85% accuracy</strong> through preprocessing,
        feature engineering, and model evaluation.
      </>,
      <>
        Performed exploratory data analysis using <strong className="text-foreground">Pandas & Seaborn</strong> and
        identified 4 high-impact risk features, improving model precision by 12%.
      </>,
    ],
  },
  {
    company: "VJ Data Questers",
    role: "Event Volunteer & Design Lead",
    period: "Aug 2024 – Present",
    bullets: [
      <>
        Supported <strong className="text-foreground">4+ technical workshops</strong> reaching 300+ students across the
        college community.
      </>,
      <>
        Created <strong className="text-foreground">10+ branding and event assets</strong> for workshops, student
        events, and club promotions.
      </>,
    ],
  },
];

export function Experience() {
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
                  <li key={j}>{b}</li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </div>
    </section>
  );
}