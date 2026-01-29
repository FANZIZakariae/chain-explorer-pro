import { cn } from '@/lib/utils';
import { ArrowRight } from 'lucide-react';

interface ChainConnectorProps {
  isValid: boolean;
  className?: string;
}

export function ChainConnector({ isValid, className }: ChainConnectorProps) {
  return (
    <div className={cn("flex items-center justify-center w-12 relative", className)}>
      {/* Connection line */}
      <div 
        className={cn(
          "absolute inset-y-[45%] left-0 right-0 h-1 rounded-full transition-colors duration-300",
          isValid 
            ? "bg-gradient-to-r from-success/50 to-success/30" 
            : "bg-gradient-to-r from-destructive/50 to-destructive/30"
        )}
      />
      
      {/* Arrow icon */}
      <div 
        className={cn(
          "relative z-10 w-6 h-6 rounded-full flex items-center justify-center transition-colors duration-300",
          isValid 
            ? "bg-success/20 text-success" 
            : "bg-destructive/20 text-destructive"
        )}
      >
        <ArrowRight className="w-3 h-3" />
      </div>
    </div>
  );
}
