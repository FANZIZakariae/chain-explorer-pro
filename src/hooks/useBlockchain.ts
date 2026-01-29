import { useState, useCallback, useEffect, useRef } from 'react';
import {
  Block,
  Transaction,
  createGenesisBlock,
  createTransaction,
  mineBlock,
  calculateHash,
  recalculateValidity,
} from '@/lib/blockchain';

export interface MiningState {
  isMining: boolean;
  currentNonce: number;
  currentHash: string;
  progress: number;
}

export function useBlockchain() {
  const [blocks, setBlocks] = useState<Block[]>([]);
  const [pendingTransactions, setPendingTransactions] = useState<Transaction[]>([]);
  const [difficulty, setDifficulty] = useState(2);
  const [miningState, setMiningState] = useState<MiningState>({
    isMining: false,
    currentNonce: 0,
    currentHash: '',
    progress: 0,
  });
  
  const abortControllerRef = useRef<AbortController | null>(null);
  
  // Initialize blockchain with genesis block
  useEffect(() => {
    const initBlockchain = async () => {
      const genesis = await createGenesisBlock();
      setBlocks([genesis]);
    };
    initBlockchain();
  }, []);
  
  // Add transaction to mempool
  const addTransaction = useCallback((sender: string, receiver: string, amount: number) => {
    const tx = createTransaction(sender, receiver, amount);
    setPendingTransactions(prev => [...prev, tx]);
    return tx;
  }, []);
  
  // Remove transaction from mempool
  const removeTransaction = useCallback((id: string) => {
    setPendingTransactions(prev => prev.filter(tx => tx.id !== id));
  }, []);
  
  // Mine a new block
  const mineNewBlock = useCallback(async () => {
    if (blocks.length === 0 || miningState.isMining) return;
    
    const lastBlock = blocks[blocks.length - 1];
    const transactionsToMine = pendingTransactions.slice(0, 5); // Max 5 transactions per block
    
    const newBlock: Omit<Block, 'hash' | 'isValid' | 'nonce'> = {
      index: lastBlock.index + 1,
      timestamp: Date.now(),
      transactions: transactionsToMine,
      previousHash: lastBlock.hash,
    };
    
    abortControllerRef.current = new AbortController();
    
    setMiningState({
      isMining: true,
      currentNonce: 0,
      currentHash: '',
      progress: 0,
    });
    
    try {
      const { nonce, hash } = await mineBlock(
        newBlock,
        difficulty,
        (nonce, hash) => {
          setMiningState(prev => ({
            ...prev,
            currentNonce: nonce,
            currentHash: hash,
            progress: Math.min((nonce / (Math.pow(16, difficulty) * 0.5)) * 100, 95),
          }));
        },
        abortControllerRef.current.signal
      );
      
      const minedBlock: Block = {
        ...newBlock,
        nonce,
        hash,
        isValid: true,
      };
      
      setBlocks(prev => [...prev, minedBlock]);
      setPendingTransactions(prev => prev.filter(tx => !transactionsToMine.find(t => t.id === tx.id)));
      
      setMiningState({
        isMining: false,
        currentNonce: nonce,
        currentHash: hash,
        progress: 100,
      });
      
      return minedBlock;
    } catch (error) {
      setMiningState({
        isMining: false,
        currentNonce: 0,
        currentHash: '',
        progress: 0,
      });
      throw error;
    }
  }, [blocks, pendingTransactions, difficulty, miningState.isMining]);
  
  // Cancel mining
  const cancelMining = useCallback(() => {
    if (abortControllerRef.current) {
      abortControllerRef.current.abort();
      abortControllerRef.current = null;
    }
    setMiningState({
      isMining: false,
      currentNonce: 0,
      currentHash: '',
      progress: 0,
    });
  }, []);
  
  // Tamper with a block (for demonstration)
  const tamperBlock = useCallback(async (index: number, newData: Partial<Block>) => {
    setBlocks(prev => {
      const updated = prev.map((block, i) => {
        if (i === index) {
          return { ...block, ...newData };
        }
        return block;
      });
      return updated;
    });
    
    // Recalculate validity after state update
    setTimeout(async () => {
      setBlocks(prev => {
        recalculateValidity(prev).then(validated => {
          setBlocks(validated);
        });
        return prev;
      });
    }, 100);
  }, []);
  
  // Re-mine a specific block
  const remineBlock = useCallback(async (index: number) => {
    if (index === 0 || miningState.isMining) return;
    
    const block = blocks[index];
    const previousBlock = blocks[index - 1];
    
    const blockToMine: Omit<Block, 'hash' | 'isValid' | 'nonce'> = {
      index: block.index,
      timestamp: block.timestamp,
      transactions: block.transactions,
      previousHash: previousBlock.hash,
    };
    
    abortControllerRef.current = new AbortController();
    
    setMiningState({
      isMining: true,
      currentNonce: 0,
      currentHash: '',
      progress: 0,
    });
    
    try {
      const { nonce, hash } = await mineBlock(
        blockToMine,
        difficulty,
        (nonce, hash) => {
          setMiningState(prev => ({
            ...prev,
            currentNonce: nonce,
            currentHash: hash,
            progress: Math.min((nonce / (Math.pow(16, difficulty) * 0.5)) * 100, 95),
          }));
        },
        abortControllerRef.current.signal
      );
      
      // Update this block and recalculate all following blocks
      const newBlocks = [...blocks];
      newBlocks[index] = {
        ...blockToMine,
        nonce,
        hash,
        isValid: true,
        previousHash: previousBlock.hash,
      };
      
      // Invalidate all following blocks (they need to be re-mined too)
      for (let i = index + 1; i < newBlocks.length; i++) {
        newBlocks[i] = {
          ...newBlocks[i],
          previousHash: newBlocks[i - 1].hash,
          isValid: false,
        };
      }
      
      const validated = await recalculateValidity(newBlocks);
      setBlocks(validated);
      
      setMiningState({
        isMining: false,
        currentNonce: nonce,
        currentHash: hash,
        progress: 100,
      });
    } catch (error) {
      setMiningState({
        isMining: false,
        currentNonce: 0,
        currentHash: '',
        progress: 0,
      });
    }
  }, [blocks, difficulty, miningState.isMining]);
  
  // Validate chain
  const validateChain = useCallback(async () => {
    const validated = await recalculateValidity(blocks);
    setBlocks(validated);
    return validated.every(b => b.isValid);
  }, [blocks]);
  
  // Reset blockchain
  const resetBlockchain = useCallback(async () => {
    cancelMining();
    const genesis = await createGenesisBlock();
    setBlocks([genesis]);
    setPendingTransactions([]);
  }, [cancelMining]);
  
  return {
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
    validateChain,
    resetBlockchain,
  };
}
