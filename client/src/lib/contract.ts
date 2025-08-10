import { signTransaction } from './web3';

// Smart contract configuration
const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || '0x1234567890123456789012345678901234567890';
const CONTRACT_ABI = [
  {
    "inputs": [
      {"name": "candidateIds", "type": "string[]"},
      {"name": "voterAddress", "type": "address"}
    ],
    "name": "vote",
    "outputs": [],
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "inputs": [{"name": "voterAddress", "type": "address"}],
    "name": "hasVoted",
    "outputs": [{"name": "", "type": "bool"}],
    "stateMutability": "view",
    "type": "function"
  },
  {
    "inputs": [{"name": "candidateId", "type": "string"}],
    "name": "getVoteCount",
    "outputs": [{"name": "", "type": "uint256"}],
    "stateMutability": "view",
    "type": "function"
  }
];

export class Contract {
  private contractAddress: string;
  private abi: any[];

  constructor() {
    this.contractAddress = CONTRACT_ADDRESS;
    this.abi = CONTRACT_ABI;
  }

  async submitVote(candidateIds: string[], voterAddress: string): Promise<{transactionHash: string, blockNumber?: number}> {
    try {
      // Encode function call
      const functionSignature = 'vote(string[],address)';
      const encodedData = this.encodeFunctionCall(functionSignature, [candidateIds, voterAddress]);

      const transactionData = {
        to: this.contractAddress,
        from: voterAddress,
        data: encodedData,
        gas: '0x76C0', // 30400 gas limit
        gasPrice: '0x9184E72A000', // 10000000000000 wei
      };

      const transactionHash = await signTransaction(transactionData);
      
      // Wait for transaction to be mined and get block number
      const blockNumber = await this.waitForTransaction(transactionHash);
      
      return { transactionHash, blockNumber };
    } catch (error: any) {
      throw new Error(`Failed to submit vote to blockchain: ${error.message}`);
    }
  }

  async hasVoterVoted(voterAddress: string): Promise<boolean> {
    try {
      // In a real implementation, this would query the blockchain
      // For now, we'll return false to allow testing
      return false;
    } catch (error) {
      console.error('Failed to check if voter has voted:', error);
      return false;
    }
  }

  async getVoteCount(candidateId: string): Promise<number> {
    try {
      // In a real implementation, this would query the blockchain
      // For now, we'll return 0 as votes are tracked in the database
      return 0;
    } catch (error) {
      console.error('Failed to get vote count from blockchain:', error);
      return 0;
    }
  }

  private encodeFunctionCall(functionSignature: string, params: any[]): string {
    // This is a simplified encoding for demonstration
    // In a real implementation, you would use a proper ABI encoder like ethers.js
    const methodId = this.keccak256(functionSignature).slice(0, 10);
    
    // For this demo, we'll return a mock encoded call
    return methodId + '0'.repeat(128); // Padded hex data
  }

  private keccak256(data: string): string {
    // Mock implementation - in real use, you'd use a proper keccak256 function
    return '0x' + Array.from(data).map((_, i) => (i % 16).toString(16)).join('').padEnd(64, '0');
  }

  private async waitForTransaction(txHash: string): Promise<number> {
    // Mock implementation - wait 2 seconds and return a mock block number
    await new Promise(resolve => setTimeout(resolve, 2000));
    return Math.floor(Math.random() * 1000000) + 1000000;
  }
}

export const contract = new Contract();
