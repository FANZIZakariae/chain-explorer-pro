import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';
import { Pickaxe, StopCircle, Hash } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MiningPanelProps {
  difficulty: number;
  onDifficultyChange: (value: number) => void;
  isMining: boolean;
  miningProgress: { nonce: number; hash: string };
  mempoolSize: number;
  onMine: () => void;
  onStopMining: () => void;
}

export function MiningPanel({
  difficulty,
  onDifficultyChange,
  isMining,
  miningProgress,
  mempoolSize,
  onMine,
  onStopMining,
}: MiningPanelProps) {
  return (
    <Card className={cn('glass-card transition-all duration-300', isMining && 'animate-pulse-glow')}>
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Pickaxe className={cn('h-5 w-5', isMining ? 'text-mining animate-bounce' : 'text-primary')} />
          Mining
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Difficulty Slider */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label className="text-xs">Difficulty</Label>
            <span className="text-xs text-muted-foreground">
              {'0'.repeat(difficulty)}xxx...
            </span>
          </div>
          <Slider
            value={[difficulty]}
            onValueChange={([value]) => onDifficultyChange(value)}
            min={1}
            max={5}
            step={1}
            disabled={isMining}
          />
          <div className="flex justify-between text-xs text-muted-foreground">
            <span>Easy</span>
            <span>Level {difficulty}</span>
            <span>Hard</span>
          </div>
        </div>

        {/* Mining Status */}
        {isMining && (
          <div className="space-y-2 p-3 rounded-lg bg-mining/10 border border-mining/30">
            <div className="flex items-center justify-between">
              <span className="text-xs text-mining">Mining in progress...</span>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 rounded-full bg-mining animate-ping" />
              </div>
            </div>
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Nonce:</span>
                <span className="font-mono text-sm text-nonce">{miningProgress.nonce}</span>
              </div>
              <div className="flex items-center gap-2">
                <Hash className="h-3 w-3 text-hash" />
                <span className="hash-text text-xs text-hash truncate">
                  {miningProgress.hash || 'Calculating...'}
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Mine Button */}
        {isMining ? (
          <Button variant="destructive" className="w-full" onClick={onStopMining}>
            <StopCircle className="h-4 w-4 mr-2" />
            Stop Mining
          </Button>
        ) : (
          <Button
            variant="mining"
            className="w-full"
            onClick={onMine}
            disabled={mempoolSize === 0}
          >
            <Pickaxe className="h-4 w-4 mr-2" />
            Mine Block ({mempoolSize} tx pending)
          </Button>
        )}

        {mempoolSize === 0 && !isMining && (
          <p className="text-xs text-muted-foreground text-center">
            Add transactions to the mempool first
          </p>
        )}
      </CardContent>
    </Card>
  );
}
