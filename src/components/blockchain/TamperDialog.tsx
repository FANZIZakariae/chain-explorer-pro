import { useState, useEffect } from 'react';
import { Block } from '@/lib/blockchain';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { AlertTriangle } from 'lucide-react';

interface TamperDialogProps {
  block: Block | null;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (index: number, changes: Partial<Block>) => void;
}

export function TamperDialog({ block, isOpen, onClose, onConfirm }: TamperDialogProps) {
  const [tamperedData, setTamperedData] = useState('');
  
  useEffect(() => {
    if (block && block.transactions.length > 0) {
      setTamperedData(JSON.stringify(block.transactions[0], null, 2));
    } else {
      setTamperedData('');
    }
  }, [block]);
  
  const handleConfirm = () => {
    if (!block) return;
    
    try {
      // Parse and modify the first transaction
      const modifiedTx = JSON.parse(tamperedData);
      const newTransactions = [...block.transactions];
      if (newTransactions.length > 0) {
        newTransactions[0] = { ...newTransactions[0], ...modifiedTx };
      }
      onConfirm(block.index, { transactions: newTransactions });
    } catch {
      // If parsing fails, just modify the nonce as a simple tampering demo
      onConfirm(block.index, { nonce: block.nonce + 1 });
    }
    onClose();
  };
  
  const handleQuickTamper = () => {
    if (!block) return;
    // Simply increment the nonce to demonstrate tampering
    onConfirm(block.index, { nonce: block.nonce + 1 });
    onClose();
  };
  
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="glass-card border-destructive/30">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-destructive">
            <AlertTriangle className="w-5 h-5" />
            Tamper with Block #{block?.index}
          </DialogTitle>
          <DialogDescription>
            Modify block data to see how it breaks the chain integrity.
            Any change will invalidate this block and all blocks after it.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          {block?.transactions && block.transactions.length > 0 ? (
            <div className="space-y-2">
              <Label htmlFor="transaction-data">Transaction Data</Label>
              <textarea
                id="transaction-data"
                className="w-full h-32 p-3 rounded-lg bg-secondary/50 border border-border/50 font-mono text-sm resize-none"
                value={tamperedData}
                onChange={(e) => setTamperedData(e.target.value)}
              />
              <p className="text-xs text-muted-foreground">
                Try changing the amount or receiver to simulate fraud.
              </p>
            </div>
          ) : (
            <div className="text-center py-4">
              <p className="text-muted-foreground mb-4">
                This block has no transactions. We'll modify the nonce to demonstrate tampering.
              </p>
              <div className="flex items-center justify-center gap-4">
                <div>
                  <p className="text-xs text-muted-foreground">Current Nonce</p>
                  <p className="font-mono text-lg nonce-text">{block?.nonce}</p>
                </div>
                <span className="text-muted-foreground">→</span>
                <div>
                  <p className="text-xs text-muted-foreground">New Nonce</p>
                  <p className="font-mono text-lg text-destructive">{(block?.nonce ?? 0) + 1}</p>
                </div>
              </div>
            </div>
          )}
        </div>
        
        <DialogFooter>
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          {block?.transactions && block.transactions.length > 0 ? (
            <>
              <Button variant="outline" onClick={handleQuickTamper}>
                Quick Tamper (Nonce)
              </Button>
              <Button variant="destructive" onClick={handleConfirm}>
                Apply Changes
              </Button>
            </>
          ) : (
            <Button variant="destructive" onClick={handleQuickTamper}>
              Tamper Block
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
