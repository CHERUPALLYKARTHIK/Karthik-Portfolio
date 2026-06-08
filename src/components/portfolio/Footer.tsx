export function Footer() {
  return (
    <footer className="container-x py-8 border-t border-border">
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-sm text-muted-foreground">
        <div></div>
        <a href="#home" className="hover:text-primary transition-colors">
          Back to top ↑
        </a>
      </div>
    </footer>
  );
}