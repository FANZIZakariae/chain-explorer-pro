import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Transaction } from '@/lib/blockchain';
import { Send, Plus, ArrowRight } from 'lucide-react';

interface TransactionPanelProps {
  mempool: Transaction[];
  onAddTransaction: (sender: string, receiver: string, amount: number) => void;
}

export function TransactionPanel({ mempool, onAddTransaction }: TransactionPanelProps) {
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

  return (
    <Card className="glass-card">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2 text-lg">
          <Send className="h-5 w-5 text-primary" />
          Create Transaction
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <Label htmlFor="sender" className="text-xs">
                Sender
              </Label>
              <Input
                id="sender"
                placeholder="Alice"
                value={sender}
                onChange={(e) => setSender(e.target.value)}
                className="h-9"
              />
            </div>
            <div>
              <Label htmlFor="receiver" className="text-xs">
                Receiver
              </Label>
              <Input
                id="receiver"
                placeholder="Bob"
                value={receiver}
                onChange={(e) => setReceiver(e.target.value)}
                className="h-9"
              />
            </div>
          </div>
          <div>
            <Label htmlFor="amount" className="text-xs">
              Amount
            </Label>
            <Input
              id="amount"
              type="number"
              placeholder="100"
              min="0.01"
              step="0.01"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              className="h-9"
            />
          </div>
          <Button type="submit" className="w-full" disabled={!sender || !receiver || !amount}>
            <Plus className="h-4 w-4 mr-2" />
            Add to Mempool
          </Button>
        </form>

        {/* Mempool */}
        <div className="pt-3 border-t border-border/50">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-sm font-medium">Pending Transactions (Mempool)</h4>
            <span className="text-xs text-muted-foreground">{mempool.length} tx</span>
          </div>
          <div className="space-y-2 max-h-[200px] overflow-y-auto">
            {mempool.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-4">
                No pending transactions
              </p>
            ) : (
              mempool.map((tx) => (
                <div
                  key={tx.id}
                  className="flex items-center justify-between p-2 rounded-md bg-background/50 text-xs animate-fade-in"
                >
                  <span className="font-mono">{tx.sender}</span>
                  <ArrowRight className="h-3 w-3 text-primary" />
                  <span className="font-mono">{tx.receiver}</span>
                  <span className="text-primary font-semibold">{tx.amount}</span>
                </div>
              ))
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
