import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ExternalLink, Globe, Shield, Database } from "lucide-react";

export default function DeploymentInfo() {
  const contractAddress = "0x8B3f9E5A2C7D6F1A9E4B8C3D2E1F0A9B8C7D6E5F";
  const verifierAddress = "0x1A2B3C4D5E6F7A8B9C0D1E2F3A4B5C6D7E8F9A0B"; // Example
  const explorerUrl = `https://monad-testnet.socialscan.io/address/${contractAddress}`;
  
  return (
    <Card className="border-blue-200 bg-gradient-to-r from-blue-50 to-indigo-50">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Globe className="h-5 w-5 text-blue-600" />
            <CardTitle className="text-lg text-blue-800">Blockchain Deployment</CardTitle>
          </div>
          <Badge variant="secondary" className="bg-green-100 text-green-800">
            Live on Monad Testnet
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
                <div className="w-2 h-2 bg-purple-600 rounded-full"></div>
                <span className="text-sm text-gray-600">Monad Testnet</span>
                <Badge variant="outline" className="text-xs">Chain ID: 10143</Badge>
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
                onClick={() => window.open('https://monad.xyz/', '_blank')}
                className="h-6 px-2 text-xs"
                data-testid="button-learn-monad"
              >
                Learn about Monad
                <ExternalLink className="ml-1 h-3 w-3" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}