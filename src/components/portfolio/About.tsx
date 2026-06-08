import { Reveal } from "./Reveal";

export function About() {
  return (
    <section id="about" className="container-x pb-section pt-32">
      <Reveal>
        <p
          className="font-display text-3xl sm:text-5xl lg:text-6xl font-thin leading-tight tracking-tight max-w-5xl"
          style={{ fontWeight: 100 }}
        >
          I build practical systems across machine learning, full stack development, and edge AI with a focus on real
          world use cases.
        </p>
      </Reveal>

      <div className="border-b border-border my-20" />
      <Reveal>
        <div className="text-sm uppercase tracking-[0.25em] text-muted-foreground mb-16">This is me.</div>
      </Reveal>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <Reveal className="lg:col-span-5">
          <h3 className="font-display text-5xl sm:text-6xl lg:text-7xl uppercase leading-[0.9]">
            Hi, I'm <span className="text-primary">Karthik Cherupally.</span>
          </h3>
        </Reveal>
        <div className="lg:col-span-7 space-y-6 text-lg text-muted-foreground leading-relaxed">
          <Reveal delay={150}>
            <p>
              I'm a B.Tech student in{" "}
              <span className="text-foreground font-medium">Computer Science and Engineering Data Science</span> at
              VNR VJIET, with hands on experience in ML, web development, databases, and project based problem solving.
            </p>
          </Reveal>
          <Reveal delay={300}>
            <p>
              My work includes{" "}
              <span className="text-foreground font-medium">diabetes prediction, QR based healthcare access, farmer
              advisory platforms, and edge AI prototypes</span>. I like building projects end to end, from understanding
              the problem to developing models, interfaces, and working prototypes.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}