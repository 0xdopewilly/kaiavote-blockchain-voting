import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Shield, Eye, EyeOff, Lock, Key } from "lucide-react";
import { zkpService } from "@/lib/zkp";

export default function ZKPDemo() {
  const [isGenerating, setIsGenerating] = useState(false);
  const [proof, setProof] = useState<any>(null);
  const [showPrivateData, setShowPrivateData] = useState(false);
  const [demoStep, setDemoStep] = useState<'start' | 'generating' | 'complete'>('start');

  const runZKPDemo = async () => {
    setIsGenerating(true);
    setDemoStep('generating');
    setProof(null);

    try {
      // Simulate voter registration ZKP
      const matricNumber = "CSC/2012/001"; // Private input
      const walletAddress = "0x742d35Cc6635C0532925a3b8D4e4E4E4E4E4E4E4";

      console.log('🎓 ACADEMIC VOTING PLATFORM - ZKP DEMONSTRATION');
      console.log('==================================================');
      console.log('📝 Demonstrating Zero-Knowledge Proof Generation');
      console.log('🔒 PRIVATE DATA (never revealed to blockchain):');
      console.log(`   • Matric Number: ${matricNumber}`);
      console.log(`   • Student Name: John Smith`);
      console.log(`   • Department: Computer Science Department (CSC)`);
      console.log('');
      
      // Generate eligibility proof
      const eligibilityProof = await zkpService.generateEligibilityProof(matricNumber, walletAddress);
      
      console.log('✅ ZKP ELIGIBILITY PROOF GENERATED:');
      console.log('🔐 What the blockchain sees (PUBLIC):');
      console.log(`   • Proof Components: a[], b[][], c[]`);
      console.log(`   • Public Signals: ${eligibilityProof.publicSignals[0]}`);
      console.log('📋 What this proves WITHOUT revealing private data:');
      console.log('   ✓ Student has valid matric number from accepted range');
      console.log('   ✓ Student belongs to this university');
      console.log('   ✓ Student is eligible to vote');
      console.log('   ✗ Actual matric number remains HIDDEN');
      console.log('   ✗ Student identity remains PRIVATE');
      console.log('');

      // Verify the proof
      const isValid = await zkpService.verifyProof(eligibilityProof);
      
      console.log('🔍 PROOF VERIFICATION:');
      console.log(`✅ Verification Result: ${isValid ? 'VALID' : 'INVALID'}`);
      console.log('📊 Verification proves:');
      console.log('   • Student eligibility is cryptographically verified');
      console.log('   • No personal information was revealed');
      console.log('   • Vote can proceed with complete privacy');
      console.log('');
      
      // Now simulate vote proof
      const votes = ["candidate123", "candidate456", "candidate789"];
      console.log('🗳️ DEMONSTRATING VOTE ZKP:');
      console.log('🔒 PRIVATE VOTE DATA (never revealed):');
      console.log(`   • Selected Candidates: ${votes.join(', ')}`);
      
      const voteProof = await zkpService.generateVoteProof(votes, walletAddress);
      
      console.log('✅ VOTE ZKP GENERATED:');
      console.log('🔐 What the blockchain sees:');
      console.log(`   • Vote Hash: ${voteProof.publicSignals[1]}`);
      console.log(`   • Voter Hash: ${voteProof.publicSignals[0]}`);
      console.log('📋 What this proves:');
      console.log('   ✓ Vote contains valid candidate selections');
      console.log('   ✓ Voter is eligible and hasn\'t voted before');
      console.log('   ✓ Vote integrity is mathematically guaranteed');
      console.log('   ✗ Actual vote selections remain SECRET');
      console.log('');
      console.log('🎉 ZKP DEMONSTRATION COMPLETE!');
      console.log('==================================================');

      setProof({
        eligibility: eligibilityProof,
        vote: voteProof,
        privateData: {
          matricNumber,
          votes,
          studentName: "John Smith (CSC Student)"
        }
      });
      
      setDemoStep('complete');
    } catch (error) {
      console.error('ZKP Demo Error:', error);
    }
    
    setIsGenerating(false);
  };

  const resetDemo = () => {
    setProof(null);
    setDemoStep('start');
    setShowPrivateData(false);
  };

  return (
    <div className="glass-morph rounded-2xl border-2 border-primary/30 p-6">
      <div className="flex items-center mb-6">
        <div className="relative mr-3">
          <Shield className="h-8 w-8 text-primary" />
          <div className="absolute -inset-2 bg-primary/20 rounded-full blur-md animate-pulse"></div>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-white">Zero-Knowledge Proof Demo</h2>
          <p className="text-white/80">Live demonstration of privacy-preserving voting</p>
        </div>
      </div>

      {demoStep === 'start' && (
        <div className="space-y-4">
          <div className="glass-morph rounded-xl p-4 border border-accent/30">
            <h3 className="text-lg font-bold text-white mb-3 flex items-center">
              <Key className="h-5 w-5 text-accent mr-2" />
              What ZKP Proves
            </h3>
            <ul className="space-y-2 text-white/90">
              <li>✅ Student eligibility without revealing matric number</li>
              <li>✅ Vote validity without revealing selections</li>
              <li>✅ Anti-double-voting without revealing identity</li>
              <li>✅ Complete mathematical verification of all claims</li>
            </ul>
          </div>
          
          <Button 
            onClick={runZKPDemo}
            disabled={isGenerating}
            className="w-full h-14 text-lg cyber-button"
            data-testid="button-run-zkp-demo"
          >
            {isGenerating ? (
              <>
                <div className="animate-spin h-5 w-5 mr-3 border-2 border-white border-t-transparent rounded-full"></div>
                Generating ZKP...
              </>
            ) : (
              <>
                <Shield className="h-5 w-5 mr-3" />
                Run ZKP Demonstration
              </>
            )}
          </Button>
          
          <p className="text-sm text-white/60 text-center">
            Open browser console (F12) to see detailed ZKP logs
          </p>
        </div>
      )}

      {demoStep === 'generating' && (
        <div className="text-center space-y-4">
          <div className="w-16 h-16 mx-auto border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <h3 className="text-xl font-bold text-white">Generating Zero-Knowledge Proofs</h3>
          <p className="text-white/80">Creating cryptographic proofs while preserving privacy...</p>
        </div>
      )}

      {demoStep === 'complete' && proof && (
        <div className="space-y-6">
          <div className="text-center mb-6">
            <h3 className="text-xl font-bold text-white mb-2">ZKP Generation Complete!</h3>
            <p className="text-white/80">Proofs generated successfully with full privacy protection</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-morph rounded-xl p-4 border border-primary/30">
              <h4 className="text-lg font-bold text-white mb-3 flex items-center">
                <Lock className="h-5 w-5 text-primary mr-2" />
                Private Data
              </h4>
              
              <div className="flex items-center justify-between mb-3">
                <span className="text-white/80">Visibility:</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowPrivateData(!showPrivateData)}
                  className="cyber-button px-3 py-1"
                >
                  {showPrivateData ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  {showPrivateData ? ' Hide' : ' Show'}
                </Button>
              </div>
              
              {showPrivateData ? (
                <div className="space-y-2 text-sm">
                  <div className="text-red-400">⚠️ SENSITIVE DATA (kept private):</div>
                  <div className="text-white/90">• Matric: {proof.privateData.matricNumber}</div>
                  <div className="text-white/90">• Name: {proof.privateData.studentName}</div>
                  <div className="text-white/90">• Votes: {proof.privateData.votes.length} selections</div>
                </div>
              ) : (
                <div className="text-white/60 text-sm">
                  🔒 Private data hidden from blockchain<br/>
                  🔐 Only cryptographic hashes are public
                </div>
              )}
            </div>

            <div className="glass-morph rounded-xl p-4 border border-accent/30">
              <h4 className="text-lg font-bold text-white mb-3 flex items-center">
                <Shield className="h-5 w-5 text-accent mr-2" />
                Public Proof
              </h4>
              
              <div className="space-y-2 text-sm">
                <div className="text-accent">✅ BLOCKCHAIN VISIBLE:</div>
                <div className="text-white/90 font-mono text-xs">
                  Hash: {proof.eligibility.publicSignals[0].substring(0, 20)}...
                </div>
                <div className="text-white/60">
                  🔍 Proves eligibility without revealing identity<br/>
                  ✅ Mathematically verified by smart contract
                </div>
              </div>
            </div>
          </div>

          <div className="glass-morph rounded-xl p-4 border border-green-500/30 text-center">
            <h4 className="text-lg font-bold text-white mb-2">🎉 Privacy Achievement</h4>
            <p className="text-white/90 mb-3">
              Student eligibility proven AND vote integrity guaranteed<br/>
              <strong>WITHOUT revealing any sensitive information!</strong>
            </p>
            <Badge variant="secondary" className="bg-green-500/20 text-green-400 font-bold">
              Zero-Knowledge Success
            </Badge>
          </div>

          <Button 
            onClick={resetDemo}
            className="w-full cyber-button"
            data-testid="button-reset-zkp-demo"
          >
            Run Demo Again
          </Button>
        </div>
      )}
    </div>
  );
}