import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Loader2, Wallet, AlertCircle, LogOut } from "lucide-react";
import { useWeb3 } from "@/hooks/use-web3";

interface WalletConnectorProps {
  onConnect: (address: string) => void;
  title?: string;
  description?: string;
}

export default function WalletConnector({ 
  onConnect, 
  title = "Connect Wallet", 
  description = "Connect your Web3 wallet to continue" 
}: WalletConnectorProps) {
  const { connect, disconnect, isLoading, account } = useWeb3();
  const [error, setError] = useState<string | null>(null);

  const handleConnect = async () => {
    setError(null);
    try {
      const connectedAccount = await connect();
      if (connectedAccount) {
        onConnect(connectedAccount);
      }
    } catch (err: any) {
      setError(err.message || "Failed to connect wallet");
    }
  };

  const handleDisconnect = () => {
    setError(null);
    disconnect();
  };

  return (
    <div className="futuristic-card p-8 max-w-lg mx-auto">
      <div className="text-center">
        <div className="relative inline-block mb-6">
          <Wallet className="h-16 w-16 text-primary mx-auto" />
          <div className="absolute -inset-4 bg-primary/30 rounded-full blur-xl animate-pulse"></div>
        </div>
        <h3 className="text-2xl font-bold text-foreground mb-2">{title}</h3>
        <p className="text-muted-foreground mb-8 text-lg">{description}</p>
        
        {error && (
          <div className="glass-morph rounded-xl p-4 mb-6 border border-destructive/30">
            <div className="flex items-center justify-center space-x-3">
              <AlertCircle className="h-5 w-5 text-destructive" />
              <span className="text-destructive font-medium">{error}</span>
            </div>
          </div>
        )}

        {account ? (
          <div className="space-y-6">
            <div className="glass-morph rounded-xl p-4 border border-primary/30">
              <div className="flex items-center justify-center space-x-3">
                <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-foreground font-mono text-lg">
                  {account.slice(0, 8)}...{account.slice(-6)}
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-2">Wallet Connected</p>
            </div>
            <div className="space-y-4">
              <Button 
                onClick={() => onConnect(account)} 
                className="w-full h-14 text-lg cyber-button"
                data-testid="button-continue"
              >
                <Wallet className="mr-3 h-5 w-5" />
                Continue to Voting
              </Button>
              <Button 
                onClick={handleDisconnect}
                variant="outline"
                className="w-full h-12 border-2 border-muted-foreground text-muted-foreground hover:bg-muted-foreground hover:text-background transition-all"
                data-testid="button-disconnect-wallet"
              >
                <LogOut className="mr-2 h-4 w-4" />
                Disconnect Wallet
              </Button>
            </div>
          </div>
        ) : (
          <Button 
            onClick={handleConnect} 
            disabled={isLoading}
            className="w-full h-16 text-xl cyber-button"
            data-testid="button-connect-wallet"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-3 h-6 w-6 animate-spin" />
                Connecting to Wallet...
              </>
            ) : (
              <>
                <Wallet className="mr-3 h-6 w-6" />
                Connect MetaMask
              </>
            )}
          </Button>
        )}
      </div>
    </div>
  );
}
