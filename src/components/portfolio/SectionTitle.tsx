export function Flower({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 40 40" className={`spin-slow inline-block ${className}`} fill="currentColor" aria-hidden>
      {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
        <ellipse key={deg} cx="20" cy="9" rx="4" ry="9" transform={`rotate(${deg} 20 20)`} />
      ))}
      <circle cx="20" cy="20" r="3" fill="hsl(0 0% 13%)" />
    </svg>
  );
}

export function SectionTitle({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-4 mb-16">
      <Flower className="w-8 h-8 text-primary" />
      <h2 className="font-display text-3xl sm:text-4xl uppercase tracking-wide">{children}</h2>
    </div>
  );
}
