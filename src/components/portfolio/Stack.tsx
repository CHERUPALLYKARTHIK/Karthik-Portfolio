import { Reveal } from "./Reveal";
import { SectionTitle } from "./SectionTitle";

const cats = [
  {
    label: "Languages & Web",
    items: ["🐍 Python", "☕ Java", "🗄️ SQL", "⚛️ React", "🌐 JavaScript", "📘 TypeScript", "🎨 HTML/CSS", "⚡ Vite"],
  },
  {
    label: "AI & ML",
    items: ["🧠 Scikit-Learn", "🔥 TensorFlow", "📊 Pandas", "🔢 NumPy", "📈 Matplotlib", "🌊 Seaborn", "👁️ OpenCV", "🌲 Random Forest"],
  },
  { label: "Database", items: ["🍃 MongoDB", "🐬 MySQL", "🔥 Firebase"] },
  { label: "Tools & Concepts", items: ["🐙 Git / GitHub", "💻 VS Code", "📊 Tableau", "📉 Power BI", "🔧 ESP32/S3", "🧠 DSA / OOP"] },
];

export function Stack() {
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