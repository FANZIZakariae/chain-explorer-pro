import { Header } from '@/components/blockchain/Header';
import { BlockchainVisualization } from '@/components/blockchain/BlockchainVisualization';
import { TransactionPanel } from '@/components/blockchain/TransactionPanel';
import { MiningPanel } from '@/components/blockchain/MiningPanel';
import { ExplanationPanel } from '@/components/blockchain/ExplanationPanel';
import { TooltipProvider } from '@/components/ui/tooltip';
import { useBlockchain } from '@/hooks/useBlockchain';

const Index = () => {
  const {
    chain,
    mempool,
    difficulty,
    setDifficulty,
    isMining,
    miningProgress,
    lastEvent,
    addTransaction,
    mine,
    stopMining,
    tamperBlock,
    remineBlock,
  } = useBlockchain();

  return (
    <TooltipProvider>
      <div className="min-h-screen bg-background">
        <Header />
        
        <main className="container mx-auto px-4 py-6 space-y-6">
          {/* Blockchain Visualization */}
          <section>
            <h2 className="text-lg font-semibold mb-4">Blockchain</h2>
            <div className="glass rounded-xl p-4">
              <BlockchainVisualization
                chain={chain}
                onTamper={tamperBlock}
                onRemine={remineBlock}
                isMining={isMining}
              />
            </div>
          </section>

          {/* Control Panels */}
          <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <TransactionPanel
              mempool={mempool}
              onAddTransaction={addTransaction}
            />
            <MiningPanel
              difficulty={difficulty}
              onDifficultyChange={setDifficulty}
              isMining={isMining}
              miningProgress={miningProgress}
              mempoolSize={mempool.length}
              onMine={mine}
              onStopMining={stopMining}
            />
            <ExplanationPanel event={lastEvent} />
          </section>
        </main>
      </div>
    </TooltipProvider>
  );
};

export default Index;
