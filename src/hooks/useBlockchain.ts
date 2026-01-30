import { useState, useEffect, useCallback, useRef } from 'react';
import {
  Block,
  Transaction,
  createGenesisBlock,
  mineBlock,
  validateBlockchain,
  createTransaction,
  calculateBlockHash,
} from '@/lib/blockchain';

export type ExplanationEvent = 
  | { type: 'genesis'; message: string }
  | { type: 'transaction_added'; message: string }
  | { type: 'mining_started'; message: string }
  | { type: 'mining_progress'; message: string; nonce: number; hash: string }
  | { type: 'mining_complete'; message: string }
  | { type: 'block_tampered'; message: string }
  | { type: 'chain_validated'; message: string }
  | { type: 'chain_invalid'; message: string };

export function useBlockchain() {
  const [chain, setChain] = useState<Block[]>([]);
  const [mempool, setMempool] = useState<Transaction[]>([]);
  const [difficulty, setDifficulty] = useState(2);
  const [isMining, setIsMining] = useState(false);
  const [miningProgress, setMiningProgress] = useState({ nonce: 0, hash: '' });
  const [lastEvent, setLastEvent] = useState<ExplanationEvent | null>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Initialize blockchain with genesis block
  useEffect(() => {
    const initChain = async () => {
      const genesis = await createGenesisBlock();
      setChain([genesis]);
      setLastEvent({
        type: 'genesis',
        message: 'Genesis block created! This is the first block in the chain with no previous hash.',
      });
    };
    initChain();
  }, []);

  // Add transaction to mempool
  const addTransaction = useCallback((sender: string, receiver: string, amount: number) => {
    const tx = createTransaction(sender, receiver, amount);
    setMempool(prev => [...prev, tx]);
    setLastEvent({
      type: 'transaction_added',
      message: `Transaction added to mempool: ${sender} → ${receiver} (${amount} coins). Waiting to be mined.`,
    });
  }, []);

  // Mine new block
  const mine = useCallback(async () => {
    if (chain.length === 0 || mempool.length === 0 || isMining) return;

    setIsMining(true);
    abortControllerRef.current = new AbortController();

    setLastEvent({
      type: 'mining_started',
      message: `Mining started! Finding a hash with ${difficulty} leading zeros...`,
    });

    const lastBlock = chain[chain.length - 1];
    const newBlockData = {
      index: lastBlock.index + 1,
      timestamp: Date.now(),
      transactions: [...mempool],
      previousHash: lastBlock.hash,
      nonce: 0,
    };

    try {
      const minedBlock = await mineBlock(
        newBlockData,
        difficulty,
        (nonce, hash) => {
          setMiningProgress({ nonce, hash });
          if (nonce % 500 === 0) {
            setLastEvent({
              type: 'mining_progress',
              message: `Trying nonce ${nonce}... Hash doesn't start with ${'0'.repeat(difficulty)} yet.`,
              nonce,
              hash,
            });
          }
        },
        abortControllerRef.current.signal
      );

      setChain(prev => [...prev, minedBlock]);
      setMempool([]);
      setLastEvent({
        type: 'mining_complete',
        message: `Block #${minedBlock.index} mined! Found valid hash after ${minedBlock.nonce} attempts.`,
      });
    } catch (error) {
      if ((error as Error).message !== 'Mining aborted') {
        console.error('Mining error:', error);
      }
    } finally {
      setIsMining(false);
      setMiningProgress({ nonce: 0, hash: '' });
    }
  }, [chain, mempool, difficulty, isMining]);

  // Stop mining
  const stopMining = useCallback(() => {
    abortControllerRef.current?.abort();
    setIsMining(false);
  }, []);

  // Tamper with a block
  const tamperBlock = useCallback(async (blockIndex: number, newTransactions: Transaction[]) => {
    setChain(prev => {
      const newChain = [...prev];
      newChain[blockIndex] = {
        ...newChain[blockIndex],
        transactions: newTransactions,
      };
      return newChain;
    });

    setLastEvent({
      type: 'block_tampered',
      message: `Block #${blockIndex} was modified! The hash no longer matches the data. Chain integrity compromised!`,
    });

    // Validate chain after tampering
    setTimeout(async () => {
      setChain(prev => {
        validateBlockchain(prev).then(validated => {
          setChain(validated);
          const invalidBlocks = validated.filter(b => !b.isValid);
          if (invalidBlocks.length > 0) {
            setLastEvent({
              type: 'chain_invalid',
              message: `Chain validation failed! ${invalidBlocks.length} block(s) are now invalid due to hash mismatch.`,
            });
          }
        });
        return prev;
      });
    }, 100);
  }, []);

  // Re-mine a tampered block
  const remineBlock = useCallback(async (blockIndex: number) => {
    if (isMining) return;

    setIsMining(true);
    abortControllerRef.current = new AbortController();

    const block = chain[blockIndex];
    const previousHash = blockIndex === 0 ? '0'.repeat(64) : chain[blockIndex - 1].hash;

    try {
      const reminedBlock = await mineBlock(
        {
          index: block.index,
          timestamp: block.timestamp,
          transactions: block.transactions,
          previousHash,
          nonce: 0,
        },
        difficulty,
        (nonce, hash) => setMiningProgress({ nonce, hash }),
        abortControllerRef.current.signal
      );

      // Update this block and revalidate chain
      setChain(prev => {
        const newChain = [...prev];
        newChain[blockIndex] = reminedBlock;
        
        // Need to update subsequent blocks too
        validateBlockchain(newChain).then(validated => {
          setChain(validated);
        });
        
        return newChain;
      });

      setLastEvent({
        type: 'mining_complete',
        message: `Block #${blockIndex} re-mined successfully! Note: Subsequent blocks may still need re-mining.`,
      });
    } catch (error) {
      if ((error as Error).message !== 'Mining aborted') {
        console.error('Re-mining error:', error);
      }
    } finally {
      setIsMining(false);
      setMiningProgress({ nonce: 0, hash: '' });
    }
  }, [chain, difficulty, isMining]);

  // Revalidate chain
  const revalidateChain = useCallback(async () => {
    const validated = await validateBlockchain(chain);
    setChain(validated);
    
    const allValid = validated.every(b => b.isValid);
    setLastEvent({
      type: allValid ? 'chain_validated' : 'chain_invalid',
      message: allValid 
        ? 'Chain validated! All blocks have correct hashes and links.'
        : 'Chain validation failed! Some blocks have invalid hashes or links.',
    });
  }, [chain]);

  return {
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
    revalidateChain,
  };
}
