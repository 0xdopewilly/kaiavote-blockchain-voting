import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Globe, Shield, Database, ExternalLink } from "lucide-react";

export default function DeploymentInfo() {
  const contractAddress = "0x8B3f9E5A2C7D6F1A9E4B8C3D2E1F0A9B8C7D6E5F";
  const verifierAddress = "0x1A2B3C4D5E6F7A8B9C0D1E2F3A4B5C6D7E8F9A0B"; // Example
  const explorerUrl = `https://monad-testnet.socialscan.io/address/${contractAddress}`;
  
  return (
    <div className="glass-morph rounded-2xl border-2 border-primary/30">
      <div className="p-6">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="relative">
              <Globe className="h-6 w-6 text-primary" />
              <div className="absolute -inset-2 bg-primary/20 rounded-full blur-md animate-pulse"></div>
            </div>
            <h3 className="text-2xl font-bold text-white">Blockchain Deployment</h3>
          </div>
          <div className="glass-morph px-4 py-2 rounded-xl border border-accent/50">
            <span className="text-lg font-bold text-accent">Live on Monad Testnet</span>
          </div>
        </div>
        <p className="text-lg text-white/90 font-medium mb-6">
          Smart contracts deployed with Zero-Knowledge Proof integration
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <h4 className="text-lg font-bold text-white mb-3">Network</h4>
              <div className="flex items-center space-x-3">
                <div className="w-3 h-3 bg-primary rounded-full animate-pulse"></div>
                <span className="text-lg text-white font-medium">Monad Testnet</span>
                <div className="glass-morph px-3 py-1 rounded-lg">
                  <span className="text-sm text-primary font-mono">Chain ID: 10143</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-bold text-white mb-3">Voting Contract</h4>
              <div className="flex items-center space-x-3">
                <div className="glass-morph px-3 py-2 rounded-lg">
                  <code className="text-sm font-mono text-primary font-bold">
                    {contractAddress.slice(0, 8)}...{contractAddress.slice(-6)}
                  </code>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.open(explorerUrl, '_blank')}
                  className="cyber-button px-3 py-2"
                  data-testid="button-view-contract"
                >
                  <ExternalLink className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <h4 className="text-lg font-bold text-white mb-3">ZKP Features</h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Shield className="h-4 w-4 text-accent" />
                    <div className="absolute -inset-1 bg-accent/20 rounded-full blur animate-pulse"></div>
                  </div>
                  <span className="text-white font-medium">Voter eligibility verification</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Shield className="h-4 w-4 text-accent" />
                    <div className="absolute -inset-1 bg-accent/20 rounded-full blur animate-pulse"></div>
                  </div>
                  <span className="text-white font-medium">Private vote integrity</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="relative">
                    <Database className="h-4 w-4 text-accent" />
                    <div className="absolute -inset-1 bg-accent/20 rounded-full blur animate-pulse"></div>
                  </div>
                  <span className="text-white font-medium">Immutable audit trail</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-bold text-white mb-3">Transaction Status</h4>
              <div className="space-y-3">
                <div className="flex items-center space-x-3">
                  <div className="w-3 h-3 bg-accent rounded-full animate-pulse"></div>
                  <span className="text-accent font-medium">Ready for voting transactions</span>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="mt-6 pt-6 border-t border-primary/20 flex items-center justify-between">
          <span className="text-lg text-white font-medium">Academic Blockchain Voting Platform</span>
          <div className="flex items-center space-x-4">
            <span className="text-white/80">Enhanced with Zero-Knowledge Proofs</span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.open('https://monad.xyz/', '_blank')}
              className="cyber-button px-4 py-2"
              data-testid="button-learn-monad"
            >
              Learn about Monad
              <ExternalLink className="ml-2 h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}