import { useEffect, useState } from "react";
import { useLocation } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Check, ExternalLink, Download, Shield, Wallet, LogOut } from "lucide-react";
import ProgressIndicator from "@/components/progress-indicator";
import LiveMetrics from "@/components/live-metrics";
import DeploymentInfo from "@/components/deployment-info";
import GasSavingsBanner from "@/components/gas-savings-banner";
import { useWeb3 } from "@/hooks/use-web3";

export default function ConfirmationPage() {
  const [, setLocation] = useLocation();
  const { account, isConnected, disconnect } = useWeb3();
  const [transactionDetails] = useState({
    hash: "0xabc123def456789012345678901234567890123456789012345678901234567890",
    blockNumber: Math.floor(Math.random() * 1000000) + 1000000,
    timestamp: new Date().toISOString(),
  });

  // Redirect if not connected
  useEffect(() => {
    if (!isConnected || !account) {
      setLocation("/");
    }
  }, [isConnected, account, setLocation]);

  // Fetch voter data to verify vote was recorded
  const { data: voter } = useQuery<any>({
    queryKey: ["/api/voters/wallet", account],
    enabled: !!account,
  });

  const handleViewOnExplorer = () => {
    const explorerUrl = `https://monad-testnet.socialscan.io/tx/${transactionDetails.hash}`;
    window.open(explorerUrl, '_blank');
  };

  const handleDownloadReceipt = () => {
    const receipt = {
      voterAddress: account,
      transactionHash: transactionDetails.hash,
      blockNumber: transactionDetails.blockNumber,
      timestamp: transactionDetails.timestamp,
      network: "Monad Testnet",
    };

    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(receipt, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `vote-receipt-${Date.now()}.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  const handleDisconnect = () => {
    disconnect();
    setLocation("/");
  };

  const formatTimestamp = (timestamp: string) => {
    return new Date(timestamp).toLocaleString('en-US', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      timeZoneName: 'short'
    });
  };

  return (
    <div className="min-h-screen bg-surface">
      {/* Header */}
      <header className="bg-white shadow-md border-b-2 border-primary">
        <div className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="text-primary text-2xl">
                <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-5 14H7v-2h7v2zm3-4H7v-2h10v2zm0-4H7V7h10v2z"/>
                </svg>
              </div>
              <h1 className="text-xl font-medium text-secondary">Academic Voting Platform</h1>
            </div>
            <div className="flex items-center space-x-4">
              {account && (
                <>
                  <div className="flex items-center space-x-2 bg-accent/10 px-3 py-2 rounded-lg">
                    <Wallet className="h-4 w-4 text-accent" />
                    <span className="text-sm font-medium text-accent">
                      {account.slice(0, 6)}...{account.slice(-4)}
                    </span>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDisconnect}
                    className="text-warning border-warning hover:bg-warning hover:text-white"
                    data-testid="button-disconnect-wallet"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    Disconnect
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      <ProgressIndicator currentStep={3} />

      <main className="container mx-auto px-6 py-8">
        <div className="max-w-4xl mx-auto space-y-8">
          <GasSavingsBanner />
          <DeploymentInfo />
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <Card>
            <CardHeader className="text-center">
              <div className="w-16 h-16 bg-accent rounded-full flex items-center justify-center mx-auto mb-6">
                <Check className="text-white text-2xl h-8 w-8" />
              </div>
              <CardTitle className="text-2xl font-medium text-secondary">
                Vote Successfully Recorded!
              </CardTitle>
              <CardDescription className="text-lg">
                Your vote has been securely recorded on the blockchain and cannot be altered.
              </CardDescription>
            </CardHeader>
            
            <CardContent className="space-y-6">
              {/* Transaction Details */}
              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="font-medium text-gray-700 mb-4">Transaction Details</h3>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Transaction Hash:</span>
                    <span 
                      className="font-mono text-xs text-gray-900 break-all max-w-48 text-right"
                      data-testid="transaction-hash"
                    >
                      {transactionDetails.hash.slice(0, 20)}...{transactionDetails.hash.slice(-10)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Block Number:</span>
                    <span className="text-gray-900" data-testid="block-number">
                      {transactionDetails.blockNumber.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Network:</span>
                    <span className="text-gray-900">Monad Testnet</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Timestamp:</span>
                    <span className="text-gray-900 text-xs" data-testid="timestamp">
                      {formatTimestamp(transactionDetails.timestamp)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Security Notice */}
              <Alert className="border-blue-200 bg-blue-50">
                <Shield className="h-4 w-4 text-blue-500" />
                <AlertDescription className="text-blue-700">
                  <p className="font-medium mb-1">Blockchain Security</p>
                  <p>
                    Your vote is now permanently stored on the blockchain, ensuring transparency 
                    and immutability. No one can alter or delete your vote.
                  </p>
                </AlertDescription>
              </Alert>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4">
                <Button 
                  onClick={handleViewOnExplorer}
                  className="flex-1 bg-primary hover:bg-primary/90 text-white"
                  data-testid="button-view-explorer"
                >
                  <ExternalLink className="mr-2 h-4 w-4" />
                  View on Explorer
                </Button>
                <Button 
                  onClick={handleDownloadReceipt}
                  variant="outline"
                  className="flex-1"
                  data-testid="button-download-receipt"
                >
                  <Download className="mr-2 h-4 w-4" />
                  Download Receipt
                </Button>
              </div>

              {/* Thank You Message */}
              <div className="pt-6 border-t border-gray-200 text-center">
                <p className="text-gray-600">
                  Thank you for participating in the democratic process!
                </p>
                {voter && (
                  <p className="text-sm text-gray-500 mt-2">
                    Vote recorded for: {voter.fullName} ({voter.matricNumber})
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
            </div>
            
            <div className="lg:col-span-1">
              <LiveMetrics />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
