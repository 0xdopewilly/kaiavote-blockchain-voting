import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Info, RefreshCw } from "lucide-react";

export default function WalletDebug() {
  const [debugInfo, setDebugInfo] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);

  const checkWalletStatus = async () => {
    setIsLoading(true);
    try {
      const hasEthereum = !!(window as any).ethereum;
      let accounts = [];
      let chainId = null;
      let error = null;

      if (hasEthereum) {
        try {
          accounts = await (window as any).ethereum.request({
            method: 'eth_accounts',
          });
          chainId = await (window as any).ethereum.request({
            method: 'eth_chainId',
          });
        } catch (err: any) {
          error = err.message;
        }
      }

      setDebugInfo({
        hasEthereum,
        accounts,
        chainId,
        chainIdDecimal: chainId ? parseInt(chainId, 16) : null,
        isMonadTestnet: chainId === '0x279F',
        error,
        timestamp: new Date().toISOString(),
      });
    } catch (err: any) {
      setDebugInfo({
        error: err.message,
        timestamp: new Date().toISOString(),
      });
    }
    setIsLoading(false);
  };

  return (
    <Card className="border-blue-200">
      <CardHeader>
        <CardTitle className="flex items-center space-x-2">
          <Info className="h-5 w-5" />
          <span>Wallet Debug Info</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <Button 
          onClick={checkWalletStatus}
          disabled={isLoading}
          className="mb-4"
        >
          {isLoading ? (
            <>
              <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
              Checking...
            </>
          ) : (
            'Check Wallet Status'
          )}
        </Button>

        {debugInfo && (
          <Alert>
            <AlertDescription>
              <pre className="text-xs whitespace-pre-wrap">
                {JSON.stringify(debugInfo, null, 2)}
              </pre>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}