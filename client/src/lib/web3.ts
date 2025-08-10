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
    const accounts = await window.ethereum.request({
      method: 'eth_requestAccounts',
    });

    if (accounts.length === 0) {
      throw new Error('No accounts found. Please unlock MetaMask.');
    }

    // Switch to Base Sepolia network
    await switchToBaseSepolia();

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

export async function switchToBaseSepolia(): Promise<void> {
  if (!await isWalletAvailable()) {
    throw new Error('MetaMask is not installed');
  }

  const chainId = '0x14A34'; // Base Sepolia chain ID in hex (84532 in decimal)

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
              chainName: 'Base Sepolia',
              nativeCurrency: {
                name: 'ETH',
                symbol: 'ETH',
                decimals: 18,
              },
              rpcUrls: ['https://sepolia.base.org'],
              blockExplorerUrls: ['https://sepolia-explorer.base.org'],
            },
          ],
        });
      } catch (addError) {
        throw new Error('Failed to add Base Sepolia network');
      }
    } else {
      throw new Error('Failed to switch to Base Sepolia network');
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
