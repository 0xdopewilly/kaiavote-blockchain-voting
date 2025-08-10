import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Shield, Lock, Eye, Info, ChevronRight } from "lucide-react";
import { zkpService } from "@/lib/zkp";

export default function ZKPInfo() {
  const [showDetailedInfo, setShowDetailedInfo] = useState(false);
  const zkpInfo = zkpService.getZKPInfo();

  return (
    <Card className="border-blue-200 bg-blue-50/50">
      <CardHeader className="pb-3">
        <div className="flex items-center space-x-2">
          <Shield className="h-5 w-5 text-blue-600" />
          <CardTitle className="text-sm font-medium text-blue-800">
            Zero-Knowledge Privacy Protection
          </CardTitle>
        </div>
        <CardDescription className="text-blue-700">
          Your privacy is protected using advanced cryptographic proofs
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="flex items-center space-x-2 text-sm">
            <Lock className="h-4 w-4 text-green-600" />
            <span className="text-gray-700">Matric # Hidden</span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <Eye className="h-4 w-4 text-green-600" />
            <span className="text-gray-700">Vote Private</span>
          </div>
          <div className="flex items-center space-x-2 text-sm">
            <Shield className="h-4 w-4 text-green-600" />
            <span className="text-gray-700">Identity Protected</span>
          </div>
        </div>

        <Dialog open={showDetailedInfo} onOpenChange={setShowDetailedInfo}>
          <DialogTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className="w-full text-blue-700 border-blue-300 hover:bg-blue-100"
              data-testid="button-zkp-info"
            >
              <Info className="mr-2 h-4 w-4" />
              How Zero-Knowledge Proofs Work
              <ChevronRight className="ml-2 h-4 w-4" />
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center space-x-2">
                <Shield className="h-6 w-6 text-blue-600" />
                <span>Zero-Knowledge Proof Technology</span>
              </DialogTitle>
              <DialogDescription>
                Understanding how your privacy is mathematically guaranteed
              </DialogDescription>
            </DialogHeader>
            
            <div className="space-y-6">
              <Alert className="border-blue-200 bg-blue-50">
                <Shield className="h-4 w-4" />
                <AlertDescription>
                  <p className="font-medium text-blue-800 mb-1">What are Zero-Knowledge Proofs?</p>
                  <p className="text-blue-700 text-sm">
                    ZKPs allow you to prove you're eligible to vote and that your vote is valid 
                    without revealing your matric number, vote choices, or personal identity.
                  </p>
                </AlertDescription>
              </Alert>

              <div>
                <h4 className="font-medium text-gray-800 mb-3">Privacy Features</h4>
                <div className="space-y-2">
                  {zkpInfo.privacyFeatures.map((feature, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <Lock className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-800 mb-3">Security Features</h4>
                <div className="space-y-2">
                  {zkpInfo.securityFeatures.map((feature, index) => (
                    <div key={index} className="flex items-start space-x-2">
                      <Shield className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-gray-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-800 mb-2">How It Works</h4>
                <div className="space-y-3 text-sm text-gray-700">
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-medium text-blue-700 flex-shrink-0 mt-0.5">
                      1
                    </div>
                    <div>
                      <p className="font-medium">Registration Phase</p>
                      <p>You prove you have a valid matric number without revealing it. The system generates a cryptographic proof that you're an eligible student.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-medium text-blue-700 flex-shrink-0 mt-0.5">
                      2
                    </div>
                    <div>
                      <p className="font-medium">Voting Phase</p>
                      <p>Your vote selections are proven valid without revealing which candidates you chose. The blockchain records that a valid vote occurred.</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start space-x-3">
                    <div className="w-6 h-6 bg-blue-100 rounded-full flex items-center justify-center text-xs font-medium text-blue-700 flex-shrink-0 mt-0.5">
                      3
                    </div>
                    <div>
                      <p className="font-medium">Verification</p>
                      <p>Anyone can verify that all votes are legitimate and the election is fair, but individual voting choices remain completely private.</p>
                    </div>
                  </div>
                </div>
              </div>

              <Alert className="border-green-200 bg-green-50">
                <Shield className="h-4 w-4 text-green-600" />
                <AlertDescription>
                  <p className="font-medium text-green-800 mb-1">Mathematical Privacy Guarantee</p>
                  <p className="text-green-700 text-sm">
                    Zero-Knowledge Proofs provide mathematically provable privacy. It's cryptographically 
                    impossible for anyone to determine your vote choices or identity from the blockchain data.
                  </p>
                </AlertDescription>
              </Alert>

              <div className="text-xs text-gray-500 bg-gray-50 rounded p-3">
                <p className="font-medium mb-1">Technical Implementation:</p>
                <p>{zkpInfo.implementation}</p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
}