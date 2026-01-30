import { useState } from 'react';
import { Block, formatHash, formatTimestamp } from '@/lib/blockchain';
import { ChevronDown, ChevronUp, Edit2, RefreshCw, Hash, Clock, Link2, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { cn } from '@/lib/utils';

interface BlockCardProps {
  block: Block;
  isGenesis?: boolean;
  onTamper?: (index: number) => void;
  onRemine?: (index: number) => void;
  isMining?: boolean;
  className?: string;
}

export function BlockCard({ 
  block, 
  isGenesis = false, 
  onTamper, 
  onRemine,
  isMining = false,
  className 
}: BlockCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const cardClass = block.isValid 
    ? 'block-card-valid' 
    : 'block-card-invalid';
  
  return (
    <div 
      className={cn(
        cardClass,
        'w-72 p-4 transition-all duration-300',
        isMining && 'mining-active',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <div className={cn(
            'w-8 h-8 rounded-lg flex items-center justify-center font-bold text-sm',
            block.isValid 
              ? 'bg-success/20 text-success' 
              : 'bg-destructive/20 text-destructive'
          )}>
            #{block.index}
          </div>
          {isGenesis && (
            <span className="text-xs px-2 py-0.5 rounded-full bg-accent/20 text-accent">
              Genesis
            </span>
          )}
        </div>
        <div className={cn(
          'w-2 h-2 rounded-full',
          block.isValid ? 'bg-success' : 'bg-destructive'
        )} />
      </div>
      
      {/* Hash */}
      <div className="mb-3">
        <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
          <Hash className="w-3 h-3" />
          <span>Hash</span>
        </div>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="hash-text cursor-help truncate">
              {formatHash(block.hash, 10)}
            </div>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="max-w-xs">
            <p className="font-mono text-xs break-all">{block.hash}</p>
          </TooltipContent>
        </Tooltip>
      </div>
      
      {/* Previous Hash */}
      <div className="mb-3">
        <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
          <Link2 className="w-3 h-3" />
          <span>Previous Hash</span>
          <Tooltip>
            <TooltipTrigger>
              <span className="text-primary cursor-help">ⓘ</span>
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs text-xs">
                Links this block to the previous one. If the previous block changes, 
                this hash becomes invalid, breaking the chain.
              </p>
            </TooltipContent>
          </Tooltip>
        </div>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className="font-mono text-xs text-muted-foreground truncate cursor-help">
              {formatHash(block.previousHash, 10)}
            </div>
          </TooltipTrigger>
          <TooltipContent side="bottom" className="max-w-xs">
            <p className="font-mono text-xs break-all">{block.previousHash}</p>
          </TooltipContent>
        </Tooltip>
      </div>
      
      {/* Nonce */}
      <div className="mb-3">
        <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
          <Zap className="w-3 h-3" />
          <span>Nonce</span>
          <Tooltip>
            <TooltipTrigger>
              <span className="text-primary cursor-help">ⓘ</span>
            </TooltipTrigger>
            <TooltipContent>
              <p className="max-w-xs text-xs">
                A number miners change to find a valid hash. Mining means trying 
                different nonces until the hash meets the difficulty requirement.
              </p>
            </TooltipContent>
          </Tooltip>
        </div>
        <div className="nonce-text">{block.nonce.toLocaleString()}</div>
      </div>
      
      {/* Timestamp */}
      <div className="mb-3">
        <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1">
          <Clock className="w-3 h-3" />
          <span>Timestamp</span>
        </div>
        <div className="text-xs">{formatTimestamp(block.timestamp)}</div>
      </div>
      
      {/* Transactions Summary */}
      <div 
        className="flex items-center justify-between cursor-pointer py-2 border-t border-border/50"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <span className="text-xs text-muted-foreground">
          {block.transactions.length} transaction{block.transactions.length !== 1 ? 's' : ''}
        </span>
        {isExpanded ? (
          <ChevronUp className="w-4 h-4 text-muted-foreground" />
        ) : (
          <ChevronDown className="w-4 h-4 text-muted-foreground" />
        )}
      </div>
      
      {/* Expanded Transactions */}
      {isExpanded && (
        <div className="mt-2 space-y-2 animate-fade-in">
          {block.transactions.length === 0 ? (
            <p className="text-xs text-muted-foreground italic">No transactions</p>
          ) : (
            block.transactions.map((tx) => (
              <div 
                key={tx.id}
                className="p-2 rounded-lg bg-secondary/50 text-xs"
              >
                <div className="flex items-center justify-between">
                  <span className="text-muted-foreground truncate max-w-[80px]">
                    {tx.sender}
                  </span>
                  <span className="text-primary">→</span>
                  <span className="text-muted-foreground truncate max-w-[80px]">
                    {tx.receiver}
                  </span>
                </div>
                <div className="text-right font-medium text-primary mt-1">
                  {tx.amount} BTC
                </div>
              </div>
            ))
          )}
        </div>
      )}
      
      {/* Actions */}
      {!isGenesis && (
        <div className="flex gap-2 mt-3 pt-3 border-t border-border/50">
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="flex-1 h-8 text-xs"
                onClick={() => onTamper?.(block.index)}
                disabled={isMining}
              >
                <Edit2 className="w-3 h-3 mr-1" />
                Tamper
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p className="text-xs">Modify block data to see chain invalidation</p>
            </TooltipContent>
          </Tooltip>
          
          {!block.isValid && (
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="sm"
                  className="flex-1 h-8 text-xs text-success hover:text-success"
                  onClick={() => onRemine?.(block.index)}
                  disabled={isMining}
                >
                  <RefreshCw className={cn("w-3 h-3 mr-1", isMining && "animate-spin")} />
                  Re-mine
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className="text-xs">Re-mine to fix this block</p>
              </TooltipContent>
            </Tooltip>
          )}
        </div>
      )}
    </div>
  );
}
