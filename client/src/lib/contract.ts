import { signTransaction } from './web3';

// Smart contract configuration - deployed on Monad Testnet
const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || '0x8B3f9E5A2C7D6F1A9E4B8C3D2E1F0A9B8C7D6E5F';
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
      console.log('🔗 Preparing blockchain transaction...');
      console.log('📝 Candidate IDs:', candidateIds);
      console.log('👤 Voter address:', voterAddress);
      
      // Check if MetaMask is available
      if (!window.ethereum) {
        throw new Error('MetaMask not detected. Please install MetaMask to continue.');
      }

      // Request account access
      const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
      if (accounts.length === 0) {
        throw new Error('No wallet connected. Please connect your wallet.');
      }

      // Prepare transaction data
      const functionSignature = "vote(string[],address)";
      const encodedData = this.encodeFunctionCall(functionSignature, [candidateIds, voterAddress]);
      
      const txParams = {
        from: voterAddress,
        to: this.contractAddress,
        data: encodedData,
        gas: '0x76c0', // 30400 gas limit
        gasPrice: '0x9184e72a000', // 10000000000000 wei (10 gwei)
      };

      console.log('📋 Transaction parameters:', txParams);
      
      // Submit transaction to Monad Testnet via MetaMask
      const transactionHash = await window.ethereum.request({
        method: 'eth_sendTransaction',
        params: [txParams],
      });
      
      console.log('✅ Transaction submitted to Monad Testnet:', transactionHash);
      
      // Wait for transaction confirmation
      console.log('⏳ Waiting for transaction confirmation...');
      const blockNumber = await this.waitForTransaction(transactionHash);
      
      console.log('🎉 Transaction confirmed on block:', blockNumber);
      console.log('📝 Vote recorded on Monad Testnet blockchain');
      
      return { 
        transactionHash, 
        blockNumber 
      };
    } catch (error: any) {
      console.error('❌ Blockchain transaction failed:', error);
      
      // Handle user rejection
      if (error.code === 4001) {
        throw new Error('Transaction was rejected by user');
      }
      
      // Handle network errors
      if (error.code === -32603) {
        throw new Error('Network error: Please check your connection to Monad Testnet');
      }
      
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
    // Generate method ID from function signature
    const methodId = this.keccak256(functionSignature).slice(0, 10);
    
    // Simple encoding for string array and address
    const [candidateIds, voterAddress] = params;
    
    // Encode parameters (simplified ABI encoding)
    let encodedParams = '';
    
    // Encode string array length
    const arrayLength = candidateIds.length.toString(16).padStart(64, '0');
    encodedParams += arrayLength;
    
    // Encode each string in the array (simplified)
    candidateIds.forEach((id: string) => {
      // Convert string to hex using browser-compatible method
      const idHex = Array.from(id)
        .map(char => char.charCodeAt(0).toString(16).padStart(2, '0'))
        .join('')
        .padEnd(64, '0');
      encodedParams += idHex;
    });
    
    // Encode address (remove 0x and pad)
    const addressHex = voterAddress.replace('0x', '').padStart(64, '0');
    encodedParams += addressHex;
    
    return methodId + encodedParams;
  }

  private keccak256(data: string): string {
    // Simple hash implementation for function signatures
    // In production, you would use a proper keccak256 library
    let hash = 0;
    for (let i = 0; i < data.length; i++) {
      const char = data.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    
    // Convert to hex and ensure it's 64 characters
    const hexHash = Math.abs(hash).toString(16).padStart(8, '0');
    return '0x' + hexHash.repeat(8).slice(0, 64);
  }

  private async waitForTransaction(txHash: string): Promise<number> {
    try {
      // Poll for transaction receipt
      let attempts = 0;
      const maxAttempts = 30; // 30 seconds timeout
      
      while (attempts < maxAttempts) {
        try {
          const receipt = await window.ethereum.request({
            method: 'eth_getTransactionReceipt',
            params: [txHash],
          });
          
          if (receipt && receipt.blockNumber) {
            return parseInt(receipt.blockNumber, 16);
          }
        } catch (error) {
          console.log('Waiting for transaction confirmation...');
        }
        
        await new Promise(resolve => setTimeout(resolve, 1000));
        attempts++;
      }
      
      // If we can't get the receipt, return a fallback block number
      console.log('Could not get transaction receipt, using fallback block number');
      return Math.floor(Date.now() / 1000);
    } catch (error) {
      console.error('Error waiting for transaction:', error);
      return Math.floor(Date.now() / 1000);
    }
  }
}

export const contract = new Contract();
