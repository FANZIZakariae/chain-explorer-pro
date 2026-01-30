import { Blocks, Sparkles } from 'lucide-react';

export function Header() {
  return (
    <header className="glass border-b border-border/50">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <Blocks className="h-8 w-8 text-primary" />
            <Sparkles className="h-4 w-4 text-mining absolute -top-1 -right-1" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">
              Blockchain Simulator
            </h1>
            <p className="text-xs text-muted-foreground">
              Interactive Educational Tool
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}
