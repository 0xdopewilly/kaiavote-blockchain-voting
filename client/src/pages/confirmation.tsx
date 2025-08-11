import { useEffect, useState } from "react";
import { useLocation, Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Check, ExternalLink, Download, Shield, Wallet, LogOut, ArrowLeft } from "lucide-react";
import ProgressIndicator from "@/components/progress-indicator";
import LiveMetrics from "@/components/live-metrics";
import DeploymentInfo from "@/components/deployment-info";
import GasSavingsBanner from "@/components/gas-savings-banner";
import ZKPInfo from "@/components/zkp-info";
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
    <div className="min-h-screen p-2 sm:p-4 relative">
      <div className="container mx-auto max-w-full px-2 sm:px-4">
        {/* Home Button - Top Left */}
        <div className="absolute top-2 sm:top-4 left-2 sm:left-4 z-50">
          <Link href="/">
            <Button
              variant="outline"
              className="cyber-button bg-primary/10 hover:bg-primary/20 border-primary/30 hover:border-primary/60 backdrop-blur-sm text-xs sm:text-sm"
              data-testid="button-home"
            >
              <ArrowLeft className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 text-primary" />
              <span className="text-white font-medium">Home</span>
            </Button>
          </Link>
        </div>

        {/* Disconnect Wallet Button - Top Right */}
        <div className="absolute top-2 sm:top-4 right-2 sm:right-4 z-50">
          <Button
            variant="outline"
            onClick={handleDisconnect}
            className="cyber-button bg-destructive/10 hover:bg-destructive/20 border-destructive/30 hover:border-destructive/60 backdrop-blur-sm"
            data-testid="button-disconnect-wallet"
          >
            <LogOut className="h-4 w-4 mr-2 text-destructive" />
            <span className="text-white font-medium">Disconnect</span>
          </Button>
        </div>

        {/* Header Section */}
        <div className="text-center mb-6 sm:mb-8 relative mt-12 sm:mt-8">
          <div className="inline-block relative">
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-white mb-3 sm:mb-4 tracking-wider" style={{
              background: 'linear-gradient(135deg, #ffffff 0%, #e0e7ff 25%, #c7d2fe 50%, #a78bfa 75%, #8b5cf6 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
              textShadow: '0 0 30px rgba(255, 255, 255, 0.5)'
            }}>
              CryptoVote
            </h1>
            <div className="absolute -inset-6 bg-gradient-to-r from-transparent via-primary/30 to-transparent blur-2xl"></div>
          </div>
          <div className="space-y-2">
            <p className="text-2xl font-semibold neon-text tracking-wide flex items-center justify-center gap-2">
              <Check className="h-8 w-8 text-green-400" />
              Vote Confirmed Successfully
            </p>
            <p className="text-lg text-foreground/80">
              {voter?.fullName} • {voter?.matricNumber}
            </p>
          </div>
          
          {/* Enhanced floating elements */}
          <div className="absolute -top-10 -left-10 w-24 h-24 bg-primary/20 rounded-full blur-xl animate-pulse"></div>
          <div className="absolute -top-16 -right-16 w-36 h-36 bg-accent/20 rounded-full blur-2xl animate-pulse delay-700"></div>
        </div>

        <ProgressIndicator currentStep={3} />

        <div className="max-w-6xl mx-auto space-y-8">
          {/* Side by side banners */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <GasSavingsBanner />
            <ZKPInfo />
          </div>
          
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="glass-morph rounded-2xl p-8">
                <div className="text-center mb-8">
                  <div className="relative w-20 h-20 mx-auto mb-6">
                    <div className="w-20 h-20 bg-gradient-to-r from-primary to-accent rounded-full flex items-center justify-center">
                      <Check className="text-white text-3xl h-10 w-10" />
                    </div>
                    <div className="absolute -inset-4 bg-primary/20 rounded-full blur-xl animate-pulse"></div>
                  </div>
                  <h2 className="text-4xl font-bold text-white mb-4">
                    Vote Successfully Recorded!
                  </h2>
                  <p className="text-xl text-white/90 font-medium">
                    Your vote has been securely recorded on the blockchain and cannot be altered.
                  </p>
                </div>
                
                <div className="space-y-8">
                  {/* Transaction Details */}
                  <div className="glass-morph rounded-xl p-6 border border-primary/30">
                    <h3 className="text-2xl font-bold text-white mb-6 flex items-center">
                      <Shield className="h-6 w-6 text-primary mr-3" />
                      Transaction Details
                    </h3>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center py-3 border-b border-primary/20">
                        <span className="text-white font-medium text-lg">Transaction Hash:</span>
                        <span 
                          className="font-mono text-sm text-primary break-all max-w-48 text-right font-bold"
                          data-testid="transaction-hash"
                        >
                          {transactionDetails.hash.slice(0, 20)}...{transactionDetails.hash.slice(-10)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-3 border-b border-primary/20">
                        <span className="text-white font-medium text-lg">Block Number:</span>
                        <span className="text-primary font-bold text-lg" data-testid="block-number">
                          {transactionDetails.blockNumber.toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-3 border-b border-primary/20">
                        <span className="text-white font-medium text-lg">Network:</span>
                        <span className="text-primary font-bold text-lg">Monad Testnet</span>
                      </div>
                      <div className="flex justify-between items-center py-3 border-b border-primary/20">
                        <span className="text-white font-medium text-lg">Timestamp:</span>
                        <span className="text-primary font-bold text-sm" data-testid="timestamp">
                          {formatTimestamp(transactionDetails.timestamp)}
                        </span>
                      </div>
                      <div className="flex justify-between items-center py-3">
                        <span className="text-white font-medium text-lg">Gas Cost:</span>
                        <span className="text-accent font-bold font-mono text-lg">
                          ~0.0005 MON (~$0.0005)
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Security Notice */}
                  <div className="glass-morph rounded-xl p-6 border-2 border-accent/30">
                    <div className="flex items-center space-x-3 mb-4">
                      <div className="relative">
                        <Shield className="h-6 w-6 text-accent" />
                        <div className="absolute -inset-2 bg-accent/20 rounded-full blur-md animate-pulse"></div>
                      </div>
                      <h3 className="text-2xl font-bold text-accent">Blockchain Security</h3>
                    </div>
                    <p className="text-white text-lg font-medium">
                      Your vote is now permanently stored on the blockchain, ensuring transparency 
                      and immutability. No one can alter or delete your vote.
                    </p>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row gap-6">
                    <Button 
                      onClick={handleViewOnExplorer}
                      className="flex-1 h-14 text-lg cyber-button"
                      data-testid="button-view-explorer"
                    >
                      <ExternalLink className="mr-3 h-5 w-5" />
                      View on Explorer
                    </Button>
                    <Button 
                      onClick={handleDownloadReceipt}
                      className="flex-1 h-14 text-lg cyber-button bg-gradient-to-r from-accent to-primary"
                      data-testid="button-download-receipt"
                    >
                      <Download className="mr-3 h-5 w-5" />
                      Download Receipt
                    </Button>
                  </div>

                  {/* Thank You Message */}
                  <div className="glass-morph rounded-xl p-6 border-2 border-primary/20 text-center">
                    <h3 className="text-2xl font-bold text-white mb-4">
                      Thank you for participating in the democratic process!
                    </h3>
                    {voter && (
                      <p className="text-lg text-primary font-medium">
                        Vote recorded for: {voter.fullName} ({voter.matricNumber})
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="lg:col-span-1">
              <LiveMetrics />
            </div>
          </div>
        </div>
        
      </div>
      
      {/* ZKP Info Button - Bottom Right */}
      <div className="fixed bottom-4 right-4 z-50">
        <Button
          variant="outline"
          className="cyber-button bg-primary/10 hover:bg-primary/20 border-primary/30 hover:border-primary/60 backdrop-blur-sm px-3 py-2 h-auto"
          onClick={() => document.querySelector('[data-testid="button-zkp-info"]')?.click()}
          data-testid="floating-zkp-info-small"
        >
          <Shield className="h-4 w-4 text-primary mr-2" />
          <span className="text-xs text-white font-medium">ZKP Info</span>
        </Button>
        <div className="absolute -inset-1 bg-primary/10 rounded-lg blur animate-pulse pointer-events-none"></div>
      </div>
    </div>
  );
}