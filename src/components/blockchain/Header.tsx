import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { RefreshCw, Github, BookOpen, Blocks } from 'lucide-react';
import { cn } from '@/lib/utils';

interface HeaderProps {
  onReset: () => void;
  className?: string;
}

export function Header({ onReset, className }: HeaderProps) {
  return (
    <header className={cn("glass-card px-6 py-4", className)}>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-primary flex items-center justify-center">
            <Blocks className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-gradient">
              Blockchain Simulator
            </h1>
            <p className="text-xs text-muted-foreground">
              Interactive educational blockchain engine
            </p>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <BookOpen className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Documentation</p>
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button variant="ghost" size="icon" className="h-9 w-9">
                <Github className="w-4 h-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>View Source</p>
            </TooltipContent>
          </Tooltip>
          
          <Tooltip>
            <TooltipTrigger asChild>
              <Button 
                variant="outline" 
                size="sm"
                onClick={onReset}
                className="ml-2"
              >
                <RefreshCw className="w-4 h-4 mr-2" />
                Reset Chain
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Clear all blocks and start fresh</p>
            </TooltipContent>
          </Tooltip>
        </div>
      </div>
    </header>
  );
}
