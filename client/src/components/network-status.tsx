import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, AlertTriangle, Zap } from "lucide-react";
import { getCurrentNetwork, isWalletAvailable } from "@/lib/web3";

export default function NetworkStatus() {
  const [networkStatus, setNetworkStatus] = useState<{
    chainId: string | null;
    isCorrectNetwork: boolean;
    networkName: string;
    nativeCurrency: string;
    isLoading: boolean;
  }>({
    chainId: null,
    isCorrectNetwork: false,
    networkName: 'Unknown',
    nativeCurrency: 'ETH',
    isLoading: true,
  });

  useEffect(() => {
    const checkNetwork = async () => {
      try {
        if (await isWalletAvailable()) {
          const chainId = await getCurrentNetwork();
          const isKaia = chainId === '0x3E9' || chainId === '0x3e9' || parseInt(chainId, 16) === 1001; // KAIA Kairos Testnet in different formats
          
          setNetworkStatus({
            chainId,
            isCorrectNetwork: isKaia,
            networkName: isKaia ? 'KAIA Kairos Testnet' : 'Wrong Network',
            nativeCurrency: isKaia ? 'KAIA' : 'ETH',
            isLoading: false,
          });
        } else {
          setNetworkStatus(prev => ({ ...prev, isLoading: false }));
        }
      } catch (error) {
        console.error('Failed to check network:', error);
        setNetworkStatus(prev => ({ ...prev, isLoading: false }));
      }
    };

    checkNetwork();

    // Listen for network changes
    if (typeof window !== 'undefined' && window.ethereum) {
      const handleChainChanged = () => {
        checkNetwork();
      };
      
      window.ethereum.on('chainChanged', handleChainChanged);
      
      return () => {
        window.ethereum.removeListener('chainChanged', handleChainChanged);
      };
    }
  }, []);

  if (networkStatus.isLoading) {
    return null;
  }

  return (
    <Card className="border-blue-200">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {networkStatus.isCorrectNetwork ? (
              <CheckCircle className="h-5 w-5 text-green-600" />
            ) : (
              <AlertTriangle className="h-5 w-5 text-orange-500" />
            )}
            <div>
              <h4 className="font-medium text-gray-800">
                Network Status
              </h4>
              <p className="text-sm text-gray-600">
                {networkStatus.networkName} • {networkStatus.nativeCurrency} Token
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-2">
            {networkStatus.isCorrectNetwork && (
              <div className="flex items-center space-x-1">
                <Zap className="h-4 w-4 text-green-600" />
                <span className="text-xs text-green-600 font-medium">Ultra-Low Gas</span>
              </div>
            )}
            <Badge 
              variant={networkStatus.isCorrectNetwork ? "default" : "secondary"}
              className={networkStatus.isCorrectNetwork ? "bg-green-100 text-green-800" : "bg-orange-100 text-orange-800"}
            >
              {networkStatus.isCorrectNetwork ? "Connected" : "Switch Network"}
            </Badge>
          </div>
        </div>
        
        {!networkStatus.isCorrectNetwork && networkStatus.chainId && (
          <Alert className="mt-4 border-orange-200 bg-orange-50">
            <AlertTriangle className="h-4 w-4 text-orange-600" />
            <AlertDescription className="text-orange-800">
              <p className="font-medium mb-1">Wrong Network Detected</p>
              <p className="text-sm">
                Please switch to KAIA Kairos Testnet to use KAIA tokens and enjoy ultra-low gas fees.
                Current network: Chain ID {networkStatus.chainId}
              </p>
            </AlertDescription>
          </Alert>
        )}
      </CardContent>
    </Card>
  );
}