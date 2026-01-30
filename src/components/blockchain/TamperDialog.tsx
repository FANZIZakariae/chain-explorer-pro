import { useState } from 'react';
import { Block, Transaction } from '@/lib/blockchain';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertTriangle } from 'lucide-react';

interface TamperDialogProps {
  block: Block | null;
  onClose: () => void;
  onSubmit: (transactions: Transaction[]) => void;
}

export function TamperDialog({ block, onClose, onSubmit }: TamperDialogProps) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  const handleOpen = (open: boolean) => {
    if (!open) {
      onClose();
    } else if (block) {
      setTransactions([...block.transactions]);
    }
  };

  const updateTransaction = (index: number, field: keyof Transaction, value: string | number) => {
    setTransactions(prev => {
      const updated = [...prev];
      updated[index] = { ...updated[index], [field]: value };
      return updated;
    });
  };

  const handleSubmit = () => {
    onSubmit(transactions);
  };

  return (
    <Dialog open={block !== null} onOpenChange={handleOpen}>
      <DialogContent className="glass-card border-invalid/30">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-invalid">
            <AlertTriangle className="h-5 w-5" />
            Tamper with Block #{block?.index}
          </DialogTitle>
          <DialogDescription>
            Modify the transaction data. This will invalidate the block's hash
            and break the chain integrity.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 max-h-[300px] overflow-y-auto">
          {transactions.length === 0 ? (
            <p className="text-sm text-muted-foreground text-center py-4">
              No transactions to modify
            </p>
          ) : (
            transactions.map((tx, index) => (
              <div key={tx.id} className="space-y-2 p-3 rounded-lg bg-background/50">
                <div className="text-xs text-muted-foreground">
                  Transaction {index + 1}
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <Label htmlFor={`sender-${index}`} className="text-xs">
                      Sender
                    </Label>
                    <Input
                      id={`sender-${index}`}
                      value={tx.sender}
                      onChange={(e) => updateTransaction(index, 'sender', e.target.value)}
                      className="h-8 text-sm"
                    />
                  </div>
                  <div>
                    <Label htmlFor={`receiver-${index}`} className="text-xs">
                      Receiver
                    </Label>
                    <Input
                      id={`receiver-${index}`}
                      value={tx.receiver}
                      onChange={(e) => updateTransaction(index, 'receiver', e.target.value)}
                      className="h-8 text-sm"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor={`amount-${index}`} className="text-xs">
                    Amount
                  </Label>
                  <Input
                    id={`amount-${index}`}
                    type="number"
                    value={tx.amount}
                    onChange={(e) => updateTransaction(index, 'amount', parseFloat(e.target.value) || 0)}
                    className="h-8 text-sm"
                  />
                </div>
              </div>
            ))
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="destructive" onClick={handleSubmit}>
            Tamper Block
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
