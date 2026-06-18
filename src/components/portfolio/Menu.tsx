import { useEffect, useState } from "react";
import portfolioData from "@/data.json";

const items = [
  { label: "Home", href: "#home", color: "#facc15" },
  { label: "About Me", href: "#about", color: "#38bdf8" },
  { label: "Experience", href: "#experience", color: "#22c55e" },
  { label: "Projects", href: "#projects", color: "#a855f7" },
];

export function Menu() {
  const [open, setOpen] = useState(false);
  const { email, socials } = portfolioData.personal;
  
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
  }, [open]);

  return (
    <>
      <button
        aria-label="Toggle menu"
        onClick={() => setOpen((v) => !v)}
        className="fixed top-6 right-6 z-[60] w-14 h-14 rounded-full bg-background-light border border-border flex flex-col items-center justify-center gap-1.5"
      >
        <span
          className="block h-0.5 w-6 bg-foreground transition-all"
          style={{ transform: open ? "translateY(4px) rotate(45deg)" : "" }}
        />
        <span
          className="block h-0.5 w-6 bg-foreground transition-all"
          style={{ transform: open ? "translateY(-4px) rotate(-45deg)" : "" }}
        />
      </button>

      <div
        className={`fixed inset-0 z-[55] bg-black/60 transition-opacity duration-500 ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setOpen(false)}
      />

      <aside
        className="fixed top-0 right-0 z-[58] h-screen w-full sm:w-[480px] bg-background-light overflow-hidden"
        style={{
          clipPath: open
            ? "circle(150% at 100% 0%)"
            : "circle(0% at 100% 0%)",
          transition: "clip-path 0.8s cubic-bezier(.77,0,.18,1)",
        }}
      >
        <div className="h-full flex flex-col justify-between p-10 pt-28">
          <nav className="flex flex-col gap-6">
            {items.map((it) => (
              <a
                key={it.label}
                href={it.href}
                onClick={() => setOpen(false)}
                className="group flex items-center gap-5 font-display text-5xl sm:text-6xl uppercase text-foreground hover:text-primary transition-colors"
              >
                <span
                  className="w-3 h-3 rounded-full transition-transform group-hover:scale-150"
                  style={{ background: it.color }}
                />
                {it.label}
              </a>
            ))}
          </nav>
          <div className="space-y-6">
            <div className="flex gap-6 text-sm uppercase tracking-wider">
              {socials.github && (
                <a href={socials.github} target="_blank" rel="noreferrer" className="hover:text-primary">GitHub</a>
              )}
              {socials.linkedin && (
                <a href={socials.linkedin} target="_blank" rel="noreferrer" className="hover:text-primary">LinkedIn</a>
              )}
            </div>
            <div>
              <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Get in touch</div>
              <a href={`mailto:${email}`} className="text-xl mt-1 inline-block hover:text-primary">{email}</a>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
