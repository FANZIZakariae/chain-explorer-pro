// Blockchain Core Logic

export interface Transaction {
  id: string;
  sender: string;
  receiver: string;
  amount: number;
  timestamp: number;
}

export interface Block {
  index: number;
  timestamp: number;
  transactions: Transaction[];
  previousHash: string;
  hash: string;
  nonce: number;
  isValid: boolean;
}

// SHA-256 hash function using Web Crypto API
async function sha256(message: string): Promise<string> {
  const msgBuffer = new TextEncoder().encode(message);
  const hashBuffer = await crypto.subtle.digest('SHA-256', msgBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Synchronous hash for display (simplified)
export function simpleHash(data: string): string {
  let hash = 0;
  for (let i = 0; i < data.length; i++) {
    const char = data.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  const hex = Math.abs(hash).toString(16).padStart(8, '0');
  return hex.repeat(8).slice(0, 64);
}

// Calculate block hash
export async function calculateHash(block: Omit<Block, 'hash' | 'isValid'>): Promise<string> {
  const data = `${block.index}${block.timestamp}${JSON.stringify(block.transactions)}${block.previousHash}${block.nonce}`;
  return await sha256(data);
}

// Synchronous version for live preview
export function calculateHashSync(block: Omit<Block, 'hash' | 'isValid'>): string {
  const data = `${block.index}${block.timestamp}${JSON.stringify(block.transactions)}${block.previousHash}${block.nonce}`;
  return simpleHash(data);
}

// Check if hash meets difficulty requirement
export function hashMeetsDifficulty(hash: string, difficulty: number): boolean {
  const prefix = '0'.repeat(difficulty);
  return hash.startsWith(prefix);
}

// Create genesis block
export async function createGenesisBlock(): Promise<Block> {
  const block: Omit<Block, 'hash' | 'isValid'> = {
    index: 0,
    timestamp: Date.now(),
    transactions: [],
    previousHash: '0'.repeat(64),
    nonce: 0,
  };
  
  const hash = await calculateHash(block);
  
  return {
    ...block,
    hash,
    isValid: true,
  };
}

// Create a new transaction
export function createTransaction(sender: string, receiver: string, amount: number): Transaction {
  return {
    id: crypto.randomUUID(),
    sender,
    receiver,
    amount,
    timestamp: Date.now(),
  };
}

// Mine a block (find valid nonce)
export async function mineBlock(
  block: Omit<Block, 'hash' | 'isValid' | 'nonce'>,
  difficulty: number,
  onProgress?: (nonce: number, hash: string) => void,
  signal?: AbortSignal
): Promise<{ nonce: number; hash: string }> {
  let nonce = 0;
  let hash = '';
  const targetPrefix = '0'.repeat(difficulty);
  
  while (true) {
    if (signal?.aborted) {
      throw new Error('Mining aborted');
    }
    
    const blockWithNonce = { ...block, nonce };
    hash = await calculateHash(blockWithNonce);
    
    if (onProgress && nonce % 100 === 0) {
      onProgress(nonce, hash);
      // Allow UI to update
      await new Promise(resolve => setTimeout(resolve, 0));
    }
    
    if (hash.startsWith(targetPrefix)) {
      return { nonce, hash };
    }
    
    nonce++;
  }
}

// Validate entire blockchain
export async function validateChain(blocks: Block[]): Promise<boolean[]> {
  const validations: boolean[] = [];
  
  for (let i = 0; i < blocks.length; i++) {
    if (i === 0) {
      // Genesis block is always valid if hash is correct
      const calculatedHash = await calculateHash({
        index: blocks[i].index,
        timestamp: blocks[i].timestamp,
        transactions: blocks[i].transactions,
        previousHash: blocks[i].previousHash,
        nonce: blocks[i].nonce,
      });
      validations.push(calculatedHash === blocks[i].hash);
    } else {
      // Check if previous hash matches and current hash is correct
      const previousBlock = blocks[i - 1];
      const currentBlock = blocks[i];
      
      const calculatedHash = await calculateHash({
        index: currentBlock.index,
        timestamp: currentBlock.timestamp,
        transactions: currentBlock.transactions,
        previousHash: currentBlock.previousHash,
        nonce: currentBlock.nonce,
      });
      
      const isValid = 
        currentBlock.previousHash === previousBlock.hash &&
        calculatedHash === currentBlock.hash;
      
      validations.push(isValid);
    }
  }
  
  return validations;
}

// Recalculate validity after tampering
export async function recalculateValidity(blocks: Block[]): Promise<Block[]> {
  const updatedBlocks = [...blocks];
  
  for (let i = 0; i < updatedBlocks.length; i++) {
    const block = updatedBlocks[i];
    const calculatedHash = await calculateHash({
      index: block.index,
      timestamp: block.timestamp,
      transactions: block.transactions,
      previousHash: block.previousHash,
      nonce: block.nonce,
    });
    
    let isValid = calculatedHash === block.hash;
    
    // Also check previous hash link
    if (i > 0) {
      const previousBlock = updatedBlocks[i - 1];
      isValid = isValid && block.previousHash === previousBlock.hash;
    }
    
    updatedBlocks[i] = { ...block, isValid };
  }
  
  return updatedBlocks;
}

// Format hash for display
export function formatHash(hash: string, length: number = 8): string {
  if (hash.length <= length * 2) return hash;
  return `${hash.slice(0, length)}...${hash.slice(-length)}`;
}

// Format timestamp
export function formatTimestamp(timestamp: number): string {
  return new Date(timestamp).toLocaleString();
}
