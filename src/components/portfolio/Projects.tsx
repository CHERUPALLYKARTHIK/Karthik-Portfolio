import { useState } from "react";
import { Reveal } from "./Reveal";
import { SectionTitle } from "./SectionTitle";
import portfolioData from "@/data.json";

export function Projects() {
  const projects = portfolioData.projects;
  const email = portfolioData.personal.email;
  const [hover, setHover] = useState<number | null>(null);

  return (
    <section id="projects" className="container-x pb-section relative">
      <SectionTitle>Projects</SectionTitle>

      <div className="group/list">
        {projects.map((p, i) => (
          <Reveal key={p.n} delay={i * 80}>
            <a
              href={p.href}
              target="_blank"
              rel="noreferrer"
              onMouseEnter={() => setHover(i)}
              onMouseLeave={() => setHover(null)}
              className="block py-10 border-b border-border transition-opacity duration-300"
              style={{ opacity: hover === null || hover === i ? 1 : 0.3 }}
            >
              <div className="grid grid-cols-12 gap-4 items-center">
                <div className="col-span-2 sm:col-span-1 text-muted-foreground font-display text-2xl">{p.n}</div>
                <div className="col-span-10 sm:col-span-7">
                  <div className="flex items-center gap-3 flex-wrap">
                    <h3 className="font-display text-3xl sm:text-4xl lg:text-5xl uppercase">{p.name}</h3>
                    <span className={`text-xs uppercase tracking-wider px-2 py-1 border ${p.badgeColor}`}>{p.badge}</span>
                  </div>
                </div>
                <div className="col-span-12 sm:col-span-4 text-muted-foreground text-sm flex flex-wrap gap-x-2 justify-start sm:justify-end">
                  {p.tags.map((t, j) => (
                    <span key={t}>{t}{j < p.tags.length - 1 ? " ·" : ""}</span>
                  ))}
                </div>
              </div>
            </a>
          </Reveal>
        ))}
      </div>

      {hover !== null && projects[hover] && (
        <div className="hidden lg:block fixed top-24 right-10 z-40 w-[200px] aspect-[3/4] overflow-hidden pointer-events-none animate-in fade-in duration-300">
          <div className={`w-full h-full bg-gradient-to-br ${projects[hover].preview.gradient} flex flex-col items-center justify-center gap-3`}>
            <div className="text-6xl">{projects[hover].preview.emoji}</div>
            <div className="font-display text-xs uppercase tracking-widest text-center px-3">{projects[hover].preview.label}</div>
          </div>
        </div>
      )}

      <div className="mt-20 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-border pt-10">
        <div className="font-display text-2xl sm:text-3xl uppercase">Have a project in mind?</div>
        <a href={`mailto:${email}`} className="text-lg text-primary hover:underline">{email}</a>
      </div>
    </section>
  );
}