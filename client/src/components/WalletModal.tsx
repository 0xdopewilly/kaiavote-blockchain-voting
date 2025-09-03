import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Wallet, Zap, Shield, ExternalLink } from "lucide-react";

interface WalletOption {
  id: string;
  name: string;
  icon: string;
  description: string;
  downloadUrl?: string;
  isInstalled?: boolean;
}

interface WalletModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectWallet: (walletId: string) => void;
}

export default function WalletModal({ isOpen, onClose, onSelectWallet }: WalletModalProps) {
  const [selectedWallet, setSelectedWallet] = useState<string | null>(null);

  // Check if wallets are installed
  const isMetaMaskInstalled = typeof window !== "undefined" && window.ethereum?.isMetaMask;
  const isKaiaWalletInstalled = typeof window !== "undefined" && (window as any).klaytn;

  const walletOptions: WalletOption[] = [
    {
      id: "metamask",
      name: "MetaMask",
      icon: "🦊",
      description: "The most popular Web3 wallet with KAIA support",
      downloadUrl: "https://metamask.io/download/",
      isInstalled: isMetaMaskInstalled
    },
    {
      id: "kaia",
      name: "KAIA Wallet",
      icon: "🟢",
      description: "Official KAIA ecosystem wallet with native integration",
      downloadUrl: "https://docs.kaia.io/build/tools/wallets/",
      isInstalled: isKaiaWalletInstalled
    }
  ];

  const handleWalletSelect = (walletId: string) => {
    const wallet = walletOptions.find(w => w.id === walletId);
    if (wallet?.isInstalled) {
      setSelectedWallet(walletId);
      onSelectWallet(walletId);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md kaia-border kaia-glow">
        <DialogHeader>
          <DialogTitle className="text-center text-2xl font-bold kaia-text flex items-center justify-center gap-2">
            <Wallet className="h-6 w-6" />
            Connect Your Wallet
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 p-4">
          <div className="text-center text-sm text-muted-foreground mb-6">
            Connect with one of our supported KAIA-compatible wallets
          </div>
          
          {walletOptions.map((wallet) => (
            <Card 
              key={wallet.id} 
              className={`cursor-pointer transition-all duration-300 hover:scale-105 kaia-border ${
                wallet.isInstalled 
                  ? 'hover:kaia-glow bg-card/80' 
                  : 'opacity-50 bg-muted/20'
              }`}
              onClick={() => wallet.isInstalled && handleWalletSelect(wallet.id)}
            >
              <CardContent className="p-6">
                <div className="flex items-center space-x-4">
                  <div className="text-4xl">{wallet.icon}</div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-bold text-lg text-foreground">{wallet.name}</h3>
                      {wallet.isInstalled && (
                        <div className="flex items-center gap-1">
                          <Shield className="h-4 w-4 text-green-500" />
                          <span className="text-xs text-green-500 font-medium">Installed</span>
                        </div>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">{wallet.description}</p>
                    
                    {wallet.isInstalled ? (
                      <div className="flex items-center gap-2 mt-3">
                        <Zap className="h-4 w-4 text-primary" />
                        <span className="text-xs text-primary font-medium">Ready to connect</span>
                      </div>
                    ) : (
                      <div className="mt-3">
                        <Button 
                          variant="outline" 
                          size="sm" 
                          className="text-xs"
                          onClick={(e) => {
                            e.stopPropagation();
                            window.open(wallet.downloadUrl, '_blank');
                          }}
                        >
                          <ExternalLink className="h-3 w-3 mr-1" />
                          Install {wallet.name}
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          
          <div className="text-center mt-6">
            <div className="text-xs text-muted-foreground">
              ⚡ Powered by KAIA Chain - Ultra-low gas fees
            </div>
            <div className="text-xs text-muted-foreground mt-1">
              🔒 Your wallet, your keys, your crypto
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}