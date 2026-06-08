import { Reveal } from "./Reveal";
import { Mail, Linkedin, Github, Phone, ArrowUpRight } from "lucide-react";

const LINKS = [
  { icon: Mail, label: "Email", value: "karthikvnr27@gmail.com", href: "mailto:karthikvnr27@gmail.com" },
  { icon: Linkedin, label: "LinkedIn", value: "https://www.linkedin.com/in/karthik-cherupally-39643a2a3/", href: "https://www.linkedin.com/in/karthik-cherupally-39643a2a3/" },
  { icon: Github, label: "GitHub", value: "github.com/CHERUPALLYKARTHIK", href: "https://github.com/CHERUPALLYKARTHIK" },
  { icon: Phone, label: "Phone", value: "+91 8978248581", href: "tel:+918978248581" },
];

export function Contact() {
  return (
    <section id="contact" className="container-x pb-section pt-24">
      <Reveal>
        <h2 className="font-display uppercase leading-[0.9] text-[14vw] sm:text-[11vw] lg:text-[8vw]">
          Let's build
        </h2>
      </Reveal>
      <Reveal delay={120}>
        <h2 className="font-display uppercase leading-[0.9] text-[14vw] sm:text-[11vw] lg:text-[8vw] text-primary">
          something
        </h2>
      </Reveal>
      <Reveal delay={240}>
        <h2 className="font-display uppercase leading-[0.9] text-[14vw] sm:text-[11vw] lg:text-[8vw]">
          together.
        </h2>
      </Reveal>

      <div className="mt-12 grid lg:grid-cols-[1fr_1.2fr] gap-12">
        <Reveal delay={300}>
          <p className="text-lg text-muted-foreground leading-relaxed max-w-md">
            I’m open to internship and entry level opportunities in software development, AI/ML, and full stack projects.
            Feel free to reach out if my profile matches your team’s work.
          </p>
        </Reveal>

        <div className="space-y-4">
          {LINKS.map((l, i) => {
            const Icon = l.icon;
            return (
              <Reveal key={l.label} delay={350 + i * 100}>
                <a
                  href={l.href}
                  target={l.href.startsWith("http") ? "_blank" : undefined}
                  rel="noreferrer"
                  className="group flex items-center gap-5 p-5 rounded-lg border border-border bg-[var(--background-light)] hover:border-primary transition-colors"
                >
                  <span className="flex items-center justify-center w-12 h-12 rounded-md bg-background border border-border text-primary shrink-0">
                    <Icon size={20} />
                  </span>
                  <span className="flex-1 min-w-0">
                    <span className="block font-display uppercase tracking-[0.15em] text-sm">{l.label}</span>
                    <span className="block text-muted-foreground truncate">{l.value}</span>
                  </span>
                  <ArrowUpRight
                    size={20}
                    className="text-muted-foreground group-hover:text-primary group-hover:-translate-y-0.5 group-hover:translate-x-0.5 transition-transform shrink-0"
                  />
                </a>
              </Reveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}