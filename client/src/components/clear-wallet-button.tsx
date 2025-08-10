import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";
import { useWeb3 } from "@/hooks/use-web3";

export default function ClearWalletButton() {
  const { disconnect, isConnected } = useWeb3();

  const handleClearWallet = () => {
    // Clear all wallet-related localStorage data
    localStorage.removeItem('wallet_disconnected');
    localStorage.setItem('wallet_disconnected', 'true');
    
    // Disconnect the wallet
    disconnect();
    
    // Force a page reload to ensure complete state reset
    window.location.reload();
  };

  if (!isConnected) {
    return null;
  }

  return (
    <Button 
      onClick={handleClearWallet}
      variant="outline"
      size="sm"
      className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700 hover:border-red-300"
      data-testid="button-clear-wallet"
    >
      <Trash2 className="mr-2 h-4 w-4" />
      Clear Wallet & Reset
    </Button>
  );
}