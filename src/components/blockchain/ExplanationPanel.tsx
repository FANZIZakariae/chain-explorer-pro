import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ExplanationEvent } from '@/hooks/useBlockchain';
import { Info, CheckCircle, AlertTriangle, Pickaxe, Send, Blocks } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ExplanationPanelProps {
  event: ExplanationEvent | null;
}

const eventIcons = {
  genesis: Blocks,
  transaction_added: Send,
  mining_started: Pickaxe,
  mining_progress: Pickaxe,
  mining_complete: CheckCircle,
  block_tampered: AlertTriangle,
  chain_validated: CheckCircle,
  chain_invalid: AlertTriangle,
};

const eventColors = {
  genesis: 'text-primary',
  transaction_added: 'text-hash',
  mining_started: 'text-mining',
  mining_progress: 'text-mining',
  mining_complete: 'text-valid',
  block_tampered: 'text-invalid',
  chain_validated: 'text-valid',
  chain_invalid: 'text-invalid',
};

export function ExplanationPanel({ event }: ExplanationPanelProps) {
  if (!event) {
    return (
      <Card className="glass-card">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <Info className="h-5 w-5 text-primary" />
            What's Happening
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Create transactions and mine blocks to see explanations here.
          </p>
        </CardContent>
      </Card>
    );
  }

  const Icon = eventIcons[event.type];
  const colorClass = eventColors[event.type];

  return (
    <Card className="glass-card">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Info className="h-5 w-5 text-primary" />
          What's Happening
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className={cn('flex items-start gap-3 p-3 rounded-lg bg-background/50 animate-fade-in')}>
          <Icon className={cn('h-5 w-5 mt-0.5 shrink-0', colorClass)} />
          <div className="space-y-1">
            <p className="text-sm">{event.message}</p>
            {event.type === 'mining_progress' && (
              <div className="text-xs text-muted-foreground space-y-1">
                <p>Current nonce: {event.nonce}</p>
                <p className="hash-text truncate">Hash: {event.hash}</p>
              </div>
            )}
          </div>
        </div>

        {/* Educational tooltips based on event type */}
        <div className="mt-4 pt-4 border-t border-border/50">
          <h4 className="text-xs font-semibold text-muted-foreground mb-2">
            💡 Did you know?
          </h4>
          <p className="text-xs text-muted-foreground">
            {getEducationalTip(event.type)}
          </p>
        </div>
      </CardContent>
    </Card>
  );
}

function getEducationalTip(eventType: ExplanationEvent['type']): string {
  const tips: Record<ExplanationEvent['type'], string> = {
    genesis: 'The genesis block is special because it has no previous block to reference. Its previous hash is set to all zeros.',
    transaction_added: 'Transactions wait in the mempool until a miner includes them in a block. In real blockchains, miners prioritize transactions with higher fees.',
    mining_started: 'Mining is the process of finding a valid hash by trying different nonce values. This is called Proof-of-Work.',
    mining_progress: 'Each nonce attempt produces a completely different hash due to the avalanche effect of SHA-256. Even a tiny change in input creates a drastically different output.',
    mining_complete: 'Once a valid hash is found, the block is added to the chain. In Bitcoin, this happens roughly every 10 minutes.',
    block_tampered: 'Changing any data in a block changes its hash, which breaks the link to the next block. This is why blockchains are considered tamper-proof.',
    chain_validated: 'Blockchain validation checks that each block\'s hash matches its data and that the chain of previous hashes is unbroken.',
    chain_invalid: 'An invalid chain means someone tried to modify historical data. In real blockchains, nodes would reject this invalid chain.',
  };
  return tips[eventType];
}
