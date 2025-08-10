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
    // Clear any cached accounts to force MetaMask to show account selection
    await window.ethereum.request({
      method: 'wallet_requestPermissions',
      params: [{ eth_accounts: {} }],
    });

    // Then request accounts - this will show the account selection popup
    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts',
    });

    if (accounts.length === 0) {
      throw new Error('No accounts found. Please unlock MetaMask.');
    }

    // Try to switch to Monad Testnet (don't fail if this doesn't work)
    try {
      await switchToMonadTestnet();
    } catch (networkError) {
      console.warn('Could not switch to Monad Testnet automatically:', networkError);
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
                name: 'MON',
                symbol: 'MON',
                decimals: 18,
              },
              rpcUrls: ['https://10143.rpc.thirdweb.com'],
              blockExplorerUrls: ['https://monad-testnet.socialscan.io'],
            },
          ],
        });
      } catch (addError) {
        console.error('Failed to add Monad Testnet:', addError);
        throw new Error('Could not add Monad Testnet to MetaMask. Please add it manually.');
      }
    } else if (switchError.code === 4001) {
      // User rejected the request
      throw new Error('Please approve the network switch to use Monad Testnet');
    } else {
      console.error('Network switch error:', switchError);
      throw new Error('Could not switch to Monad Testnet. Please switch manually in MetaMask.');
    }
  }
}

export async function signTransaction(transactionData: any): Promise<string> {
  if (!await isWalletAvailable()) {
    throw new Error('MetaMask is not installed');
  }

  try {
    // Ensure we're on the correct network before sending transaction
    const currentChainId = await getCurrentNetwork();
    if (currentChainId !== '0x279F') {
      console.log('Wrong network detected, switching to Monad Testnet...');
      await switchToMonadTestnet();
    }

    const txHash = await window.ethereum.request({
      method: 'eth_sendTransaction',
      params: [transactionData],
    });
    return txHash;
  } catch (error: any) {
    console.error('Transaction signing error:', error);
    throw new Error(`Transaction failed: ${error.message || 'Unknown error'}`);
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
