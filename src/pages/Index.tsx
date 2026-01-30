import { useState, useCallback } from 'react';
import { useBlockchain } from '@/hooks/useBlockchain';
import { Header } from '@/components/blockchain/Header';
import { BlockchainVisualization } from '@/components/blockchain/BlockchainVisualization';
import { TransactionPanel } from '@/components/blockchain/TransactionPanel';
import { MiningPanel } from '@/components/blockchain/MiningPanel';
import { ExplanationPanel } from '@/components/blockchain/ExplanationPanel';
import { TamperDialog } from '@/components/blockchain/TamperDialog';
import { Block } from '@/lib/blockchain';

type LastAction = 'mined' | 'tampered' | 'remined' | 'transaction' | null;

const Index = () => {
  const {
    blocks,
    pendingTransactions,
    difficulty,
    miningState,
    setDifficulty,
    addTransaction,
    removeTransaction,
    mineNewBlock,
    cancelMining,
    tamperBlock,
    remineBlock,
    resetBlockchain,
  } = useBlockchain();
  
  const [tamperTarget, setTamperTarget] = useState<Block | null>(null);
  const [lastAction, setLastAction] = useState<LastAction>(null);
  
  const handleAddTransaction = useCallback((sender: string, receiver: string, amount: number) => {
    addTransaction(sender, receiver, amount);
    setLastAction('transaction');
  }, [addTransaction]);
  
  const handleMine = useCallback(async () => {
    try {
      await mineNewBlock();
      setLastAction('mined');
    } catch (error) {
      // Mining was cancelled
    }
  }, [mineNewBlock]);
  
  const handleTamper = useCallback((index: number) => {
    const block = blocks.find(b => b.index === index);
    if (block) {
      setTamperTarget(block);
    }
  }, [blocks]);
  
  const handleTamperConfirm = useCallback((index: number, changes: Partial<Block>) => {
    tamperBlock(index, changes);
    setLastAction('tampered');
  }, [tamperBlock]);
  
  const handleRemine = useCallback(async (index: number) => {
    await remineBlock(index);
    setLastAction('remined');
  }, [remineBlock]);
  
  const handleReset = useCallback(() => {
    resetBlockchain();
    setLastAction(null);
  }, [resetBlockchain]);
  
  return (
    <div className="min-h-screen bg-background p-4 md:p-6 lg:p-8">
      <div className="max-w-[1600px] mx-auto space-y-6">
        {/* Header */}
        <Header onReset={handleReset} />
        
        {/* Main Content */}
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-6">
          {/* Blockchain Visualization - Full Width */}
          <div className="xl:col-span-4">
            <BlockchainVisualization
              blocks={blocks}
              onTamper={handleTamper}
              onRemine={handleRemine}
              isMining={miningState.isMining}
            />
          </div>
          
          {/* Left Panel - Transactions */}
          <div className="xl:col-span-2">
            <TransactionPanel
              pendingTransactions={pendingTransactions}
              onAddTransaction={handleAddTransaction}
              onRemoveTransaction={removeTransaction}
            />
          </div>
          
          {/* Middle Panel - Mining */}
          <div className="xl:col-span-1">
            <MiningPanel
              miningState={miningState}
              difficulty={difficulty}
              pendingTransactionsCount={pendingTransactions.length}
              onMine={handleMine}
              onCancel={cancelMining}
              onDifficultyChange={setDifficulty}
            />
          </div>
          
          {/* Right Panel - Explanation */}
          <div className="xl:col-span-1">
            <ExplanationPanel
              blocks={blocks}
              miningState={miningState}
              lastAction={lastAction}
            />
          </div>
        </div>
        
        {/* Footer */}
        <footer className="text-center text-xs text-muted-foreground py-4">
          <p>
            Built for educational purposes • Not a real cryptocurrency •{' '}
            <span className="text-primary">SHA-256</span> hashing with{' '}
            <span className="text-accent">Proof-of-Work</span>
          </p>
        </footer>
      </div>
      
      {/* Tamper Dialog */}
      <TamperDialog
        block={tamperTarget}
        isOpen={!!tamperTarget}
        onClose={() => setTamperTarget(null)}
        onConfirm={handleTamperConfirm}
      />
    </div>
  );
};

export default Index;
