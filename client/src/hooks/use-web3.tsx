import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { connectWallet, disconnectWallet, getAccount, isWalletConnected } from '@/lib/web3';

interface Web3ContextType {
  account: string | null;
  isConnected: boolean;
  isLoading: boolean;
  connect: () => Promise<string | null>;
  disconnect: () => void;
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined);

interface Web3ProviderProps {
  children: ReactNode;
}

export function Web3Provider({ children }: Web3ProviderProps) {
  const [account, setAccount] = useState<string | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const checkConnection = async () => {
      // Check if user has explicitly disconnected (stored in localStorage)
      const hasDisconnected = localStorage.getItem('wallet_disconnected') === 'true';
      
      if (!hasDisconnected && await isWalletConnected()) {
        const currentAccount = await getAccount();
        setAccount(currentAccount);
        setIsConnected(!!currentAccount);
      }
    };

    checkConnection();

    // Listen for account changes
    if (typeof window !== 'undefined' && window.ethereum) {
      window.ethereum.on('accountsChanged', (accounts: string[]) => {
        const hasDisconnected = localStorage.getItem('wallet_disconnected') === 'true';
        
        if (accounts.length === 0 || hasDisconnected) {
          setAccount(null);
          setIsConnected(false);
        } else {
          setAccount(accounts[0]);
          setIsConnected(true);
        }
      });

      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      });
    }

    return () => {
      if (typeof window !== 'undefined' && window.ethereum) {
        window.ethereum.removeAllListeners('accountsChanged');
        window.ethereum.removeAllListeners('chainChanged');
      }
    };
  }, []);

  const connect = async (): Promise<string | null> => {
    setIsLoading(true);
    try {
      // Clear the disconnected flag when connecting
      localStorage.removeItem('wallet_disconnected');
      const connectedAccount = await connectWallet();
      setAccount(connectedAccount);
      setIsConnected(!!connectedAccount);
      return connectedAccount;
    } catch (error) {
      console.error('Failed to connect wallet:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  const disconnect = () => {
    // Set flag to prevent auto-reconnection on refresh
    localStorage.setItem('wallet_disconnected', 'true');
    disconnectWallet();
    setAccount(null);
    setIsConnected(false);
  };

  return (
    <Web3Context.Provider
      value={{
        account,
        isConnected,
        isLoading,
        connect,
        disconnect,
      }}
    >
      {children}
    </Web3Context.Provider>
  );
}

export function useWeb3() {
  const context = useContext(Web3Context);
  if (context === undefined) {
    throw new Error('useWeb3 must be used within a Web3Provider');
  }
  return context;
}
