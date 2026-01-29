import { Block } from '@/lib/blockchain';
import { MiningState } from '@/hooks/useBlockchain';
import { BookOpen, Lightbulb, AlertTriangle, CheckCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ExplanationPanelProps {
  blocks: Block[];
  miningState: MiningState;
  lastAction?: 'mined' | 'tampered' | 'remined' | 'transaction' | null;
  className?: string;
}

export function ExplanationPanel({
  blocks,
  miningState,
  lastAction,
  className,
}: ExplanationPanelProps) {
  const hasInvalidBlocks = blocks.some(b => !b.isValid);
  const invalidCount = blocks.filter(b => !b.isValid).length;
  
  const getExplanation = () => {
    if (miningState.isMining) {
      return {
        icon: Lightbulb,
        title: 'Mining in Progress',
        content: `The miner is trying different nonce values to find a hash that starts with ${miningState.currentNonce > 0 ? '"0".repeat(difficulty)' : 'the required zeros'}. 
        Each attempt changes the nonce, which completely changes the hash output due to the avalanche effect of SHA-256.
        Current attempt: nonce #${miningState.currentNonce.toLocaleString()}`,
        type: 'info' as const,
      };
    }
    
    if (hasInvalidBlocks) {
      return {
        icon: AlertTriangle,
        title: 'Chain Integrity Broken!',
        content: `${invalidCount} block${invalidCount > 1 ? 's are' : ' is'} now invalid. 
        When a block is modified, its hash changes. Since each block contains the previous block's hash, 
        all subsequent blocks become invalid—they're pointing to a hash that no longer exists!
        Click "Re-mine" on invalid blocks to fix the chain (you'll need to re-mine all following blocks too).`,
        type: 'warning' as const,
      };
    }
    
    if (lastAction === 'mined') {
      return {
        icon: CheckCircle,
        title: 'Block Successfully Mined!',
        content: `A valid hash was found! The new block is now cryptographically linked to the previous block 
        through its "previous hash" field. This chain of hashes is what makes blockchain immutable—
        changing any block would break all the links after it.`,
        type: 'success' as const,
      };
    }
    
    if (lastAction === 'transaction') {
      return {
        icon: Lightbulb,
        title: 'Transaction Added',
        content: `Your transaction is now in the mempool (pending transactions). 
        When a new block is mined, pending transactions will be included in that block 
        and become a permanent part of the blockchain.`,
        type: 'info' as const,
      };
    }
    
    return {
      icon: BookOpen,
      title: 'How Blockchain Works',
      content: `This simulator demonstrates the core concepts of blockchain technology:
      
      • Blocks contain transactions and are linked via cryptographic hashes
      • Each block references the previous block's hash, creating a chain
      • Mining uses Proof-of-Work to find a valid nonce
      • Tampering with any block invalidates all subsequent blocks
      
      Try adding transactions and mining a block!`,
      type: 'default' as const,
    };
  };
  
  const explanation = getExplanation();
  const Icon = explanation.icon;
  
  const typeStyles = {
    default: 'border-border/50 bg-secondary/20',
    info: 'border-primary/30 bg-primary/5',
    warning: 'border-destructive/30 bg-destructive/5',
    success: 'border-success/30 bg-success/5',
  };
  
  const iconStyles = {
    default: 'text-muted-foreground',
    info: 'text-primary',
    warning: 'text-destructive',
    success: 'text-success',
  };
  
  return (
    <div className={cn("glass-card p-6", className)}>
      <div className="flex items-start gap-4">
        <div className={cn(
          "w-10 h-10 rounded-lg flex items-center justify-center flex-shrink-0",
          typeStyles[explanation.type]
        )}>
          <Icon className={cn("w-5 h-5", iconStyles[explanation.type])} />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className={cn(
            "font-semibold mb-2",
            explanation.type === 'warning' && 'text-destructive',
            explanation.type === 'success' && 'text-success',
            explanation.type === 'info' && 'text-primary'
          )}>
            {explanation.title}
          </h3>
          <p className="text-sm text-muted-foreground whitespace-pre-line leading-relaxed">
            {explanation.content}
          </p>
        </div>
      </div>
    </div>
  );
}
