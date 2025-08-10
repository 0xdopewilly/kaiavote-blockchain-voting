import { Contract } from './contract';

declare global {
  interface Window {
    ethereum?: any;
  }
}

export async function isWalletAvailable(): Promise<boolean> {
  return typeof window !== 'undefined' && !!window.ethereum;
}

export async function connectWallet(): Promise<string | null> {
  if (!await isWalletAvailable()) {
    throw new Error('MetaMask is not installed. Please install MetaMask to continue.');
  }

  try {
    // First, switch to Monad Testnet to ensure we're on the right network
    await switchToMonadTestnet();
    
    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts',
    });

    if (accounts.length === 0) {
      throw new Error('No accounts found. Please unlock MetaMask.');
    }

    // Verify we're on the correct network
    const currentChainId = await getCurrentNetwork();
    if (currentChainId !== '0x279F') {
      throw new Error('Please switch to Monad Testnet to use MON tokens with ultra-low gas fees');
    }

    return accounts[0];
  } catch (error: any) {
    console.error('Failed to connect wallet:', error);
    throw new Error(`Failed to connect wallet: ${error.message}`);
  }
}

export async function getAccount(): Promise<string | null> {
  if (!await isWalletAvailable()) {
    return null;
  }

  try {
    const accounts = await window.ethereum.request({
      method: 'eth_accounts',
    });
    return accounts.length > 0 ? accounts[0] : null;
  } catch (error) {
    console.error('Failed to get account:', error);
    return null;
  }
}

export async function isWalletConnected(): Promise<boolean> {
  const account = await getAccount();
  return !!account;
}

export function disconnectWallet(): void {
  // MetaMask doesn't have a disconnect method, but we can clear local state
  // The user would need to disconnect manually from MetaMask
  console.log('Wallet disconnected locally. Please disconnect from MetaMask manually if needed.');
}

export async function switchToMonadTestnet(): Promise<void> {
  if (!await isWalletAvailable()) {
    throw new Error('MetaMask is not installed');
  }

  const chainId = '0x279F'; // Monad testnet chain ID in hex (10143 in decimal)

  try {
    await window.ethereum.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId }],
    });
  } catch (switchError: any) {
    // This error code indicates that the chain has not been added to MetaMask
    if (switchError.code === 4902) {
      try {
        await window.ethereum.request({
          method: 'wallet_addEthereumChain',
          params: [
            {
              chainId,
              chainName: 'Monad Testnet',
              nativeCurrency: {
                name: 'Monad',
                symbol: 'MON',
                decimals: 18,
              },
              rpcUrls: ['https://10143.rpc.thirdweb.com'],
              blockExplorerUrls: ['https://monad-testnet.socialscan.io'],
              iconUrls: ['https://monad.xyz/favicon.ico'],
            },
          ],
        });
      } catch (addError) {
        throw new Error('Failed to add Monad Testnet network');
      }
    } else {
      throw new Error('Failed to switch to Monad Testnet network');
    }
  }
}

export async function signTransaction(transactionData: any): Promise<string> {
  if (!await isWalletAvailable()) {
    throw new Error('MetaMask is not installed');
  }

  try {
    const txHash = await window.ethereum.request({
      method: 'eth_sendTransaction',
      params: [transactionData],
    });
    return txHash;
  } catch (error: any) {
    throw new Error(`Transaction failed: ${error.message}`);
  }
}

export async function getCurrentNetwork(): Promise<string> {
  if (!await isWalletAvailable()) {
    throw new Error('MetaMask is not installed');
  }

  try {
    const chainId = await window.ethereum.request({
      method: 'eth_chainId',
    });
    return chainId;
  } catch (error) {
    throw new Error('Failed to get current network');
  }
}
