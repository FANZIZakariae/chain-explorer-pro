import { useState } from 'react';
import { Transaction } from '@/lib/blockchain';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tooltip, TooltipContent, TooltipTrigger } from '@/components/ui/tooltip';
import { Plus, Trash2, ArrowRight, Wallet, Info } from 'lucide-react';
import { cn } from '@/lib/utils';

interface TransactionPanelProps {
  pendingTransactions: Transaction[];
  onAddTransaction: (sender: string, receiver: string, amount: number) => void;
  onRemoveTransaction: (id: string) => void;
  className?: string;
}

export function TransactionPanel({
  pendingTransactions,
  onAddTransaction,
  onRemoveTransaction,
  className,
}: TransactionPanelProps) {
  const [sender, setSender] = useState('');
  const [receiver, setReceiver] = useState('');
  const [amount, setAmount] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (sender && receiver && amount) {
      onAddTransaction(sender, receiver, parseFloat(amount));
      setSender('');
      setReceiver('');
      setAmount('');
    }
  };
  
  const quickFill = () => {
    const names = ['Alice', 'Bob', 'Charlie', 'Diana', 'Eve', 'Frank'];
    const randomSender = names[Math.floor(Math.random() * names.length)];
    let randomReceiver = names[Math.floor(Math.random() * names.length)];
    while (randomReceiver === randomSender) {
      randomReceiver = names[Math.floor(Math.random() * names.length)];
    }
    const randomAmount = (Math.random() * 10).toFixed(2);
    
    setSender(randomSender);
    setReceiver(randomReceiver);
    setAmount(randomAmount);
  };
  
  return (
    <div className={cn("glass-card p-6", className)}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Wallet className="w-5 h-5 text-primary" />
          <span>Transactions</span>
        </h2>
        <Tooltip>
          <TooltipTrigger>
            <Info className="w-4 h-4 text-muted-foreground" />
          </TooltipTrigger>
          <TooltipContent>
            <p className="max-w-xs text-xs">
              Create transactions and add them to the mempool (pending transactions).
              They will be included in the next mined block.
            </p>
          </TooltipContent>
        </Tooltip>
      </div>
      
      {/* Create Transaction Form */}
      <form onSubmit={handleSubmit} className="space-y-4 mb-6">
        <div className="grid grid-cols-3 gap-3">
          <div className="space-y-1.5">
            <Label htmlFor="sender" className="text-xs text-muted-foreground">
              Sender
            </Label>
            <Input
              id="sender"
              placeholder="Alice"
              value={sender}
              onChange={(e) => setSender(e.target.value)}
              className="h-9 bg-secondary/50 border-border/50"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="receiver" className="text-xs text-muted-foreground">
              Receiver
            </Label>
            <Input
              id="receiver"
              placeholder="Bob"
              value={receiver}
              onChange={(e) => setReceiver(e.target.value)}
              className="h-9 bg-secondary/50 border-border/50"
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="amount" className="text-xs text-muted-foreground">
              Amount (BTC)
            </Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0.01"
              placeholder="1.00"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="h-9 bg-secondary/50 border-border/50"
            />
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={quickFill}
            className="text-xs"
          >
            Quick Fill
          </Button>
          <Button
            type="submit"
            className="flex-1 btn-primary-glow text-primary-foreground"
            disabled={!sender || !receiver || !amount}
          >
            <Plus className="w-4 h-4 mr-2" />
            Add Transaction
          </Button>
        </div>
      </form>
      
      {/* Pending Transactions (Mempool) */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-muted-foreground">
            Mempool
          </h3>
          <span className="text-xs text-muted-foreground">
            {pendingTransactions.length} pending
          </span>
        </div>
        
        <div className="space-y-2 max-h-48 overflow-y-auto custom-scrollbar">
          {pendingTransactions.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4 italic">
              No pending transactions
            </p>
          ) : (
            pendingTransactions.map((tx, index) => (
              <div
                key={tx.id}
                className="flex items-center justify-between p-3 rounded-lg bg-secondary/30 border border-border/30 animate-slide-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <div className="flex items-center gap-2 flex-1">
                  <span className="text-sm font-medium truncate max-w-[80px]">
                    {tx.sender}
                  </span>
                  <ArrowRight className="w-4 h-4 text-primary flex-shrink-0" />
                  <span className="text-sm font-medium truncate max-w-[80px]">
                    {tx.receiver}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-mono text-primary">
                    {tx.amount} BTC
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 text-muted-foreground hover:text-destructive"
                    onClick={() => onRemoveTransaction(tx.id)}
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
