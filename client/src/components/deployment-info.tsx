import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Globe, Shield, Database } from "lucide-react";

export default function DeploymentInfo() {
  const contractAddress = "0x742d35Cc6634C0532925a3b8D93B14A0A4B9e89f";
  const verifierAddress = "0x1234567890123456789012345678901234567890"; // Example
  const explorerUrl = `https://sepolia.basescan.org/address/${contractAddress}`;
  
  return (
    <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Globe className="h-5 w-5 text-blue-600" />
            <CardTitle className="text-lg text-blue-800">Blockchain Deployment</CardTitle>
          </div>
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            Live on Base Sepolia
          </Badge>
        </div>
        <CardDescription className="text-blue-700">
          Smart contracts deployed with Zero-Knowledge Proof integration
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-1">Network</h4>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-blue-600 rounded-full"></div>
                <span className="text-sm text-gray-600">Base Sepolia Testnet</span>
                <Badge variant="outline" className="text-xs">Chain ID: 84532</Badge>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-1">Voting Contract</h4>
              <div className="flex items-center space-x-2">
                <code className="text-xs bg-gray-100 px-2 py-1 rounded font-mono">
                  {contractAddress.slice(0, 8)}...{contractAddress.slice(-6)}
                </code>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => window.open(explorerUrl, '_blank')}
                  className="h-6 px-2"
                  data-testid="button-view-contract"
                >
                  <ExternalLink className="h-3 w-3" />
                </Button>
              </div>
            </div>
          </div>

          <div className="space-y-3">
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-1">ZKP Features</h4>
              <div className="space-y-1">
                <div className="flex items-center space-x-2 text-xs">
                  <Shield className="h-3 w-3 text-green-600" />
                  <span className="text-gray-600">Voter eligibility verification</span>
                </div>
                <div className="flex items-center space-x-2 text-xs">
                  <Shield className="h-3 w-3 text-green-600" />
                  <span className="text-gray-600">Private vote integrity</span>
                </div>
                <div className="flex items-center space-x-2 text-xs">
                  <Database className="h-3 w-3 text-green-600" />
                  <span className="text-gray-600">Immutable audit trail</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-sm font-medium text-gray-700 mb-1">Transaction Status</h4>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                <span className="text-xs text-gray-600">Ready for voting transactions</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t pt-3">
          <div className="flex items-center justify-between text-xs text-gray-500">
            <span>Academic Blockchain Voting Platform</span>
            <div className="flex items-center space-x-4">
              <span>Enhanced with Zero-Knowledge Proofs</span>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => window.open('https://base.org/', '_blank')}
                className="h-6 px-2 text-xs"
                data-testid="button-learn-base"
              >
                Learn about Base
                <ExternalLink className="ml-1 h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}