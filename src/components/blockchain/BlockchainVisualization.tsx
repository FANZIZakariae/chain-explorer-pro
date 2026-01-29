import { Block } from '@/lib/blockchain';
import { BlockCard } from './BlockCard';
import { ChainConnector } from './ChainConnector';
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface BlockchainVisualizationProps {
  blocks: Block[];
  onTamper: (index: number) => void;
  onRemine: (index: number) => void;
  isMining: boolean;
  className?: string;
}

export function BlockchainVisualization({
  blocks,
  onTamper,
  onRemine,
  isMining,
  className,
}: BlockchainVisualizationProps) {
  return (
    <div className={cn("glass-card p-6", className)}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <span className="text-gradient">Blockchain</span>
          <span className="text-xs text-muted-foreground font-normal">
            ({blocks.length} block{blocks.length !== 1 ? 's' : ''})
          </span>
        </h2>
        <div className="flex items-center gap-4 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-success" />
            <span className="text-muted-foreground">Valid</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-destructive" />
            <span className="text-muted-foreground">Invalid</span>
          </div>
        </div>
      </div>
      
      <ScrollArea className="w-full">
        <div className="flex items-center pb-4 gap-0 min-w-max">
          {blocks.map((block, index) => (
            <div key={block.index} className="flex items-center animate-scale-in" style={{ animationDelay: `${index * 100}ms` }}>
              <BlockCard
                block={block}
                isGenesis={index === 0}
                onTamper={onTamper}
                onRemine={onRemine}
                isMining={isMining}
              />
              {index < blocks.length - 1 && (
                <ChainConnector isValid={blocks[index + 1].isValid} />
              )}
            </div>
          ))}
        </div>
        <ScrollBar orientation="horizontal" />
      </ScrollArea>
    </div>
  );
}
