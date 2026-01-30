import { useState } from 'react';
import { Block, Transaction } from '@/lib/blockchain';
import { BlockCard } from './BlockCard';
import { ChainConnector } from './ChainConnector';
import { TamperDialog } from './TamperDialog';

interface BlockchainVisualizationProps {
  chain: Block[];
  onTamper: (blockIndex: number, transactions: Transaction[]) => void;
  onRemine: (blockIndex: number) => void;
  isMining: boolean;
}

export function BlockchainVisualization({
  chain,
  onTamper,
  onRemine,
  isMining,
}: BlockchainVisualizationProps) {
  const [tamperBlock, setTamperBlock] = useState<Block | null>(null);

  const handleTamperSubmit = (transactions: Transaction[]) => {
    if (tamperBlock) {
      onTamper(tamperBlock.index, transactions);
      setTamperBlock(null);
    }
  };

  return (
    <>
      <div className="w-full overflow-x-auto pb-4">
        <div className="flex items-center min-w-max px-4 py-6">
          {chain.map((block, index) => (
            <div key={block.index} className="flex items-center">
              <BlockCard
                block={block}
                onTamper={setTamperBlock}
                onRemine={onRemine}
                isMining={isMining}
              />
              {index < chain.length - 1 && (
                <ChainConnector
                  isValid={chain[index + 1]?.isValid !== false}
                />
              )}
            </div>
          ))}
        </div>
      </div>

      <TamperDialog
        block={tamperBlock}
        onClose={() => setTamperBlock(null)}
        onSubmit={handleTamperSubmit}
      />
    </>
  );
}
