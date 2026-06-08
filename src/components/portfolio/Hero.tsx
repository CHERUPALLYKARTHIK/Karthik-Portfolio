import { useEffect, useState } from "react";
import { Reveal } from "./Reveal";

const ROLES = ["AI / ML Developer", "Full Stack Developer", "UI Designer", "Frontend Developer", "Edge AI Enthusiast"];

const NAME = "Karthik Cherupally";

function AnimatedName() {
  return (
    <h1
      className="font-display uppercase leading-[0.9] text-[11vw] sm:text-[9vw] lg:text-[7.5vw] text-center w-full mx-auto text-primary whitespace-nowrap"
      style={{
        WebkitTextStroke: "1.5px rgba(0, 255, 120, 0.55)",
        textShadow:
          "0 0 8px rgba(0, 255, 120, 0.45), 0 0 18px rgba(0, 255, 120, 0.35), 0 0 35px rgba(0, 255, 120, 0.22)",
      }}
    >
      {NAME.split("").map((char, index) => (
        <span
          key={index}
          className="inline-block animated-name-char"
          style={{
            animationDelay: `${index * 0.06}s`,
            marginRight: char === " " ? "0.25em" : "0",
          }}
        >
          {char === " " ? "\u00A0" : char}
        </span>
      ))}
    </h1>
  );
}

function TypingRoles() {
  const [index, setIndex] = useState(0);
  const [text, setText] = useState("");
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const full = ROLES[index];
    if (!deleting && text === full) {
      const t = setTimeout(() => setDeleting(true), 1600);
      return () => clearTimeout(t);
    }
    if (deleting && text === "") {
      setDeleting(false);
      setIndex((i) => (i + 1) % ROLES.length);
      return;
    }
    const t = setTimeout(
      () => {
        setText(
          deleting ? full.substring(0, text.length - 1) : full.substring(0, text.length + 1),
        );
      },
      deleting ? 50 : 90,
    );
    return () => clearTimeout(t);
  }, [text, deleting, index]);

  return (
    <span className="text-primary">
      {text}
      <span className="inline-block w-[0.08em] h-[0.8em] align-middle bg-primary ml-2 animate-pulse" />
    </span>
  );
}

export function Hero() {
  return (
    <section id="home" className="relative min-h-[530px] h-[100svh] flex flex-col justify-start container-x">
      <style>
        {`
          @keyframes nameFloatGlow {
            0% {
              transform: translateY(0) scale(1);
              opacity: 0.88;
              text-shadow:
                0 0 8px rgba(0, 255, 120, 0.35),
                0 0 18px rgba(0, 255, 120, 0.25),
                0 0 35px rgba(0, 255, 120, 0.15);
            }
            50% {
              transform: translateY(-8px) scale(1.03);
              opacity: 1;
              text-shadow:
                0 0 12px rgba(0, 255, 120, 0.6),
                0 0 28px rgba(0, 255, 120, 0.45),
                0 0 48px rgba(0, 255, 120, 0.3);
            }
            100% {
              transform: translateY(0) scale(1);
              opacity: 0.88;
              text-shadow:
                0 0 8px rgba(0, 255, 120, 0.35),
                0 0 18px rgba(0, 255, 120, 0.25),
                0 0 35px rgba(0, 255, 120, 0.15);
            }
          }

          .animated-name-char {
            animation: nameFloatGlow 2.8s ease-in-out infinite;
          }
        `}
      </style>

      <div className="flex-1 flex flex-col justify-start pt-20">
        <Reveal delay={100}>
          <AnimatedName />
        </Reveal>

        <Reveal delay={300}>
          <h2 className="font-display uppercase leading-[0.95] text-[10vw] sm:text-[8vw] lg:text-[6vw] min-h-[1.1em] mt-16">
            I'm <TypingRoles />
          </h2>
        </Reveal>

        <div className="mt-12 grid lg:grid-cols-2 gap-12 items-end">
          <div className="space-y-8 max-w-xl">
            <Reveal delay={500}>
              <p className="text-lg text-muted-foreground leading-relaxed">
                I’m a Computer Science student specializing in Data Science, building practical solutions across
                machine learning, full stack development, frontend development, and edge AI.
              </p>
            </Reveal>
            <Reveal delay={650}>
              <div className="flex flex-wrap items-center gap-6">
                <a
                  href="mailto:karthikvnr27@gmail.com"
                  className="cta-ripple inline-flex items-center px-8 py-4 bg-primary text-primary-foreground font-display uppercase tracking-[0.15em] text-sm"
                >
                  Let's Talk
                </a>
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <span className="w-2 h-2 rounded-full bg-foreground animate-pulse" />
                  Available for internship & entry level opportunities
                </div>
              </div>
            </Reveal>
          </div>

          <Reveal delay={800} className="lg:justify-self-end">
            <div className="flex lg:flex-col gap-8 lg:gap-4 lg:items-end">
              {[
                { v: "8.78", l: "CGPA" },
                { v: "4+", l: "Projects" },
              ].map((s) => (
                <div key={s.l} className="lg:text-right">
                  <div className="font-display text-4xl sm:text-5xl text-primary">{s.v}</div>
                  <div className="text-xs uppercase tracking-[0.2em] text-muted-foreground mt-1">{s.l}</div>
                </div>
              ))}
            </div>
          </Reveal>
        </div>
      </div>

      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 float-y">
        <svg width="24" height="40" viewBox="0 0 24 40" fill="none" className="text-muted-foreground">
          <path d="M2 4 L12 14 L22 4" stroke="currentColor" strokeWidth="2" />
          <path d="M2 20 L12 30 L22 20" stroke="currentColor" strokeWidth="2" />
        </svg>
      </div>
    </section>
  );
}