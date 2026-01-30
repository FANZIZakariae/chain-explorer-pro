import { useState } from 'react';
import { Block, shortenHash, formatTimestamp, Transaction } from '@/lib/blockchain';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import {
  ChevronDown,
  ChevronUp,
  Hash,
  Clock,
  Link2,
  RefreshCw,
  Edit3,
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface BlockCardProps {
  block: Block;
  onTamper: (block: Block) => void;
  onRemine: (blockIndex: number) => void;
  isMining: boolean;
}

export function BlockCard({ block, onTamper, onRemine, isMining }: BlockCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const isGenesis = block.index === 0;
  const isValid = block.isValid !== false;

  return (
    <Card
      className={cn(
        'glass-card min-w-[280px] max-w-[320px] transition-all duration-300',
        isValid ? 'glow-valid border-valid/30' : 'glow-invalid border-invalid/30 animate-chain-break'
      )}
    >
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div
              className={cn(
                'w-3 h-3 rounded-full',
                isValid ? 'bg-valid' : 'bg-invalid'
              )}
            />
            <span className="font-bold text-lg">
              Block #{block.index}
            </span>
            {isGenesis && (
              <span className="text-xs bg-primary/20 text-primary px-2 py-0.5 rounded-full">
                Genesis
              </span>
            )}
          </div>
          <div className="flex gap-1">
            {!isGenesis && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => onTamper(block)}
                    >
                      <Edit3 className="h-4 w-4 text-muted-foreground" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Tamper with block data</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
            {!isValid && (
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7"
                      onClick={() => onRemine(block.index)}
                      disabled={isMining}
                    >
                      <RefreshCw className={cn("h-4 w-4 text-mining", isMining && "animate-spin")} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Re-mine this block</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-3">
        {/* Hash */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-2 p-2 rounded-md bg-background/50">
                <Hash className="h-4 w-4 text-hash" />
                <span className="hash-text text-xs text-hash truncate">
                  {shortenHash(block.hash, 10)}
                </span>
              </div>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="max-w-[400px]">
              <p className="hash-text text-xs break-all">{block.hash}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Previous Hash */}
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <div className="flex items-center gap-2 p-2 rounded-md bg-background/50">
                <Link2 className="h-4 w-4 text-muted-foreground" />
                <span className="hash-text text-xs text-muted-foreground truncate">
                  Prev: {shortenHash(block.previousHash, 6)}
                </span>
              </div>
            </TooltipTrigger>
            <TooltipContent side="bottom" className="max-w-[400px]">
              <p className="hash-text text-xs break-all">{block.previousHash}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        {/* Metadata */}
        <div className="flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>{formatTimestamp(block.timestamp)}</span>
          </div>
          <span className="text-nonce">Nonce: {block.nonce}</span>
        </div>

        {/* Transactions summary */}
        <div className="flex items-center justify-between">
          <span className="text-sm">
            {block.transactions.length} transaction(s)
          </span>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="h-7"
          >
            {isExpanded ? (
              <ChevronUp className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </div>

        {/* Expanded transactions */}
        {isExpanded && block.transactions.length > 0 && (
          <div className="space-y-2 pt-2 border-t border-border/50">
            {block.transactions.map((tx: Transaction) => (
              <div
                key={tx.id}
                className="p-2 rounded bg-background/30 text-xs space-y-1"
              >
                <div className="flex justify-between">
                  <span className="text-muted-foreground">From:</span>
                  <span className="font-mono">{tx.sender}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">To:</span>
                  <span className="font-mono">{tx.receiver}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Amount:</span>
                  <span className="text-primary font-semibold">{tx.amount} coins</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
