import { MiningState } from '@/hooks/useBlockchain';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Progress } from '@/components/ui/progress';
import { Pickaxe, Zap, Hash, Info, X, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { formatHash } from '@/lib/blockchain';
import { useEffect, useState } from 'react';

interface MiningPanelProps {
  miningState: MiningState;
  difficulty: number;
  pendingTransactionsCount: number;
  onMine: () => void;
  onCancel: () => void;
  onDifficultyChange: (value: number) => void;
  className?: string;
}

export function MiningPanel({
  miningState,
  difficulty,
  pendingTransactionsCount,
  onMine,
  onCancel,
  onDifficultyChange,
  className,
}: MiningPanelProps) {
  const [showSuccess, setShowSuccess] = useState(false);
  
  useEffect(() => {
    if (miningState.progress === 100 && !miningState.isMining) {
      setShowSuccess(true);
      const timer = setTimeout(() => setShowSuccess(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [miningState.progress, miningState.isMining]);
  
  return (
    <div className={cn("glass-card p-6", className)}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Pickaxe className="w-5 h-5 text-primary" />
          <span>Mining</span>
        </h2>
        <Tooltip>
          <TooltipTrigger>
            <Info className="w-4 h-4 text-muted-foreground" />
          </TooltipTrigger>
          <TooltipContent>
            <p className="max-w-xs text-xs">
              Mining finds a valid nonce that makes the block's hash start with 
              the required number of zeros (difficulty level).
            </p>
          </TooltipContent>
        </Tooltip>
      </div>
      
      {/* Difficulty Slider */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <Label className="text-sm flex items-center gap-2">
            <Zap className="w-4 h-4 text-warning" />
            Difficulty
            <Tooltip>
              <TooltipTrigger>
                <span className="text-primary cursor-help">ⓘ</span>
              </TooltipTrigger>
              <TooltipContent>
                <p className="max-w-xs text-xs">
                  Higher difficulty = more leading zeros required in hash.
                  Each level increases mining time exponentially.
                </p>
              </TooltipContent>
            </Tooltip>
          </Label>
          <span className="text-sm font-mono text-primary">{difficulty}</span>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-xs text-muted-foreground">Easy</span>
          <Slider
            value={[difficulty]}
            min={1}
            max={5}
            step={1}
            onValueChange={([value]) => onDifficultyChange(value)}
            disabled={miningState.isMining}
            className="flex-1"
          />
          <span className="text-xs text-muted-foreground">Hard</span>
        </div>
        <div className="mt-2 text-xs text-muted-foreground">
          Target: Hash must start with <span className="font-mono text-primary">{'0'.repeat(difficulty)}</span>
        </div>
      </div>
      
      {/* Mining Status */}
      {miningState.isMining && (
        <div className="mb-6 p-4 rounded-lg bg-secondary/30 border border-primary/20 animate-fade-in">
          <div className="flex items-center justify-between mb-3">
            <span className="text-sm font-medium">Mining in progress...</span>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
              <span className="text-xs text-muted-foreground">Active</span>
            </div>
          </div>
          
          <div className="space-y-3">
            {/* Nonce counter */}
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">Nonce</span>
              <span className="font-mono text-sm nonce-text animate-hash-tick">
                {miningState.currentNonce.toLocaleString()}
              </span>
            </div>
            
            {/* Current hash */}
            <div>
              <span className="text-xs text-muted-foreground block mb-1">Current Hash</span>
              <div className="hash-text text-xs truncate font-mono animate-hash-tick">
                {miningState.currentHash ? formatHash(miningState.currentHash, 20) : '...'}
              </div>
            </div>
            
            {/* Progress bar */}
            <div>
              <Progress value={miningState.progress} className="h-2" />
              <p className="text-xs text-muted-foreground mt-1 text-right">
                ~{Math.round(miningState.progress)}%
              </p>
            </div>
          </div>
        </div>
      )}
      
      {/* Success indicator */}
      {showSuccess && (
        <div className="mb-6 p-4 rounded-lg bg-success/10 border border-success/30 animate-fade-in success-glow">
          <div className="flex items-center gap-2 text-success">
            <CheckCircle2 className="w-5 h-5" />
            <span className="font-medium">Block mined successfully!</span>
          </div>
        </div>
      )}
      
      {/* Mine Button */}
      <div className="space-y-3">
        {miningState.isMining ? (
          <Button
            variant="destructive"
            className="w-full"
            onClick={onCancel}
          >
            <X className="w-4 h-4 mr-2" />
            Cancel Mining
          </Button>
        ) : (
          <Button
            className="w-full btn-primary-glow text-primary-foreground font-semibold"
            onClick={onMine}
          >
            <Pickaxe className="w-4 h-4 mr-2" />
            Mine New Block
          </Button>
        )}
        
        <p className="text-xs text-center text-muted-foreground">
          {pendingTransactionsCount > 0 
            ? `${Math.min(pendingTransactionsCount, 5)} transaction${Math.min(pendingTransactionsCount, 5) !== 1 ? 's' : ''} will be included`
            : 'Empty block (no transactions)'}
        </p>
      </div>
    </div>
  );
}

function Label({ className, children, ...props }: React.LabelHTMLAttributes<HTMLLabelElement>) {
  return (
    <label className={cn("text-sm font-medium leading-none", className)} {...props}>
      {children}
    </label>
  );
}
