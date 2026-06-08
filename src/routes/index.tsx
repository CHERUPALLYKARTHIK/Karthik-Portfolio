import { createFileRoute } from "@tanstack/react-router";
import { Cursor } from "@/components/portfolio/Cursor";
import { ParticleBackground } from "@/components/portfolio/ParticleBackground";
import { PageTransition } from "@/components/portfolio/PageTransition";
import { Menu } from "@/components/portfolio/Menu";
import { Hero } from "@/components/portfolio/Hero";
import { About } from "@/components/portfolio/About";
import { Stack } from "@/components/portfolio/Stack";
import { Experience } from "@/components/portfolio/Experience";
import { Projects } from "@/components/portfolio/Projects";
import { Achievements } from "@/components/portfolio/Achievements";
import { Contact } from "@/components/portfolio/Contact";
import { Footer } from "@/components/portfolio/Footer";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Karthik Cherupally — AI / ML Developer" },
      { name: "description", content: "Portfolio of Karthik Cherupally — AI/ML & Full Stack Developer specialising in Data Science, edge AI, and end-to-end ML systems." },
      { property: "og:title", content: "Karthik Cherupally — AI / ML Developer" },
      { property: "og:description", content: "AI/ML & Full Stack Developer. Building edge AI, ML pipelines, and real-world solutions end to end." },
      { property: "og:type", content: "website" },
      { property: "og:url", content: "/" },
    ],
    links: [
      { rel: "canonical", href: "/" },
      { rel: "preconnect", href: "https://fonts.googleapis.com" },
      { rel: "preconnect", href: "https://fonts.gstatic.com", crossOrigin: "anonymous" },
      { rel: "stylesheet", href: "https://fonts.googleapis.com/css2?family=Anton&family=Roboto+Flex:wght@100;300;400;500;600;700&display=swap" },
    ],
  }),
  component: Home,
});

function Home() {
  return (
    <main className="relative min-h-screen overflow-x-hidden">
      <ParticleBackground />
      <div className="relative" style={{ zIndex: 1 }}>
      <PageTransition />
      <Cursor />
      <Menu />
      <Hero />
      <About />
      <Stack />
      <Experience />
      <Projects />
      <Achievements />
      <Contact />
      <Footer />
      </div>
    </main>
  );
}
