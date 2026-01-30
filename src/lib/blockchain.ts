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
  nonce: number;
  hash: string;
  isValid?: boolean;
}

// Generate SHA-256 hash
export async function calculateHash(data: string): Promise<string> {
  const encoder = new TextEncoder();
  const dataBuffer = encoder.encode(data);
  const hashBuffer = await crypto.subtle.digest('SHA-256', dataBuffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// Calculate block hash
export async function calculateBlockHash(block: Omit<Block, 'hash' | 'isValid'>): Promise<string> {
  const blockData = JSON.stringify({
    index: block.index,
    timestamp: block.timestamp,
    transactions: block.transactions,
    previousHash: block.previousHash,
    nonce: block.nonce,
  });
  return calculateHash(blockData);
}

// Create genesis block
export async function createGenesisBlock(): Promise<Block> {
  const genesisBlock: Omit<Block, 'hash' | 'isValid'> = {
    index: 0,
    timestamp: Date.now(),
    transactions: [],
    previousHash: '0'.repeat(64),
    nonce: 0,
  };
  
  const hash = await calculateBlockHash(genesisBlock);
  
  return {
    ...genesisBlock,
    hash,
    isValid: true,
  };
}

// Check if hash meets difficulty requirement
export function hashMeetsDifficulty(hash: string, difficulty: number): boolean {
  const prefix = '0'.repeat(difficulty);
  return hash.startsWith(prefix);
}

// Mine a block (find valid nonce)
export async function mineBlock(
  block: Omit<Block, 'hash' | 'isValid'>,
  difficulty: number,
  onProgress?: (nonce: number, hash: string) => void,
  abortSignal?: AbortSignal
): Promise<Block> {
  let nonce = 0;
  let hash = '';
  
  while (true) {
    if (abortSignal?.aborted) {
      throw new Error('Mining aborted');
    }
    
    hash = await calculateBlockHash({ ...block, nonce });
    
    if (onProgress) {
      onProgress(nonce, hash);
    }
    
    if (hashMeetsDifficulty(hash, difficulty)) {
      break;
    }
    
    nonce++;
    
    // Allow UI updates every 100 iterations
    if (nonce % 100 === 0) {
      await new Promise(resolve => setTimeout(resolve, 0));
    }
  }
  
  return {
    ...block,
    nonce,
    hash,
    isValid: true,
  };
}

// Validate entire blockchain
export async function validateBlockchain(chain: Block[]): Promise<Block[]> {
  const validatedChain: Block[] = [];
  
  for (let i = 0; i < chain.length; i++) {
    const block = chain[i];
    const calculatedHash = await calculateBlockHash({
      index: block.index,
      timestamp: block.timestamp,
      transactions: block.transactions,
      previousHash: block.previousHash,
      nonce: block.nonce,
    });
    
    const hashValid = calculatedHash === block.hash;
    const previousHashValid = i === 0 || block.previousHash === chain[i - 1].hash;
    const previousBlockValid = i === 0 || validatedChain[i - 1].isValid;
    
    validatedChain.push({
      ...block,
      isValid: hashValid && previousHashValid && previousBlockValid,
    });
  }
  
  return validatedChain;
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

// Shorten hash for display
export function shortenHash(hash: string, length: number = 8): string {
  if (hash.length <= length * 2) return hash;
  return `${hash.slice(0, length)}...${hash.slice(-length)}`;
}

// Format timestamp
export function formatTimestamp(timestamp: number): string {
  return new Date(timestamp).toLocaleString();
}
