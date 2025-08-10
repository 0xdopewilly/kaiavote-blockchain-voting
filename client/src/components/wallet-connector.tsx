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
    <Card className="w-full max-w-md mx-auto">
      <CardContent className="pt-6 text-center">
        <Wallet className="h-12 w-12 text-primary mx-auto mb-4" />
        <h3 className="text-lg font-medium text-secondary mb-2">{title}</h3>
        <p className="text-gray-600 mb-6">{description}</p>
        
        {error && (
          <Alert className="mb-4" variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {account ? (
          <div className="space-y-4">
            <Alert>
              <AlertDescription>
                Connected: {account.slice(0, 6)}...{account.slice(-4)}
              </AlertDescription>
            </Alert>
            <div className="space-y-3">
              <Button 
                onClick={() => onConnect(account)} 
                className="w-full"
                data-testid="button-continue"
              >
                Continue
              </Button>
              <Button 
                onClick={handleDisconnect}
                variant="outline"
                className="w-full"
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
            className="w-full bg-warning hover:bg-warning/90 text-white"
            data-testid="button-connect-wallet"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Connecting...
              </>
            ) : (
              <>
                <Wallet className="mr-2 h-4 w-4" />
                Connect MetaMask
              </>
            )}
          </Button>
        )}
      </CardContent>
    </Card>
  );
}
